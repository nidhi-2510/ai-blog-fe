import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../utils/api";
import { format } from "date-fns";
import { MdThumbUp, MdComment, MdShare, MdArrowBack } from "react-icons/md";

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState({
    authorName: "",
    authorEmail: "",
    content: "",
  });
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await api.get(`/api/blogs/${id}`);
        setBlog(res.data);
        // Assume comments are included or fetch separately
        setComments(res.data.comments || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  const handleLike = async () => {
    // Implement Like functionality
    alert("Liked!");
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    // Implement comment submission
    alert("Comment submitted for approval!");
    setComment({ authorName: "", authorEmail: "", content: "" });
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!blog)
    return <div className="p-8 text-center text-red-500">Blog not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="bg-white shadow sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/" className="text-gray-600 hover:text-blue-600">
            <MdArrowBack size={24} />
          </Link>
          <h1 className="text-xl font-bold text-gray-800 truncate">
            {blog.title}
          </h1>
        </div>
      </header>

      <article className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          {blog.images && blog.images.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {blog.images.map((img, idx) => (
                <img
                  key={img.id}
                  src={img.imageUrl}
                  alt={`Generated for ${blog.title}`}
                  className={`w-full rounded-lg shadow-lg object-cover ${blog.images.length === 1 ? "md:col-span-2 h-96" : "h-64"}`}
                />
              ))}
            </div>
          ) : null}

          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
            {blog.title}
          </h1>
          <div className="flex items-center text-gray-500 text-sm mb-8 border-b pb-4">
            <span>
              {format(
                new Date(blog.publishedAt || blog.createdAt),
                "MMMM d, yyyy",
              )}
            </span>
            <span className="mx-2">&bull;</span>
            <span>{blog.topic?.title}</span>
          </div>

          <div
            className="prose prose-lg prose-blue max-w-none text-gray-800 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          >
            {/* Content rendered safely typically, assuming backend sanitizer */}
          </div>
        </div>

        {/* Interaction Section */}
        <div className="border-t pt-8 mt-12">
          <div className="flex gap-4 mb-8">
            <button
              onClick={handleLike}
              className="flex items-center gap-2 px-6 py-3 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors font-semibold"
            >
              <MdThumbUp size={20} /> Like ({blog.likes ? blog.likes.length : 0}
              )
            </button>
            <button className="flex items-center gap-2 px-6 py-3 bg-gray-50 text-gray-600 rounded-full hover:bg-gray-100 transition-colors font-semibold">
              <MdShare size={20} /> Share
            </button>
          </div>

          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <MdComment /> Comments ({comments.length})
          </h3>

          <div className="space-y-6 mb-12">
            {comments.length === 0 ? (
              <p className="text-gray-500 italic">
                No comments yet. Be the first to share your thoughts!
              </p>
            ) : (
              comments.map((c) => (
                <div
                  key={c.id}
                  className="bg-white p-4 rounded-lg shadow-sm border border-gray-100"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-gray-800">
                      {c.authorName}
                    </span>
                    <span className="text-xs text-gray-400">
                      {format(new Date(c.createdAt), "MMM d, yyyy")}
                    </span>
                  </div>
                  <p className="text-gray-700">{c.content}</p>
                </div>
              ))
            )}
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h4 className="text-lg font-bold text-gray-800 mb-4">
              Leave a Comment
            </h4>
            <form onSubmit={handleCommentSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={comment.authorName}
                  onChange={(e) =>
                    setComment({ ...comment, authorName: e.target.value })
                  }
                  required
                />
                <input
                  type="email"
                  placeholder="Your Email (private)"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={comment.authorEmail}
                  onChange={(e) =>
                    setComment({ ...comment, authorEmail: e.target.value })
                  }
                  required
                />
              </div>
              <textarea
                placeholder="Your Comment..."
                className="w-full px-4 py-2 border rounded-lg h-32 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                value={comment.content}
                onChange={(e) =>
                  setComment({ ...comment, content: e.target.value })
                }
                required
              ></textarea>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
              >
                Post Comment
              </button>
            </form>
          </div>
        </div>
      </article>
    </div>
  );
};

export default BlogDetail;
