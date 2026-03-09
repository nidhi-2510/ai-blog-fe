using System;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using AIBlog.Backend.Data;
using AIBlog.Backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace AIBlog.Backend.Services
{
    public class BlogGenerationJob
    {
        private readonly AppDbContext _dbContext;
        private readonly IConfiguration _configuration;
        private readonly ILogger<BlogGenerationJob> _logger;
        private readonly HttpClient _httpClient;

        public BlogGenerationJob(AppDbContext dbContext, IConfiguration configuration, ILogger<BlogGenerationJob> logger)
        {
            _dbContext = dbContext;
            _configuration = configuration;
            _logger = logger;
            _httpClient = new HttpClient();
        }

        public async Task GenerateDailyBlogsAsync()
        {
            _logger.LogInformation("Starting daily blog generation job.");

            var today = DateOnly.FromDateTime(DateTime.UtcNow);
            var topicsToProcess = await _dbContext.Topics
                .Where(t => t.ScheduledDate == today && t.Status == TopicStatus.Pending)
                .ToListAsync();

            if (!topicsToProcess.Any())
            {
                _logger.LogInformation("No pending topics found for today.");
                return;
            }

            var apiKey = _configuration["Gemini:ApiKey"];
            if (string.IsNullOrEmpty(apiKey))
            {
                _logger.LogError("Gemini API key is not configured.");
                return;
            }

            foreach (var topic in topicsToProcess)
            {
                try
                {
                    _logger.LogInformation($"Generating blog post for topic: {topic.Title}");

                    var content = await GenerateContentWithGeminiAsync(topic.Title, apiKey);
                    if (!string.IsNullOrEmpty(content))
                    {
                        var blogPost = new BlogPost
                        {
                            TopicId = topic.Id,
                            Title = topic.Title,
                            Content = content,
                            Status = BlogPostStatus.Draft, // Saving as draft initially
                            CreatedAt = DateTime.UtcNow,
                            UpdatedAt = DateTime.UtcNow
                        };

                        _dbContext.BlogPosts.Add(blogPost);
                        topic.Status = TopicStatus.Generated;
                        
                        _logger.LogInformation($"Successfully generated and saved blog post for topic: {topic.Title}");
                    }
                    else
                    {
                        topic.Status = TopicStatus.Failed;
                        _logger.LogWarning($"Failed to generate content for topic: {topic.Title}");
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, $"Error processing topic: {topic.Title}");
                    topic.Status = TopicStatus.Failed;
                }
            }

            await _dbContext.SaveChangesAsync();
            _logger.LogInformation("Completed daily blog generation job.");
        }

        private async Task<string?> GenerateContentWithGeminiAsync(string title, string apiKey)
        {
            var requestUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent";
            var request = new HttpRequestMessage(HttpMethod.Post, requestUrl);
            request.Headers.Add("x-goog-api-key", apiKey);
            
            var prompt = $"Write a comprehensive and engaging blog post about: {title}. Format the output in Markdown or HTML.";
            
            var requestData = new
            {
                contents = new[]
                {
                    new
                    {
                        parts = new[] { new { text = prompt } }
                    }
                }
            };
            
            var serializeOptions = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
            var content = new StringContent(JsonSerializer.Serialize(requestData, serializeOptions), Encoding.UTF8, "application/json");
            request.Content = content;

            var response = await _httpClient.SendAsync(request);
            response.EnsureSuccessStatusCode();

            var responseString = await response.Content.ReadAsStringAsync();
            using var jsonDocument = JsonDocument.Parse(responseString);
            
            var root = jsonDocument.RootElement;
            if (root.TryGetProperty("candidates", out var candidates) && candidates.GetArrayLength() > 0)
            {
                var firstCandidate = candidates[0];
                if (firstCandidate.TryGetProperty("content", out var textContent) &&
                    textContent.TryGetProperty("parts", out var parts) && parts.GetArrayLength() > 0)
                {
                    var firstPart = parts[0];
                    if (firstPart.TryGetProperty("text", out var text))
                    {
                        return text.GetString();
                    }
                }
            }

            return null;
        }
    }
}
