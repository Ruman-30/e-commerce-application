import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import LoadingModal from "../LoadingModal";

export default function KPISection() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/admin/stats");
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (!stats) return <LoadingModal show={loading} text="Loading Dashboard..." />;

  const kpis = [
    {
      title: "Revenue",
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Orders",
      value: stats.totalOrders,
      color: "from-blue-500 to-indigo-500",
    },
    {
      title: "Customers",
      value: stats.totalCustomers,
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Products",
      value: stats.totalProducts,
      color: "from-orange-500 to-yellow-500",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
    >
      {kpis.map((kpi) => (
        <div
          key={kpi.title}
          className={`p-5 rounded-xl bg-gradient-to-br ${kpi.color} text-white shadow-lg`}
        >
          <div className="text-sm opacity-90">{kpi.title}</div>
          <div className="text-2xl font-bold">{kpi.value}</div>
        </div>
      ))}
    </motion.div>
  );
}
