using System;

namespace AIBlog.Backend.Models
{
    public class Comment
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid BlogPostId { get; set; }
        public BlogPost? BlogPost { get; set; }

        public string AuthorName { get; set; } = string.Empty;
        public string AuthorEmail { get; set; } = string.Empty; // For notifications
        public string Content { get; set; } = string.Empty;
        
        public bool IsApproved { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
