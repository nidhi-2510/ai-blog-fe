using System;
using System.Collections.Generic;

namespace AIBlog.Backend.Models
{
    public enum BlogPostStatus
    {
        Draft,
        Published,
        Rejected
    }

    public class BlogPost
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid TopicId { get; set; }
        public Topic? Topic { get; set; }

        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty; // HTML or Markdown
        
        public BlogPostStatus Status { get; set; } = BlogPostStatus.Draft;
        public DateTime? PublishedAt { get; set; }
        
        public Guid? AuthorId { get; set; }
        public User? Author { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public ICollection<BlogImage> Images { get; set; } = new List<BlogImage>();
        public ICollection<Comment> Comments { get; set; } = new List<Comment>();
        public ICollection<Like> Likes { get; set; } = new List<Like>();
    }
}
