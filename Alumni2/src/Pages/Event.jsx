import React, { useState, useEffect } from "react";
import { FaLocationDot, FaCalendarPlus, FaCalendar } from "react-icons/fa6";
import { useAuth } from "../AuthContext";
import Modal from "./Modal.jsx";
import CreateEvent from "../DashboardComponent/Side-component/CreateEvent";
import api from "../../api.js";
import { CiSearch } from "react-icons/ci";

const Event = () => {
  const { isLoggedIn } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      const response = await api.get("/events");
      setEvents(response.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching events:", error);
      setEvents([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const filteredEvents = events.filter((event) =>
    event.event_title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  p-6">
      <div className="max-w-7xl mx-auto mb-12">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Events
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Stay connected with the latest events and gatherings in our
            community
          </p>
        </div>
      </div>

      {/* Search and Add Section */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="w-full md:w-96">
            <div className="relative">
              <input
                type="text"
                placeholder="Search events by title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-4 pl-12 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              />
              <CiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
            </div>
          </div>
          {isLoggedIn && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full md:w-auto bg-teal-500 py-3 px-6 text-white rounded-lg hover:bg-teal-600 transition-colors flex items-center justify-center gap-2"
            >
              <FaCalendarPlus />
              Add New Event
            </button>
          )}
        </div>
      </div>

      {/* Events Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents?.map((event) => (
            <div
              key={event._id}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border-2 border-gray-100"
            >
              {event.image && (
                <img
                  src={event.image}
                  alt={event.event_title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/placeholder-image.jpg"; // Add a fallback image
                  }}
                />
              )}
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-sm font-medium text-gray-500">
                    Title
                  </span>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {event.event_title}
                  </h2>
                </div>

                <div className="space-y-1">
                  <span className="text-sm font-medium text-gray-500">
                    Description
                  </span>
                  <p className="text-base text-gray-600 line-clamp-3">
                    {event.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-sm font-medium text-gray-500">
                        Location
                      </span>
                      <div className="flex items-center text-gray-600">
                        <FaLocationDot className="mr-2 text-teal-500" />
                        {event.location}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-sm font-medium text-gray-500">
                        Date & Time
                      </span>
                      <div className="flex items-center text-gray-600">
                        <FaCalendar className="mr-2 text-teal-500" />
                        {new Date(event.dateTime).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <FaCalendarPlus className="mx-auto text-6xl text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">No events found</p>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Event"
      >
        <CreateEvent
          onSuccess={() => {
            fetchEvents();
          }}
        />
      </Modal>
    </div>
  );
};

export default Event;
