import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import { FilterMatchMode } from "primereact/api";
import { InputText } from "primereact/inputtext";
import { CiSearch } from "react-icons/ci";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { AiFillEdit } from "react-icons/ai";
import { BiTrash } from "react-icons/bi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../../api.js";
const ManageEvent = () => {
  const [events, setEvents] = useState([]);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [editingEvent, setEditingEvent] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await api.get("/events");
      setEvents(response.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Failed to fetch events. Please try again.");
      setLoading(false);
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setShowDialog(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/events/${id}`);
      await fetchEvents();
      toast.success("Event deleted successfully!");
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event. Please try again.");
    }
  };

  const handleSave = async () => {
    if (editingEvent) {
      const formData = new FormData();
      for (const key in editingEvent) {
        if (key !== "image") {
          formData.append(key, editingEvent[key]);
        }
      }
      if (editingEvent.image instanceof File) {
        formData.append("image", editingEvent.image, editingEvent.image.name);
      }

      try {
        const response = await api.patch(
          `/events/${editingEvent._id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        toast.success("Event updated successfully!");
        await fetchEvents();
        setShowDialog(false);
        setEditingEvent(null);
      } catch (error) {
        console.error("Error updating event:", error);
        toast.error(
          error.response?.data?.message ||
            "Failed to update event. Please try again."
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
      <h2 className="text-2xl font-semibold mb-6">Manage Events</h2>

      <div className="relative mb-4 w-[25%]">
        <div className="flex items-center rounded-lg shadow-sm">
          <span className="px-3 text-gray-500">
            <CiSearch className="text-xl" />
          </span>
          <InputText
            placeholder="Search Events..."
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
          value={events}
          filters={filters}
          className="rounded-lg shadow-sm"
        >
          <Column field="event_title" header="Event Title" sortable />
          <Column
            field="dateTime"
            header="Date & Time"
            sortable
            body={(rowData) => new Date(rowData.dateTime).toLocaleString()}
          />
          <Column field="location" header="Location" sortable />
          <Column field="description" header="Description" sortable />
          <Column body={actionBodyTemplate} header="Actions" />
        </DataTable>
      )}

      <Dialog
        header="Edit Event"
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
        {editingEvent && (
          <div className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="event_title"
                className="block text-gray-700 font-semibold"
              >
                Event Title
              </label>
              <input
                id="event_title"
                value={editingEvent.event_title}
                onChange={(e) =>
                  setEditingEvent({
                    ...editingEvent,
                    event_title: e.target.value,
                  })
                }
                className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="dateTime"
                className="block text-gray-700 font-semibold"
              >
                Date and Time
              </label>
              <input
                id="dateTime"
                value={editingEvent.dateTime}
                onChange={(e) =>
                  setEditingEvent({ ...editingEvent, dateTime: e.target.value })
                }
                type="datetime-local"
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
                value={editingEvent.location}
                onChange={(e) =>
                  setEditingEvent({ ...editingEvent, location: e.target.value })
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
                value={editingEvent.description}
                onChange={(e) =>
                  setEditingEvent({
                    ...editingEvent,
                    description: e.target.value,
                  })
                }
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="image"
                className="block text-gray-700 font-semibold"
              >
                Event Image
              </label>
              {editingEvent.image && (
                <img
                  src={editingEvent.image}
                  alt={editingEvent.event_title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              )}
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={(e) =>
                  setEditingEvent({ ...editingEvent, image: e.target.files[0] })
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

export default ManageEvent;
