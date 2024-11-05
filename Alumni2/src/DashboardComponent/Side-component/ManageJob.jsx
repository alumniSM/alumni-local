import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import { Button } from "primereact/button";
import { FilterMatchMode } from "primereact/api";
import { InputText } from "primereact/inputtext";
import { CiSearch } from "react-icons/ci";
import { Dialog } from "primereact/dialog";
import { AiFillEdit } from "react-icons/ai";
import { BiTrash } from "react-icons/bi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../../api.js";

const ManageJob = () => {
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [editingJob, setEditingJob] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await api.get("/jobs");
      setJobs(response.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error("Failed to fetch jobs. Please try again.");
      setLoading(false);
    }
  };

  const handleEdit = (job) => {
    setEditingJob(job);
    setShowDialog(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/jobs/${id}`);
      await fetchJobs();
      toast.success("Job deleted successfully!");
    } catch (error) {
      console.error("Error deleting job:", error);
      toast.error("Failed to delete job. Please try again.");
    }
  };

  const handleSave = async () => {
    if (editingJob) {
      const formData = new FormData();
      for (const key in editingJob) {
        if (key !== "image") {
          formData.append(key, editingJob[key]);
        }
      }
      if (editingJob.image instanceof File) {
        formData.append("image", editingJob.image, editingJob.image.name);
      }

      try {
        const response = await api.patch(`/jobs/${editingJob._id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Job updated successfully!");
        await fetchJobs();
        setShowDialog(false);
        setEditingJob(null);
      } catch (error) {
        console.error("Error updating job:", error);
        toast.error(
          error.response?.data?.message ||
            "Failed to update job. Please try again."
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
      <h2 className="text-2xl font-semibold mb-6">Manage Jobs</h2>

      <div className="relative mb-4 w-[25%]">
        <div className="flex items-center rounded-lg shadow-sm">
          <span className="px-3 text-gray-500">
            <CiSearch className="text-xl" />
          </span>

          <InputText
            placeholder="Search Jobs..."
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
          value={jobs}
          filters={filters}
          className="rounded-lg shadow-sm"
        >
          <Column field="title" header="Job Title" sortable />
          <Column field="company_name" header="Company" sortable />
          <Column field="location" header="Location" sortable />
          <Column
            field="deadline"
            header="Deadline"
            sortable
            body={(rowData) => new Date(rowData.deadline).toLocaleDateString()}
          />
          <Column body={actionBodyTemplate} header="Actions" />
        </DataTable>
      )}

      <Dialog
        header="Edit Job"
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
        {editingJob && (
          <div className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="title"
                className="block text-gray-700 font-semibold"
              >
                Title
              </label>
              <input
                id="title"
                value={editingJob.title}
                onChange={(e) =>
                  setEditingJob({ ...editingJob, title: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="company_name"
                className="block text-gray-700 font-semibold"
              >
                Company Name
              </label>
              <input
                id="company_name"
                value={editingJob.company_name}
                onChange={(e) =>
                  setEditingJob({ ...editingJob, company_name: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="location"
                className="block text-gray-700 font-semibold"
              >
                Location
              </label>
              <input
                id="location"
                value={editingJob.location}
                onChange={(e) =>
                  setEditingJob({
                    ...editingJob,
                    location: e.target.value,
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
              <textarea
                id="description"
                value={editingJob.description}
                onChange={(e) =>
                  setEditingJob({
                    ...editingJob,
                    description: e.target.value,
                  })
                }
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="deadline"
                className="block text-gray-700 font-semibold"
              >
                Deadline
              </label>
              <input
                type="date"
                id="deadline"
                value={
                  editingJob.deadline ? editingJob.deadline.split("T")[0] : ""
                }
                onChange={(e) =>
                  setEditingJob({
                    ...editingJob,
                    deadline: e.target.value,
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
                Job Image
              </label>
              {editingJob.image && (
                <img
                  src={`${import.meta.env.VITE_API_URL}${editingJob.image}`}
                  alt="Job"
                  className="w-32 h-32 object-cover mb-2"
                />
              )}
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={(e) =>
                  setEditingJob({ ...editingJob, image: e.target.files[0] })
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

export default ManageJob;
