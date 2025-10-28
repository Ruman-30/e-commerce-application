import { useState, useEffect } from "react";
import { FaTrash, FaEdit, FaSearch } from "react-icons/fa";
import api from "../../api/axios";
import LoadingModal from "../LoadingModal";

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const limit = 10;

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

  useEffect(() => {
    const timeout = setTimeout(fetchUsers, 400);
    return () => clearTimeout(timeout);
  }, [page, search]);

  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl shadow hover:shadow-lg transition duration-300 relative">
      {/* ✅ Loading Modal */}
      <LoadingModal show={loading} text="Loading users..." />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
        <h2 className="text-lg sm:text-xl font-bold text-gray-700">
          Users ({totalUsers})
        </h2>

        {/* Search box */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            className="pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm w-full"
          />
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Table wrapper with horizontal scroll */}
      <div className="overflow-x-auto rounded-lg">
        <table className="w-full min-w-[600px] text-left text-sm sm:text-base">
          <thead>
            <tr className="text-gray-500 text-xs sm:text-sm border-b border-gray-200">
              <th className="pb-3 font-medium">Name</th>
              <th className="pb-3 font-medium">Email</th>
              <th className="pb-3 font-medium">Role</th>
              {/* <th className="pb-3 font-medium text-right">Actions</th> */}
            </tr>
          </thead>

          <tbody>
            {users.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="py-6 text-center text-gray-400 text-sm"
                >
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr
                  key={u._id}
                  className="border-b last:border-none hover:bg-gray-50 transition"
                >
                  <td className="py-4 flex items-center gap-2 min-w-[120px]">
                    <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold text-sm sm:text-base">
                      {u.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </div>
                    <span className="text-gray-700 font-medium truncate">
                      {u.name}
                    </span>
                  </td>

                  <td className="text-gray-500 break-words max-w-[160px] sm:max-w-none">
                    {u.email}
                  </td>

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

                  {/* <td className="flex justify-end gap-2 min-w-[100px]">
                    <button className="p-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition text-xs sm:text-sm">
                      <FaEdit />
                    </button>
                    <button className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition text-xs sm:text-sm">
                      <FaTrash />
                    </button>
                  </td> */}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-between sm:justify-end items-center mt-5 gap-3 text-sm sm:text-base">
        <div className="text-gray-600">
          Showing page <span className="font-medium">{page}</span> of{" "}
          <span className="font-medium">{totalPages}</span>
        </div>

        <div className="flex gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
            className={`px-3 py-1.5 text-sm rounded-md border ${
              page === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-indigo-100 text-indigo-600 hover:bg-indigo-200"
            }`}
          >
            Prev
          </button>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((prev) => prev + 1)}
            className={`px-3 py-1.5 text-sm rounded-md border ${
              page === totalPages
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-indigo-100 text-indigo-600 hover:bg-indigo-200"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default UsersTable;
