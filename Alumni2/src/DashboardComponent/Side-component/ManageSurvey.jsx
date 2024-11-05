import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { ToastContainer, toast } from "react-toastify";
import { AiFillEdit } from "react-icons/ai";
import { BiTrash } from "react-icons/bi";
import "react-toastify/dist/ReactToastify.css";
import api from "../../../api.js";
import { FilterMatchMode } from "primereact/api";
import { CiSearch } from "react-icons/ci";

const ManageSurvey = () => {
  const [surveys, setSurveys] = useState([]);
  const [editingSurvey, setEditingSurvey] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  useEffect(() => {
    fetchSurveys();
  }, []);

  const fetchSurveys = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You must be logged in to view surveys.");
        return;
      }
      const response = await api.get("/surveys", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSurveys(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching surveys:", error);
      toast.error("Failed to fetch surveys. Please try again.");
      setLoading(false);
    }
  };

  const handleEdit = (survey) => {
    setEditingSurvey(survey);
    setShowDialog(true);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You must be logged in to delete a survey.");
        return;
      }
      await api.delete(`/surveys/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchSurveys();
      toast.success("Survey deleted successfully!");
    } catch (error) {
      console.error("Error deleting survey:", error);
      toast.error("Failed to delete survey. Please try again.");
    }
  };

  // Replace lines 71-80 with:
  const handleSave = async () => {
    if (editingSurvey) {
      const formData = new FormData();
      for (const key in editingSurvey) {
        if (key === "image") {
          if (editingSurvey[key] instanceof File) {
            formData.append(key, editingSurvey[key], editingSurvey[key].name);
          }
        } else if (
          key !== "_id" &&
          key !== "createdAt" &&
          key !== "updatedAt"
        ) {
          formData.append(key, editingSurvey[key]);
        }
      }

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("You must be logged in to update a survey.");
          return;
        }
        const response = await api.patch(
          `/surveys/${editingSurvey._id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success(response.data.message || "Survey updated successfully!");
        await fetchSurveys();
        setShowDialog(false);
        setEditingSurvey(null);
      } catch (error) {
        console.error("Error updating survey:", error);
        toast.error(
          error.response?.data?.message ||
            "Failed to update survey. Please try again."
        );
      }
    }
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="flex justify-center space-x-2">
        <Button
          icon={<AiFillEdit />}
          className="text-emerald-500 hover:text-emerald-700 border-none text-sm px-3 py-1 transition-colors focus:ring-0 focus:shadow-none"
          onClick={() => handleEdit(rowData)}
        />
        <Button
          icon={<BiTrash />}
          className="text-rose-500 hover:text-rose-700 border-none text-sm px-3 py-1 transition-colors focus:ring-0 focus:shadow-none"
          onClick={() => handleDelete(rowData._id)}
        />
      </div>
    );
  };

  return (
    <div className="w-full">
      <ToastContainer />
      <h2 className="text-2xl font-semibold mb-6">Manage Surveys</h2>

      <div className="relative mb-4 w-[25%]">
        <div className="flex items-center rounded-lg shadow-sm">
          <span className="px-3 text-gray-500">
            <CiSearch className="text-xl" />
          </span>
          <InputText
            placeholder="Search Surveys..."
            onInput={(e) => {
              setFilters({
                ...filters,
                global: {
                  value: e.target.value,
                  matchMode: FilterMatchMode.CONTAINS,
                },
              });
            }}
            className="p-2 w-full focus:outline-none border-none"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : (
        <DataTable
          value={surveys}
          filters={filters}
          className="rounded-lg shadow-sm"
        >
          <Column field="survey_title" header="Survey Title" sortable />
          <Column field="description" header="Description" sortable />
          <Column field="survey_link" header="Link" sortable />
          <Column body={actionBodyTemplate} header="Actions" />
        </DataTable>
      )}

      <Dialog
        header="Edit Survey"
        visible={showDialog}
        onHide={() => setShowDialog(false)}
        style={{ width: "50vw" }}
        footer={
          <div>
            <Button
              label="Cancel"
              icon="pi pi-times"
              onClick={() => setShowDialog(false)}
              className="p-button-text"
            />
            <Button label="Save" icon="pi pi-check" onClick={handleSave} />
          </div>
        }
      >
        {editingSurvey && (
          <div className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="survey_title"
                className="block text-gray-700 font-semibold"
              >
                Title
              </label>
              <InputText
                id="survey_title"
                value={editingSurvey.survey_title}
                onChange={(e) =>
                  setEditingSurvey({
                    ...editingSurvey,
                    survey_title: e.target.value,
                  })
                }
                className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="description"
                className="block text-gray-700 font-semibold"
              >
                Description
              </label>
              <InputTextarea
                id="description"
                value={editingSurvey.description}
                onChange={(e) =>
                  setEditingSurvey({
                    ...editingSurvey,
                    description: e.target.value,
                  })
                }
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="survey_link"
                className="block text-gray-700 font-semibold"
              >
                External Link
              </label>
              <InputText
                id="survey_link"
                value={editingSurvey.survey_link}
                onChange={(e) =>
                  setEditingSurvey({
                    ...editingSurvey,
                    survey_link: e.target.value,
                  })
                }
                className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="image"
                className="block text-gray-700 font-semibold"
              >
                Survey Image
              </label>
              {editingSurvey.image && (
                <img
                  src={editingSurvey.image}
                  alt={editingSurvey.survey_title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              )}
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={(e) =>
                  setEditingSurvey({
                    ...editingSurvey,
                    image: e.target.files[0],
                  })
                }
                className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
};

export default ManageSurvey;
