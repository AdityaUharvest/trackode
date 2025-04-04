"use client";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { toast } from "react-toastify";
import { FiEdit, FiTrash2, FiLock, FiUnlock, FiSave, FiX } from "react-icons/fi";
import { useTheme } from "@/components/ThemeContext";

export default function ProfileComponent() {
  const { data: session, update } = useSession();
  const { theme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form data with session data
  useEffect(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name || "",
        email: session.user.email || ""
      });
    }
  }, [session]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // const handleTogglePrivacy = () => {
  //   setFormData(prev => ({ ...prev, isPrivate: !prev.isPrivate }));
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/user/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Update failed");

      await update({
        ...session,
        user: {
          ...session?.user,
          ...formData,
        },
      });

      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account? This cannot be undone.")) return;

    setIsDeleting(true);
    try {
      const response = await fetch("/api/user/delete", {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Deletion failed");

      toast.success("Account deleted successfully");
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      toast.error("Failed to delete account");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className={`max-w-md mx-auto p-4 rounded-lg shadow-sm ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className={`text-lg font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
          My Profile
        </h2>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className={`flex items-center text-sm ${theme === "dark" ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-500"}`}
          >
            <FiEdit className="mr-1" /> Edit
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(false)}
            className={`flex items-center text-sm ${theme === "dark" ? "text-gray-400 hover:text-gray-300" : "text-gray-600 hover:text-gray-500"}`}
          >
            <FiX className="mr-1" /> Cancel
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-xs ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 text-sm rounded border ${theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"}`}
              required
            />
          </div>

          <div>
            <label className={`block text-xs ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 text-sm rounded border ${theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"}`}
              required
            />
          </div>

          <div>
            <label className={`block text-xs ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
              Bio
            </label>
            {/* <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows={3}
              className={`w-full px-3 py-2 text-sm rounded border ${theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"}`}
              maxLength={150}
            />
            <p className={`text-xs mt-1 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
              {formData.bio.length}/150 characters
            </p> */}
          </div>

          <div className="flex items-center">
            {/* <button
              type="button"
              onClick={handleTogglePrivacy}
              className={`flex items-center text-sm mr-4 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
            >
              {formData.isPrivate ? (
                <FiLock className="mr-1 text-red-500" />
              ) : (
                <FiUnlock className="mr-1 text-green-500" />
              )}
              {formData.isPrivate ? "Private Account" : "Public Account"}
            </button> */}

            <button
              type="submit"
              disabled={isLoading}
              className={`flex items-center text-sm px-3 py-1 rounded ${isLoading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"} text-white`}
            >
              {isLoading ? (
                "Saving..."
              ) : (
                <>
                  <FiSave className="mr-1" /> Save
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-3">
          <div>
            <p className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Name</p>
            <p className={`text-sm ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{formData.name}</p>
          </div>

          <div>
            <p className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Email</p>
            <p className={`text-sm ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{formData.email}</p>
          </div>

          {/* {formData.bio && (
            <div>
              <p className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Bio</p>
              <p className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>{formData.bio}</p>
            </div>
          )} */}

          {/* <div className="flex items-center">
            {formData.isPrivate ? (
              <span className="flex items-center text-sm text-red-500">
                <FiLock className="mr-1" /> Private Account
              </span>
            ) : (
              <span className="flex items-center text-sm text-green-500">
                <FiUnlock className="mr-1" /> Public Account
              </span>
            )}
          </div> */}
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleDeleteAccount}
          disabled={isDeleting}
          className={`flex items-center text-sm px-3 py-1 rounded ${isDeleting ? "bg-gray-400" : "bg-red-500 hover:bg-red-600"} text-white`}
        >
          <FiTrash2 className="mr-1" /> {isDeleting ? "Deleting..." : "Delete Account"}
        </button>
        <p className={`text-xs mt-2 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
          Deleting your account will remove all your data permanently.
        </p>
      </div>
    </div>
  );
}