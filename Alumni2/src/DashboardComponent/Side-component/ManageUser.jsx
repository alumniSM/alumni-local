import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { FilterMatchMode } from "primereact/api";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { CiSearch } from "react-icons/ci";
import { ToastContainer, toast } from "react-toastify";
import api from "../../../api";
import "react-toastify/dist/ReactToastify.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import { FiDownload } from "react-icons/fi";

const ManageUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [confirmDialog, setConfirmDialog] = useState({
    visible: false,
    type: null,
    userId: null,
  });

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // API calls
  const fetchUsers = async () => {
    try {
      const response = await api.get("/users/pending");
      setUsers(response.data || []);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to fetch pending users");
      setLoading(false);
    }
  };

  const handleUserAction = async (id, action) => {
    try {
      if (action === "approve") {
        await api.patch(`/users/verify/${id}`, { isVerified: true });
        toast.success("User approved successfully!");
      } else {
        await api.delete(`/users/${id}`);
        toast.success("User rejected successfully!");
      }
      await fetchUsers();
    } catch (error) {
      toast.error(`Failed to ${action} user`);
    }
    setConfirmDialog({ visible: false, type: null, userId: null });
  };

  const handleDownload = async (documentUrl) => {
    try {
      if (!documentUrl) {
        toast.error("No document available");
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      // For Cloudinary URLs
      if (documentUrl.includes("cloudinary.com")) {
        try {
          // Get signed URL from backend
          const response = await api.get(
            `/users/document/${encodeURIComponent(documentUrl)}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!response.data || !response.data.secure_url) {
            throw new Error("Failed to get download URL");
          }

          // Use the signed URL for download
          window.open(response.data.secure_url, "_blank");
        } catch (error) {
          console.error("Download error:", error);
          toast.error(`Failed to download document: ${error.message}`);
        }
        return;
      }

      // For non-Cloudinary URLs
      const response = await api.get(
        `/users/document/${encodeURIComponent(documentUrl)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      );

      if (response.data) {
        const blob = new Blob([response.data]);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;

        // Get filename from URL
        const fileName = documentUrl.split("/").pop().split("?")[0];
        link.setAttribute("download", fileName);

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download document");
    }
  };
  // UI Components
  const SearchBar = () => (
    <div className="relative mb-4 w-[25%]">
      <div className="flex items-center rounded-lg shadow-sm">
        <span className="px-3 text-gray-500">
          <CiSearch className="text-xl" />
        </span>
        <InputText
          placeholder="Search users..."
          value={filters.global.value || ""}
          onChange={(e) => {
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
  );

  const ActionButtons = ({ rowData }) => (
    <div className="flex justify-center gap-2">
      <Button
        label="Approve"
        className="text-emerald-500 hover:text-emerald-700 border-none text-sm px-3 py-1 transition-colors focus:ring-0 focus:shadow-none"
        onClick={() =>
          setConfirmDialog({
            visible: true,
            type: "approve",
            userId: rowData._id,
          })
        }
      />
      <Button
        label="Reject"
        className="text-rose-500 hover:text-rose-700 border-none text-sm px-3 py-1 transition-colors focus:ring-0 focus:shadow-none"
        onClick={() =>
          setConfirmDialog({
            visible: true,
            type: "reject",
            userId: rowData._id,
          })
        }
      />
    </div>
  );

  const ConfirmationDialog = () => (
    <Dialog
      visible={confirmDialog.visible}
      onHide={() =>
        setConfirmDialog({ visible: false, type: null, userId: null })
      }
      header={
        confirmDialog.type === "approve"
          ? "Confirm Approval"
          : "Confirm Rejection"
      }
      footer={
        <div className="flex justify-end gap-3 p-3">
          <Button
            label="No"
            className="text-gray-500 hover:text-gray-700 px-4 py-2 transition-colors focus:ring-0 focus:shadow-none"
            onClick={() => setConfirmDialog({ visible: false })}
          />
          <Button
            label="Yes"
            className="text-blue-500 hover:text-blue-700 px-4 py-2 transition-colors focus:ring-0 focus:shadow-none"
            onClick={() =>
              handleUserAction(confirmDialog.userId, confirmDialog.type)
            }
          />
        </div>
      }
    >
      <p className="p-4">
        {confirmDialog.type === "approve"
          ? "Are you sure you want to approve this user?"
          : "Are you sure you want to reject this user? This action cannot be undone."}
      </p>
    </Dialog>
  );

  return (
    <div className="w-full">
      <ToastContainer />
      <h2 className="text-2xl font-semibold mb-6">Manage Pending Users</h2>
      <SearchBar />

      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : (
        <DataTable
          value={users}
          filters={filters}
          className="rounded-lg shadow-sm"
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          emptyMessage="No pending users found"
        >
          <Column field="first_name" header="First Name" sortable />
          <Column field="last_name" header="Last Name" sortable />
          <Column field="email" header="Email" sortable />
          <Column field="department" header="Department" sortable />
          <Column field="batch" header="Batch" sortable />
          <Column
            field="tempDocument"
            header="Document"
            body={(rowData) =>
              rowData.tempDocument ? (
                <Button
                  icon={<FiDownload className="text-lg" />}
                  tooltip="Download Document"
                  className="text-blue-500 hover:text-blue-700 border-none text-sm px-2 py-1 transition-colors focus:ring-0 focus:shadow-none"
                  onClick={() => handleDownload(rowData.tempDocument)}
                />
              ) : (
                <span className="text-gray-400">No document</span>
              )
            }
          />
          <Column
            body={(rowData) => <ActionButtons rowData={rowData} />}
            header="Actions"
          />
        </DataTable>
      )}

      <ConfirmationDialog />
    </div>
  );
};

export default ManageUser;
