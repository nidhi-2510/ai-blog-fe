using System;

namespace AIBlog.Backend.Models
{
    public class BlogImage
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid BlogPostId { get; set; }
        public BlogPost? BlogPost { get; set; }
        
        public string ImageUrl { get; set; } = string.Empty;
        public string Prompt { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
