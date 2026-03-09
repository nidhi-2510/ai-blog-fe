/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  addMonths,
  subMonths,
  getDay,
} from "date-fns";
import {
  MdChevronLeft,
  MdChevronRight,
  MdAdd,
  MdEvent,
  MdClose,
} from "react-icons/md";
import api from "../../utils/api";

const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [topics, setTopics] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTopicDate, setNewTopicDate] = useState(null);
  const [newTopicTitle, setNewTopicTitle] = useState("");
  const [editingTopic, setEditingTopic] = useState(null);

  const fetchTopics = async () => {
    try {
      const res = await api.get("/api/topics");

      setTopics(res.data);
    } catch (err) {
      console.error("Failed to fetch topics", err);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Calculate padding days for the start of the month
  const startDay = getDay(monthStart); // 0 (Sun) to 6 (Sat)
  const paddingDays = Array.from({ length: startDay });

  const getTopicsForDay = (day) => {
    return topics.filter((topic) =>
      isSameDay(new Date(topic.scheduledDate), day),
    );
  };

  const handleDayClick = (day) => {
    setNewTopicDate(day);
    setNewTopicTitle(""); // Reset title
    setEditingTopic(null);
    setIsModalOpen(true);
  };

  const handleTopicClick = (topic, e) => {
    e.stopPropagation();
    setNewTopicDate(new Date(topic.scheduledDate));
    setNewTopicTitle(topic.title);
    setEditingTopic(topic);
    setIsModalOpen(true);
  };

  const handleSaveTopic = async () => {
    if (!newTopicTitle) return;

    try {
      const payload = {
        title: newTopicTitle,
        scheduledDate: format(newTopicDate, "yyyy-MM-dd"),
        status: editingTopic ? editingTopic.status : 0, // Preserve status if editing
        id: editingTopic ? editingTopic.id : undefined,
      };

      if (editingTopic) {
        await api.put(`/api/topics/${editingTopic.id}`, payload);
      } else {
        await api.post("/api/topics", payload);
      }

      fetchTopics();
      setIsModalOpen(false);
      setNewTopicTitle("");
      setEditingTopic(null);
    } catch (err) {
      console.error(err);
      alert("Failed to save topic");
    }
  };

  const handleDeleteTopic = async () => {
    if (!editingTopic) return;
    if (!window.confirm("Are you sure you want to delete this topic?")) return;

    try {
      await api.delete(`/api/topics/${editingTopic.id}`);
      fetchTopics();
      setIsModalOpen(false);
      setNewTopicTitle("");
      setEditingTopic(null);
    } catch (err) {
      console.error(err);
      alert("Failed to delete topic");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {format(currentDate, "MMMM yyyy")}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={handlePrevMonth}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <MdChevronLeft size={24} />
          </button>
          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <MdChevronRight size={24} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px type-grid bg-gray-200 border border-gray-200 flex-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="bg-gray-50 p-2 text-center font-semibold text-gray-500 uppercase text-xs tracking-wider"
          >
            {day}
          </div>
        ))}

        {paddingDays.map((_, i) => (
          <div key={`padding-${i}`} className="bg-gray-50/50 min-h-[120px]" />
        ))}

        {daysInMonth.map((day) => {
          const dayTopics = getTopicsForDay(day);
          const isToday = isSameDay(day, new Date());

          return (
            <div
              key={day.toString()}
              className="bg-white min-h-[120px] p-2 hover:bg-blue-50 cursor-pointer transition-colors relative group"
              onClick={() => handleDayClick(day)}
            >
              <span
                className={`text-sm font-medium w-6 h-6 flex items-center justify-center rounded-full ${isToday ? "bg-blue-600 text-white" : "text-gray-700"}`}
              >
                {format(day, "d")}
              </span>

              <div className="mt-2 space-y-1">
                {dayTopics.map((topic) => (
                  <div
                    key={topic.id}
                    className="text-xs bg-blue-100 text-blue-800 p-1 rounded truncate border-l-2 border-blue-500"
                    onClick={(e) => handleTopicClick(topic, e)}
                  >
                    {topic.title}
                  </div>
                ))}
              </div>

              <button className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 bg-blue-500 text-white rounded-full p-1 shadow-sm hover:bg-blue-600 transition-opacity">
                <MdAdd size={16} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Simple Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 shadow-xl">
            <h3 className="text-lg font-bold mb-4 text-gray-800">
              Schedule Topic for{" "}
              <span className="text-blue-600">
                {format(newTopicDate, "MMM d, yyyy")}
              </span>
            </h3>
            <input
              type="text"
              className="w-full border p-2 rounded mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter blog topic..."
              value={newTopicTitle}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveTopic();
              }}
              onChange={(e) => setNewTopicTitle(e.target.value)}
              autoFocus
            />
            <div className="flex justify-between items-center mt-4">
              {editingTopic && (
                <button
                  onClick={handleDeleteTopic}
                  className="px-4 py-2 text-red-600 hover:bg-red-50 rounded"
                >
                  Delete
                </button>
              )}
              <div className="flex gap-2 ml-auto">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveTopic}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {editingTopic ? "Update" : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;
