using System;

namespace AIBlog.Backend.Models
{
    public class Like
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid BlogPostId { get; set; }
        public BlogPost? BlogPost { get; set; }

        public string IpAddress { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
