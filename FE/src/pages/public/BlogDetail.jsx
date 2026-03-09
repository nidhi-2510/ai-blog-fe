import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../utils/api";
import { format } from "date-fns";
import { MdThumbUp, MdComment, MdShare, MdArrowBack } from "react-icons/md";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  if (!blog)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-red-500 font-bold text-2xl bg-white p-8 rounded-2xl shadow-sm border border-red-100">
          Blog not found
        </div>
      </div>
    );

  return (
    <div className="min-h-screen font-sans bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-50 via-white to-white pb-20">
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link
            to="/"
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors rounded-full"
          >
            <MdArrowBack size={24} />
          </Link>
          <h1 className="text-lg font-bold text-gray-800 truncate border-l pl-4 border-gray-200">
            {blog.title}
          </h1>
        </div>
      </header>

      <article className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-12">
          {blog.images && blog.images.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              {blog.images.map((img) => (
                <div
                  key={img.id}
                  className={`overflow-hidden rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 relative group ${blog.images.length === 1 ? "md:col-span-2 h-[500px]" : "h-72"}`}
                >
                  <img
                    src={img.imageUrl}
                    alt={`Generated for ${blog.title}`}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
              ))}
            </div>
          ) : null}

          <div className="max-w-3xl mx-auto">
            <div className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-bold text-xs uppercase tracking-widest mb-6 border border-blue-100">
              {blog.topic?.title || "AI Insight"}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-700 mb-6 leading-[1.15]">
              {blog.title}
            </h1>
            <div className="flex items-center text-gray-500 text-sm mb-12 py-6 border-y border-gray-100">
              <span className="flex items-center gap-1.5 font-medium">
                <svg
                  className="w-4 h-4 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {format(
                  new Date(blog.publishedAt || blog.createdAt),
                  "MMMM d, yyyy",
                )}
              </span>
              <span className="mx-4 text-gray-300">|</span>
              <span className="flex items-center gap-1.5 font-medium bg-gray-100 px-2 py-1 rounded-md">
                Status:{" "}
                {blog.status === 1 || blog.status === "Published" ? (
                  <span className="text-green-600">Published</span>
                ) : blog.status === 2 || blog.status === "Rejected" ? (
                  <span className="text-red-500">Rejected</span>
                ) : (
                  <span className="text-yellow-600">Draft</span>
                )}
              </span>
            </div>

            <div className="prose prose-lg md:prose-xl prose-blue max-w-none text-gray-700 prose-headings:text-gray-900 prose-headings:font-bold prose-img:rounded-2xl prose-img:shadow-lg prose-a:text-blue-600 hover:prose-a:text-blue-500 selection:bg-blue-100 selection:text-blue-900">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {blog.content}
              </ReactMarkdown>
            </div>
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
