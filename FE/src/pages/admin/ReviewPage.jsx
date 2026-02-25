import { useState, useEffect } from "react";
import api from "../../utils/api";
import { format } from "date-fns";
import { MdCheckCircle, MdCancel, MdVisibility } from "react-icons/md";

const ReviewPage = () => {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDrafts();
  }, []);

  const fetchDrafts = async () => {
    try {
      // Fetch all blogs, filter for drafts on client or server
      // For now, assume server returns all and we filter
      const res = await api.get("/api/blogs?publishedOnly=false");
      // Filter for Draft (0)
      const draftPosts = res.data.filter((post) => post.status === 0);
      setDrafts(draftPosts);
    } catch (err) {
      console.error("Failed to fetch drafts", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (
      !confirm(
        "Are you sure you want to approve this post? It will be published immediately.",
      )
    )
      return;
    try {
      await api.post(`/api/blogs/${id}/approve`);
      setDrafts(drafts.filter((d) => d.id !== id));
    } catch (err) {
      alert("Failed to approve post");
      console.error(err);
    }
  };

  const handleReject = async (id) => {
    if (!confirm("Are you sure you want to reject this post?")) return;
    try {
      await api.post(`/api/blogs/${id}/reject`);
      setDrafts(drafts.filter((d) => d.id !== id));
    } catch (err) {
      alert("Failed to reject post");
      console.error(err);
    }
  };

  if (loading) return <div className="p-6">Loading drafts...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Pending Reviews</h2>

      {drafts.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center text-gray-500">
          <p>No posts pending approval. Great job!</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {drafts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-lg shadow overflow-hidden flex flex-col md:flex-row"
            >
              <div className="md:w-1/3 h-48 md:h-auto bg-gray-200 relative">
                {post.images && post.images.length > 0 ? (
                  <img
                    src={post.images[0].imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm text-gray-500">
                      Topic: {post.topic?.title || "Unknown Topic"}
                    </span>
                    <span className="text-xs font-semibold bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                      DRAFT
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 line-clamp-3 mb-4">
                    {/* Strip HTML tags for preview usually, but assuming plain text or raw HTML */}
                    {post.content.replace(/<[^>]*>?/gm, "").substring(0, 150)}
                    ...
                  </p>
                  <p className="text-xs text-gray-400">
                    Generated on {format(new Date(post.createdAt), "PPP p")}
                  </p>
                </div>
                <div className="mt-6 flex gap-3 justify-end">
                  <button className="flex items-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition-colors">
                    <MdVisibility /> Preview
                  </button>
                  <button
                    onClick={() => handleReject(post.id)}
                    className="flex items-center gap-2 px-4 py-2 border border-red-600 text-red-600 rounded hover:bg-red-50 transition-colors"
                  >
                    <MdCancel /> Reject
                  </button>
                  <button
                    onClick={() => handleApprove(post.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors shadow-sm"
                  >
                    <MdCheckCircle /> Approve & Publish
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewPage;
