using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AIBlog.Backend.Data;
using AIBlog.Backend.Models;
using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace AIBlog.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BlogsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BlogsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetBlogs([FromQuery] bool publishedOnly = true)
        {
            var query = _context.BlogPosts.Include(b => b.Topic).Include(b => b.Images).AsQueryable();

            if (publishedOnly)
            {
                query = query.Where(b => b.Status == BlogPostStatus.Published);
            }

            var blogs = await query.OrderByDescending(b => b.PublishedAt).ToListAsync();
            return Ok(blogs);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetBlog(Guid id)
        {
            var blog = await _context.BlogPosts
                .Include(b => b.Topic)
                .Include(b => b.Images)
                .Include(b => b.Comments)
                .Include(b => b.Likes)
                .FirstOrDefaultAsync(b => b.Id == id);

            if (blog == null) return NotFound();

            return Ok(blog);
        }

        [HttpPost("{id}/approve")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ApproveBlog(Guid id)
        {
            var blog = await _context.BlogPosts.FindAsync(id);
            if (blog == null) return NotFound();

            blog.Status = BlogPostStatus.Published;
            blog.PublishedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return Ok(blog);
        }

        [HttpPost("{id}/reject")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> RejectBlog(Guid id)
        {
            var blog = await _context.BlogPosts.FindAsync(id);
            if (blog == null) return NotFound();

            blog.Status = BlogPostStatus.Rejected;
            await _context.SaveChangesAsync();

            return Ok(blog);
        }
    }
}
