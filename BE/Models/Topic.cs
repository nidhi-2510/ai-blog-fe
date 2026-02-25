using System;

namespace AIBlog.Backend.Models
{
    public enum TopicStatus
    {
        Pending,
        Generated,
        Failed
    }

    public class Topic
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Title { get; set; } = string.Empty;
        public string? WebsiteUrl { get; set; } = string.Empty;
        public DateOnly ScheduledDate { get; set; }
        public TopicStatus Status { get; set; } = TopicStatus.Pending;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
