using Microsoft.EntityFrameworkCore;
using AIBlog.Backend.Models;

namespace AIBlog.Backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Topic> Topics { get; set; }
        public DbSet<BlogPost> BlogPosts { get; set; }
        public DbSet<BlogImage> BlogImages { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<Like> Likes { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User configuration
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            // BlogPost configuration
            modelBuilder.Entity<BlogPost>()
                .HasOne(b => b.Topic)
                .WithMany()
                .HasForeignKey(b => b.TopicId);

            modelBuilder.Entity<BlogPost>()
                .HasOne(b => b.Author)
                .WithMany()
                .HasForeignKey(b => b.AuthorId);

            modelBuilder.Entity<BlogPost>()
                .HasMany(b => b.Images)
                .WithOne(i => i.BlogPost)
                .HasForeignKey(i => i.BlogPostId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<BlogPost>()
                .HasMany(b => b.Comments)
                .WithOne(c => c.BlogPost)
                .HasForeignKey(c => c.BlogPostId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<BlogPost>()
                .HasMany(b => b.Likes)
                .WithOne(l => l.BlogPost)
                .HasForeignKey(l => l.BlogPostId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
