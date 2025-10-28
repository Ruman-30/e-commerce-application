import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import api from "../../api/axios";
import LoadingModal from "../LoadingModal";

const RevenueChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/admin/stats");
        setData(data.monthlyRevenue);
      } catch (err) {
        console.error("Failed to load revenue chart", err);
      } finally {
        setLoading(false);
      }
    };
    fetchChartData();
  }, []);

  if (loading) return <LoadingModal show={true} text="Loading Revenue Data..." />;

  return (
    <div
      className="
        bg-white 
        p-4 sm:p-6 
        rounded-xl sm:rounded-2xl 
        shadow hover:shadow-md 
        transition 
        w-full
      "
    >
      <h2
        className="
          text-base sm:text-lg md:text-xl 
          font-semibold mb-3 sm:mb-4 
          text-gray-700 text-center sm:text-left
        "
      >
        Revenue Overview
      </h2>

      <div className="w-full h-[220px] sm:h-[280px] md:h-[320px] lg:h-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12 }}
              angle={-15}
              interval={0}
              height={40}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip contentStyle={{ fontSize: "12px" }} />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#4f46e5"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;
