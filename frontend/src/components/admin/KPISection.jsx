import { motion } from "framer-motion";

export default function KPISection() {
  const kpis = [
    { title: "Revenue", value: "$24,320", color: "from-green-500 to-emerald-500" },
    { title: "Orders", value: "1,240", color: "from-blue-500 to-indigo-500" },
    { title: "Customers", value: "980", color: "from-purple-500 to-pink-500" },
    { title: "Products", value: "320", color: "from-orange-500 to-yellow-500" },
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
