import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const Home = () => {
  const { token } = useSelector((state) => state.auth);

  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    batch: "",
    linkedinId: "",
    field: "",
    photo: null,
  });
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const api = axios.create({
    baseURL: "http://localhost:5000/api", // adjust if different
    headers: { Authorization: `${token}` },
  });

  // ✅ Fetch all users
  const fetchUsers = async () => {
    try {
      const { data } = await api.get("/getalluser");
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ✅ Handle form field changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo") setFormData({ ...formData, photo: files[0] });
    else setFormData({ ...formData, [name]: value });
  };

  // ✅ Create or update user
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    for (let key in formData) data.append(key, formData[key]);

    try {
      if (editingUser) {
        await api.put(`/edituser/${editingUser._id}`, data);
        alert("User updated successfully!");
      } else {
        await api.post("/create", data);
        alert("User created successfully!");
      }
      fetchUsers();
      setEditingUser(null);
      setFormData({ name: "", batch: "", linkedinId: "", field: "", photo: null });
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Operation failed!");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete user
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/deleteuser/${id}`);
      alert("User deleted successfully!");
      fetchUsers();
    } catch (error) {
      console.error(error);
      alert("Delete failed!");
    }
  };

  // ✅ Edit user
  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      batch: user.batch,
      linkedinId: user.linkedinId,
      field: user.field,
      photo: null,
    });
  };

  return (
    <div className="min-h-screen bg-yellow-100 p-6">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-gray-700">
          👥 User Management Dashboard
        </h1>

        {/* ✅ Create / Edit Form */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6"
          encType="multipart/form-data"
        >
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="border rounded-lg p-3 w-full"
            required
          />
          <input
            type="text"
            name="batch"
            placeholder="Batch"
            value={formData.batch}
            onChange={handleChange}
            className="border rounded-lg p-3 w-full"
          />
          <input
            type="text"
            name="linkedinId"
            placeholder="LinkedIn ID"
            value={formData.linkedinId}
            onChange={handleChange}
            className="border rounded-lg p-3 w-full"
          />
          <input
            type="text"
            name="field"
            placeholder="Field"
            value={formData.field}
            onChange={handleChange}
            className="border rounded-lg p-3 w-full"
          />
          <input
            type="file"
            name="photo"
            accept="image/*"
            onChange={handleChange}
            className="border rounded-lg p-3 w-full sm:col-span-2"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg sm:col-span-2 font-medium transition"
          >
            {loading
              ? "Saving..."
              : editingUser
              ? "Update User"
              : "Create User"}
          </button>
        </form>

        {/* ✅ Users Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm text-gray-700">
            <thead className="bg-yellow-200">
              <tr>
                <th className="p-3 border">Photo</th>
                <th className="p-3 border">Name</th>
                <th className="p-3 border">Batch</th>
                <th className="p-3 border">Field</th>
                <th className="p-3 border">LinkedIn ID</th>
                <th className="p-3 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="p-3 border">
                      {user.photo ? (
                        <img
                          src={user.photo}
                          alt={user.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="p-3 border">{user.name}</td>
                    <td className="p-3 border">{user.batch}</td>
                    <td className="p-3 border">{user.field}</td>
                    <td className="p-3 border text-blue-600">
                      <a
                        href={`https://linkedin.com/in/${user.linkedinId}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {user.linkedinId}
                      </a>
                    </td>
                    <td className="p-3 border space-x-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center p-4 text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Home;
