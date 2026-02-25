import { useState, useEffect } from "react";
import api from "../../utils/api";
import { Link } from "react-router-dom";
import { format } from "date-fns";

const HomePage = () => {
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        // By default returns publishedOnly=true
        const res = await api.get("/api/blogs");
        setBlogs(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBlogs();
  }, []);

  const filteredBlogs = blogs.filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">AI Blog</h1>
          <nav className="space-x-4">
            <Link to="/" className="text-gray-600 hover:text-blue-600">
              Home
            </Link>
            <Link to="/admin" className="text-gray-600 hover:text-blue-600">
              Admin
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
            Latest Insights
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our collection of AI-generated articles on various topics.
          </p>
        </div>

        <div className="mb-8 flex justify-center">
          <input
            type="text"
            placeholder="Search articles..."
            className="w-full max-w-md px-4 py-2 border rounded-full shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBlogs.map((blog) => (
            <div
              key={blog.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col"
            >
              <div className="h-48 bg-gray-200 relative">
                {blog.images && blog.images.length > 0 ? (
                  <img
                    src={blog.images[0].imageUrl}
                    alt={blog.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-2">
                  {blog.topic?.title || "Article"}
                </span>
                <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">
                  <Link
                    to={`/blog/${blog.id}`}
                    className="hover:text-blue-600 transition-colors"
                  >
                    {blog.title}
                  </Link>
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3 flex-1">
                  {blog.content.replace(/<[^>]*>?/gm, "").substring(0, 100)}...
                </p>
                <div className="mt-auto flex justify-between items-center text-sm text-gray-500 border-t pt-4">
                  <span>
                    {format(
                      new Date(blog.publishedAt || blog.createdAt),
                      "MMM d, yyyy",
                    )}
                  </span>
                  <span>Read more &rarr;</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>
            &copy; {new Date().getFullYear()} AI Blog System. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
