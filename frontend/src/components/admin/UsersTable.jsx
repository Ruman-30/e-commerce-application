import { useState, useEffect } from "react";
import { FaTrash, FaEdit, FaSearch } from "react-icons/fa";
import api from "../../api/axios"; // your axios instance (adjust import if path differs)

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const limit = 10;

  // ✅ Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/auth/users", {
        params: { page, limit, search },
      });

      setUsers(data.users || []);
      setTotalPages(data.totalPages || 1);
      setTotalUsers(data.totalUsers || 0);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔁 Fetch users when page or search changes
  useEffect(() => {
    const timeout = setTimeout(fetchUsers, 400); // debounce for search typing
    return () => clearTimeout(timeout);
  }, [page, search]);

  return (
    <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition duration-300">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-700">
          Users ({totalUsers})
        </h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => {
              setPage(1); // reset to first page when searching
              setSearch(e.target.value);
            }}
            className="pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm w-64"
          />
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] text-left">
          <thead>
            <tr className="text-gray-500 text-sm border-b border-gray-200">
              <th className="pb-3 font-medium">Name</th>
              <th className="pb-3 font-medium">Email</th>
              <th className="pb-3 font-medium">Role</th>
              <th className="pb-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={4}
                  className="py-6 text-center text-gray-400 animate-pulse"
                >
                  Loading users...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-6 text-center text-gray-400">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr
                  key={u._id}
                  className="border-b last:border-none hover:bg-gray-50 transition"
                >
                  <td className="py-4 flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold">
                      {u.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </div>
                    <span className="text-gray-700 font-medium">{u.name}</span>
                  </td>
                  <td className="text-gray-500">{u.email}</td>
                  <td>
                    <span
                      className={`px-2 py-1 text-xs rounded-full font-semibold ${
                        u.role === "Admin"
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="flex justify-end gap-2">
                    <button className="p-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition">
                      <FaEdit />
                    </button>
                    <button className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end items-center mt-4 gap-2">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
          className={`px-3 py-1 text-sm rounded-md border ${
            page === 1
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-indigo-100 text-indigo-600 hover:bg-indigo-200"
          }`}
        >
          Prev
        </button>

        <span className="text-sm text-gray-600">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((prev) => prev + 1)}
          className={`px-3 py-1 text-sm rounded-md border ${
            page === totalPages
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-indigo-100 text-indigo-600 hover:bg-indigo-200"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UsersTable;
