import React, { useState, useEffect } from "react";
import { IoDocument } from "react-icons/io5";
import { CiSearch } from "react-icons/ci";
import api from "../../api";
import { useAuth } from "../AuthContext";
import Modal from "./Modal";
import CreateSurvey from "../DashboardComponent/Side-component/CreateSurvey";

const Survey = () => {
  const { isLoggedIn } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [surveys, setSurveys] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchSurveys = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        setLoading(false);
        return;
      }
      const response = await api.get("/surveys", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSurveys(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching surveys:", error);
      setSurveys([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSurveys();
  }, []);

  const filteredSurveys = Array.isArray(surveys)
    ? surveys.filter((survey) =>
        survey.survey_title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-800">
        Surveys
      </h1>

      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="w-full md:w-96">
            <div className="relative">
              <input
                type="text"
                placeholder="Search surveys by title..."
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
              <IoDocument />
              Add New Survey
            </button>
          )}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Survey"
      >
        <CreateSurvey
          onSuccess={() => {
            fetchSurveys();
          }}
        />
      </Modal>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredSurveys.length > 0 ? (
          filteredSurveys.map((survey) => (
            <div
              key={survey._id}
              className="p-4 border rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              {survey.image && (
                <img
                  src={
                    survey.image.startsWith("http")
                      ? survey.image
                      : `${import.meta.env.VITE_API_URL}${survey.image}`
                  }
                  alt={survey.survey_title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}
              <h2 className="text-lg font-semibold mb-2">
                <span className="font-bold text-gray-600">Title: </span>
                <span className="text-gray-800">{survey.survey_title}</span>
              </h2>
              <div className="mb-3">
                <span className="font-bold text-gray-600">Description: </span>
                <p className="text-gray-700 text-base mt-1">
                  {survey.description}
                </p>
              </div>
              <a
                className="inline-block w-full text-center bg-teal-500 text-white py-2 px-4 rounded-lg hover:bg-teal-600 transition duration-300 text-base"
                href={survey.survey_link}
                target="_blank"
                rel="noopener noreferrer"
              >
                Take Survey
              </a>
            </div>
          ))
        ) : (
          <p className="col-span-3 text-center text-gray-600 text-lg">
            No surveys found.
          </p>
        )}
      </div>
    </div>
  );
};

export default Survey;
