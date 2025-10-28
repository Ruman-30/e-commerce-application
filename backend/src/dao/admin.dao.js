import userModel from "../model/user.model.js";
import orderModel from "../model/order.model.js";
import productModel from "../model/product.model.js";

export async function createAdmin(data){
     const {name, email, password } = data
    const admin = await userModel.create({
        name,
        email,
        password,
        role: "admin"
    })
    return admin
}

export async function findOneAdmin(data){
    return await userModel.findOne(data)
}

export const getDashboardStatsDao = async () => {
  // Revenue
  const totalRevenueAgg = await orderModel.aggregate([
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$totalAmount" },
      },
    },
  ]);
  const totalRevenue = totalRevenueAgg[0]?.totalRevenue || 0;

  // Orders
  const totalOrders = await orderModel.countDocuments();

  // Customers (only role: customer)
  const totalCustomers = await userModel.countDocuments({ role: "customer" });

  // Products
  const totalProducts = await productModel.countDocuments();

  // Monthly Revenue
  const monthlyRevenue = await orderModel.aggregate([
    {
      $group: {
        _id: { month: { $month: "$createdAt" } },
        revenue: { $sum: "$totalAmount" },
      },
    },
    { $sort: { "_id.month": 1 } },
  ]);

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const formattedRevenue = monthNames.map((month, i) => {
    const monthData = monthlyRevenue.find((m) => m._id.month === i + 1);
    return { month, revenue: monthData ? monthData.revenue : 0 };
  });

  return {
    totalRevenue,
    totalOrders,
    totalCustomers,
    totalProducts,
    monthlyRevenue: formattedRevenue,
  };
};
