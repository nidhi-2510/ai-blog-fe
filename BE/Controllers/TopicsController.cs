using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AIBlog.Backend.Data;
using AIBlog.Backend.Models;
using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using AIBlog.Backend.Services;

namespace AIBlog.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TopicsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TopicsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetTopics()
        {
            var topics = await _context.Topics.OrderBy(t => t.ScheduledDate).ToListAsync();
            return Ok(topics);
        }

        [HttpPost]
        [Authorize(Roles = "Marketing,Admin")]
        public async Task<IActionResult> CreateTopic([FromBody] Topic topic)
        {   
            if (topic == null) return BadRequest();

            _context.Topics.Add(topic);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetTopics), new { id = topic.Id }, topic);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Marketing,Admin")]
        public async Task<IActionResult> UpdateTopic(Guid id, [FromBody] Topic topic)
        {
            if (id != topic.Id) return BadRequest();

            _context.Entry(topic).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Marketing,Admin")]
        public async Task<IActionResult> DeleteTopic(Guid id)
        {
            var topic = await _context.Topics.FindAsync(id);
            if (topic == null) return NotFound();

            _context.Topics.Remove(topic);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPost("trigger-generation")]
        public async Task<IActionResult> TriggerBlogGeneration([FromServices] BlogGenerationJob blogGenerationJob)
        {
            // Note: This will generate blogs for any Pending topics scheduled for today.
            // Ensure you have at least one topic scheduled for today's date before testing.
            await blogGenerationJob.GenerateDailyBlogsAsync();
            return Ok(new { message = "Blog generation process completed. Check the console logs for details." });
        }
    }
}
