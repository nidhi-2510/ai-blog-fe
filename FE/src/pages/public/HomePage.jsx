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
        // Fetching all generated blogs (publishedOnly=false) to view them immediately on home
        const res = await api.get("/api/blogs?publishedOnly=false");
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
    <div className="min-h-screen font-sans bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-white to-white relative">
      {/* Decorative background blur */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-blue-400/10 blur-[100px] rounded-full pointer-events-none -z-10"></div>

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
        <div className="mb-12 text-center relative z-10">
          <div className="inline-block px-4 py-1.5 rounded-full bg-blue-100/50 text-blue-700 font-semibold text-sm mb-4 border border-blue-200/50 backdrop-blur-sm">
            Powered by Gemini AI
          </div>
          <h2 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 mb-6 tracking-tight">
            Latest Insights
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
            Explore our cutting-edge collection of dynamically generated
            articles spanning various deep tech and futuristic topics.
          </p>
        </div>

        <div className="mb-12 flex justify-center relative z-10">
          <div className="relative w-full max-w-2xl">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search through AI generated insights..."
              className="w-full pl-12 pr-4 py-4 bg-white/70 backdrop-blur-md border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-full focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 outline-none transition-all text-gray-700 placeholder-gray-400 font-medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
          {filteredBlogs.map((blog) => (
            <div
              key={blog.id}
              className="bg-white/80 backdrop-blur-md rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col group"
            >
              <div className="h-48 bg-gray-100 relative overflow-hidden">
                {/* Status Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm backdrop-blur-md ${blog.status === 1 || blog.status === "Published" ? "bg-green-100/90 text-green-700 border border-green-200" : blog.status === 2 || blog.status === "Rejected" ? "bg-red-100/90 text-red-700 border border-red-200" : "bg-yellow-100/90 text-yellow-700 border border-yellow-200"}`}
                  >
                    {blog.status === 1 || blog.status === "Published"
                      ? "Published"
                      : blog.status === 2 || blog.status === "Rejected"
                        ? "Rejected"
                        : "Draft"}
                  </span>
                </div>
                {blog.images && blog.images.length > 0 ? (
                  <img
                    src={blog.images[0].imageUrl}
                    alt={blog.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gradient-to-br from-gray-50 to-gray-200 group-hover:from-gray-100 group-hover:to-gray-300 transition-colors">
                    <svg
                      className="w-12 h-12 mb-2 opacity-50"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="text-sm font-medium">AI Generated</span>
                  </div>
                )}
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              <div className="p-6 flex-1 flex flex-col relative bg-white/60">
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md uppercase tracking-wider w-fit mb-3 border border-blue-100">
                  {blog.topic?.title || "AI Research"}
                </span>
                <h3 className="text-xl font-bold text-gray-900 mb-3 leading-snug group-hover:text-blue-600 transition-colors">
                  <Link
                    to={`/blog/${blog.id}`}
                    className="before:absolute before:inset-0"
                  >
                    {blog.title}
                  </Link>
                </h3>
                <p className="text-gray-600 mb-5 line-clamp-3 flex-1 text-sm leading-relaxed">
                  {blog.content
                    .replace(/<[^>]*>?/gm, "")
                    .replace(/[*#`]/g, "")
                    .substring(0, 120)}
                  ...
                </p>
                <div className="mt-auto flex justify-between items-center text-sm font-medium text-gray-500 border-t border-gray-100 pt-4">
                  <span className="flex items-center gap-1.5">
                    <svg
                      className="w-4 h-4"
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
                      "MMM d, yyyy",
                    )}
                  </span>
                  <span className="text-blue-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Read <span aria-hidden="true">&rarr;</span>
                  </span>
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
