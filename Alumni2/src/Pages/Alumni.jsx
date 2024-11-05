import React, { useState, useEffect } from "react";
import api from "../../api";

const Alumni = () => {
  const [alumniData, setAlumniData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const alumniPerPage = 6;

  useEffect(() => {
    const fetchAlumniData = async () => {
      try {
        const response = await api.get("/users/verified-alumni");
        console.log("Fetched alumni data:", response.data);
        setAlumniData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching alumni data:", error);
        setLoading(false);
        setError("Failed to fetch alumni data. Please try again later.");
      }
    };

    fetchAlumniData();
  }, []);

  // Filter alumni based on the search term
  const filteredAlumni = alumniData.filter((alumnus) =>
    `${alumnus.first_name} ${alumnus.middle_name || ""}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastAlumni = currentPage * alumniPerPage;
  const indexOfFirstAlumni = indexOfLastAlumni - alumniPerPage;
  const currentAlumni = filteredAlumni.slice(
    indexOfFirstAlumni,
    indexOfLastAlumni
  );

  const totalPages = Math.ceil(filteredAlumni.length / alumniPerPage);

  // Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search alumni by name"
        className="w-full p-3 mb-8 border rounded-lg shadow-lg focus:outline-none focus:ring focus:border-blue-300"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Alumni Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {currentAlumni.map((alumnus) => (
          <div
            key={alumnus._id}
            className="bg-white rounded-lg shadow-xl overflow-hidden transform transition duration-500 hover:scale-105"
          >
            <img
              src={
                alumnus.profile_image
                  ? `${alumnus.profile_image}`
                  : "https://via.placeholder.com/150"
              }
              alt={`${alumnus.first_name} ${alumnus.last_name}`}
              className="h-64 w-full object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold text-center text-gray-800">
                {`${alumnus.first_name} ${alumnus.middle_name || ""}`}
              </h3>
              <p className="text-center text-gray-500">{alumnus.department}</p>
              <p className="text-center text-gray-400">Batch {alumnus.batch}</p>
              <p className="text-center text-blue-500 underline">
                {alumnus.email}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-8">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => paginate(index + 1)}
            className={`mx-1 px-4 py-2 rounded-lg ${
              currentPage === index + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Alumni;
