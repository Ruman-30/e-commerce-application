import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { month: "Jan", revenue: 3000 },
  { month: "Feb", revenue: 4500 },
  { month: "Mar", revenue: 5000 },
  { month: "Apr", revenue: 7000 },
  { month: "May", revenue: 9000 },
  { month: "Jun", revenue: 8000 },
];

const RevenueChart = () => (
  <div className="bg-white p-6 rounded-2xl shadow hover:shadow-md transition">
    <h2 className="text-lg font-semibold mb-4 text-gray-700">Revenue Overview</h2>
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default RevenueChart;
