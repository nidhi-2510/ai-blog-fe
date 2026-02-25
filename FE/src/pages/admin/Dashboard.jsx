import { useState, useEffect } from "react";

import {
  MdArticle,
  MdPendingActions,
  MdCheckCircle,
  MdError,
} from "react-icons/md";

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
    <div>
      <h3 className="text-gray-500 text-sm font-medium uppercase">{title}</h3>
      <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
    </div>
    <div className={`p-4 rounded-full ${color} text-white`}>{icon}</div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalPosts: 0,
    pending: 0,
    published: 0,
    failed: 0,
  });

  useEffect(() => {
    // Mock fetch stats
    // In real implementation, create an endpoint /api/dashboard/stats
    setStats({
      totalPosts: 120,
      pending: 5,
      published: 112,
      failed: 3,
    });
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Posts"
          value={stats.totalPosts}
          icon={<MdArticle size={28} />}
          color="bg-blue-500"
        />
        <StatCard
          title="Pending Review"
          value={stats.pending}
          icon={<MdPendingActions size={28} />}
          color="bg-yellow-500"
        />
        <StatCard
          title="Published"
          value={stats.published}
          icon={<MdCheckCircle size={28} />}
          color="bg-green-500"
        />
        <StatCard
          title="Failed Generations"
          value={stats.failed}
          icon={<MdError size={28} />}
          color="bg-red-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Recent Activity
          </h3>
          <p className="text-gray-500">No recent activity to show.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Upcoming Topics
          </h3>
          <p className="text-gray-500">No upcoming topics scheduled.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
