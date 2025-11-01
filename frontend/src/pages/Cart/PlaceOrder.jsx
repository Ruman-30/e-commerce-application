import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaTruck,
  FaCreditCard,
  FaMobileAlt,
  FaUniversity,
  FaCheckCircle,
  FaAngleRight,
  FaClipboardList,
  FaMoneyBillWave,
  FaPercentage,
  FaUser,
  FaPhoneAlt,
  FaHome,
  FaCity,
  FaMapMarkedAlt,
  FaMailBulk,
  FaGlobe,
} from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { toast } from "react-toastify";
import { clearCartBackend } from "../../features/cartSlice";

export default function PlaceOrderModern() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector((s) => s.cart.items || []);
  const user = useSelector((s) => s.user.user) || null;

  const subtotal = cartItems.reduce(
    (sum, i) => sum + (i.price || 0) * (i.quantity || 1),
    0
  );
  const defaultShipping = 49;

  // --- Load saved addresses from localStorage ---
  const savedOrders = JSON.parse(localStorage.getItem("savedOrders") || "[]");
  const savedAddresses = savedOrders.map((o) => o.shippingAddress);

  // --- Shipping address state, default to last saved or user info ---
  const [shippingAddress, setShippingAddress] = useState(
    savedAddresses.length
      ? savedAddresses[savedAddresses.length - 1]
      : {
          fullName: user?.name || "",
          phone: user?.phone || "",
          street: "",
          city: "",
          state: "",
          postalCode: "",
          country: "India",
        }
  );
  const [shippingMethod, setShippingMethod] = useState({
    id: "standard",
    label: "Standard Delivery (3–5 days)",
    price: 49,
  });

  const shippingCost = shippingMethod.price;
  const taxes = Math.ceil(
    Math.round((subtotal + shippingCost) * 0.05 * 100) / 100
  );
  const grandTotal = Math.round((subtotal + shippingCost + taxes) * 100) / 100;

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [successPayload, setSuccessPayload] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // --- Load persisted checkout data on page load ---
  useEffect(() => {
    const savedData = localStorage.getItem("checkoutData");
    if (savedData) {
      const parsed = JSON.parse(savedData);
      if (parsed.shippingAddress) setShippingAddress(parsed.shippingAddress);
      if (parsed.shippingMethod) setShippingMethod(parsed.shippingMethod);
      if (parsed.paymentMethod) setPaymentMethod(parsed.paymentMethod);
    }
  }, []);
  // --- Persist checkout data ---
  useEffect(() => {
    const checkoutData = {
      shippingAddress,
      shippingMethod,
      paymentMethod,
      cartItems,
    };
    localStorage.setItem("checkoutData", JSON.stringify(checkoutData));
  }, [shippingAddress, shippingMethod, paymentMethod, cartItems]);

  useEffect(() => {
    const el = document.querySelector("#po-fullName");
    if (el) el.focus();
  }, []);

  const validateShipping = () => {
    const e = {};
    if (!shippingAddress.fullName?.trim()) e.fullName = "Full name required";
    if (!shippingAddress.phone?.trim()) e.phone = "Phone required";
    if (!shippingAddress.street?.trim()) e.street = "Street required";
    if (!shippingAddress.city?.trim()) e.city = "City required";
    if (!shippingAddress.postalCode?.trim())
      e.postalCode = "Postal code required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    setShippingAddress((s) => ({ ...s, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
  };
  // ------------------- Shared success handler -------------------
  const handleOrderSuccess = async (order, payment = null, msg) => {
    setSuccessPayload({ order, payment });
    setShowSuccess(true);

    try {
      const confettiModule = await import("canvas-confetti");
      confettiModule.default({
        particleCount: 160,
        spread: 80,
        origin: { y: 0.6 },
      });
    } catch (_) {}

    dispatch(clearCartBackend());
    localStorage.removeItem("checkoutData");
    toast.success(msg || "Order placed successfully!");
  };

  // ------------------- openRazorpay (Promise) -------------------
  const openRazorpay = (razorpayOrder, orderDbRecord) => {
    return new Promise((resolve, reject) => {
      if (!window.Razorpay) {
        toast.error(
          'Razorpay script not loaded. Add <script src="https://checkout.razorpay.com/v1/checkout.js"></script>'
        );
        return reject(new Error("Razorpay script not loaded"));
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "",
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency || "INR",
        name: "UrbanCart",
        description: `Order • ${orderDbRecord._id}`,
        order_id: razorpayOrder.id,
        prefill: {
          name: shippingAddress.fullName || user?.name || "",
          email: user?.email || "",
          contact: shippingAddress.phone || user?.phone || "",
        },
        notes: {
          subtotal,
          shipping: shippingMethod.id,
        },
        theme: { color: "#2563eb" },

        // 🧾 Razorpay success handler
        handler: async function (response) {
          setLoading(true);
          try {
            const { data } = await api.post("/payment/verify-payment", {
              orderId: orderDbRecord._id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (data?.success) {
              await handleOrderSuccess(
                data.order || orderDbRecord,
                response,
                data.message || "Payment successful — order confirmed!"
              );
              resolve(data);
            } else {
              toast.error(data?.message || "Payment verification failed");
              reject(new Error(data?.message || "Verification failed"));
            }
          } catch (err) {
            console.error("Verify error:", err?.response || err);
            toast.error(
              err?.response?.data?.message || "Payment verification failed"
            );
            reject(err);
          } finally {
            setLoading(false);
          }
        },
      };

      const rzp = new window.Razorpay(options);

      // User cancels / fails
      rzp.on("payment.failed", function (response) {
        console.error("❌ Razorpay payment.failed:", response);
        toast.error("Payment failed or cancelled — please try again.");
        reject(new Error("Razorpay payment failed or cancelled"));
      });

      rzp.open();
    });
  };

  // ------------------- Main handlePlaceOrder -------------------
  const handlePlaceOrder = async () => {
    if (!cartItems.length) {
      toast.warn("Your cart is empty — add items before placing an order.");
      return;
    }

    if (!validateShipping()) return;

    if (!shippingMethod || !shippingMethod.id) {
      toast.warn("Please select a shipping method.");
      return;
    }

    setLoading(true);

    try {
      const itemsPrice =
        Math.round(
          cartItems.reduce(
            (sum, i) => sum + (i.price || 0) * (i.quantity || 1),
            0
          ) * 100
        ) / 100;

      const subtotal = itemsPrice;
      const shippingPrice = shippingMethod.price;
      const taxPrice = Math.round((itemsPrice + shippingPrice) * 0.05);
      const totalAmount = Math.round(itemsPrice + shippingPrice + taxPrice);

      const payload = {
        shippingAddress,
        paymentMethod,
        shippingMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalAmount,
        items: cartItems.map((i) => ({
          product: i.productId,
          quantity: i.quantity,
          price: i.price,
          image: i.image,
          name: i.name,
        })),
      };

      const { data } = await api.post("/order", payload);
      const { order, razorpayOrder, message } = data;

      // Save locally
      try {
        const savedOrders = JSON.parse(
          localStorage.getItem("savedOrders") || "[]"
        );
        savedOrders.push({
          orderId: order?._id || new Date().getTime(),
          shippingAddress,
          paymentMethod,
          shippingMethod: shippingMethod.id,
          date: new Date().toISOString(),
        });
        localStorage.setItem("savedOrders", JSON.stringify(savedOrders));
      } catch (err) {
        console.warn("Failed to save order locally:", err);
      }

      // --- COD ---
      if (paymentMethod === "COD") {
        await handleOrderSuccess(order, null, message || "Order placed (COD)");
        return;
      }

      // --- Razorpay ---
      if (razorpayOrder && order) {
        await openRazorpay(razorpayOrder, order);
      } else {
        throw new Error("Payment initialization failed. Please try again.");
      }
    } catch (err) {
      console.error("Place order error:", err?.response || err);
      toast.error(
        err?.response?.data?.message || err.message || "Failed to place order"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#a1cfff] to-[#d9f4ff] py-10 sm:py-14 px-3 sm:px-6 md:px-10">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <motion.header
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3 sm:gap-0"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Checkout
            </h1>
            <p className="text-sm text-gray-800">
              Secure checkout • {cartItems.length} item(s)
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-between">
            <div className="text-xs sm:text-sm bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-2 rounded-full flex items-center gap-2">
              <FaTruck /> <span>Fast & secure</span>
            </div>
            {/* <div className="text-xs sm:text-sm text-gray-600">
            Total: <strong className="ml-1">₹{grandTotal}</strong>
          </div> */}
          </div>
        </motion.header>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT SIDE */}
          <section className="lg:col-span-8 space-y-6">
            {/* SAVED ADDRESSES */}
            {savedAddresses.length > 0 && (
              <div>
                <label className="text-sm text-gray-800">
                  Select saved address
                </label>
                <select
                  className="w-full bg-white mt-1 px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-400 outline-none text-sm"
                  value={JSON.stringify(shippingAddress)}
                  onChange={(e) =>
                    setShippingAddress(JSON.parse(e.target.value))
                  }
                >
                  {savedAddresses.slice(0, 5).map((addr, idx) => (
                    <option key={idx} value={JSON.stringify(addr)}>
                      {addr.fullName}, {addr.street}, {addr.city}, {addr.state},{" "}
                      {addr.postalCode}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* SHIPPING DETAILS */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow p-4 sm:p-6"
            >
              <h2 className="text-base sm:text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
                <FaMapMarkedAlt className="text-black" />
                Shipping Details
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    label: "Full name",
                    name: "fullName",
                    placeholder: "John Doe",
                    icon: <FaUser className="text-black" />,
                  },
                  {
                    label: "Phone",
                    name: "phone",
                    placeholder: "+91 98765 43210",
                    icon: <FaPhoneAlt className="text-black" />,
                  },
                  {
                    label: "Street / Address",
                    name: "street",
                    placeholder: "Flat, Building, Area",
                    icon: <FaHome className="text-black" />,
                  },
                  {
                    label: "City",
                    name: "city",
                    icon: <FaCity className="text-black" />,
                  },
                  {
                    label: "State",
                    name: "state",
                    icon: <FaMapMarkedAlt className="text-black" />,
                  },
                  {
                    label: "Postal Code",
                    name: "postalCode",
                    icon: <FaMailBulk className="text-black" />,
                  },
                  {
                    label: "Country",
                    name: "country",
                    icon: <FaGlobe className="text-black" />,
                  },
                ].map((field, i) => (
                  <div
                    key={field.name}
                    className={i === 2 ? "sm:col-span-2" : ""}
                  >
                    <label className="text-sm text-gray-600 flex items-center gap-2">
                      {field.icon}
                      {field.label}
                    </label>
                    <input
                      name={field.name}
                      value={shippingAddress[field.name]}
                      onChange={handleChange}
                      className={`w-full mt-1 px-4 py-2 rounded-lg border ${
                        errors[field.name]
                          ? "border-red-400"
                          : "border-gray-200"
                      } focus:ring-2 focus:ring-blue-400 outline-none text-sm`}
                      placeholder={field.placeholder || ""}
                    />
                    {errors[field.name] && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors[field.name]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* SHIPPING METHOD */}
            <motion.div
              className="bg-white rounded-2xl shadow p-4 sm:p-6"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-base sm:text-lg font-semibold mb-4">
                Shipping Method
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    id: "standard",
                    label: "Standard (3–5 days)",
                    price: defaultShipping,
                    desc: "Free delivery above ₹999",
                  },
                  {
                    id: "express",
                    label: "Express (1–2 days)",
                    price: 199,
                    desc: "Faster delivery",
                  },
                  {
                    id: "overnight",
                    label: "Overnight",
                    price: 499,
                    desc: "Next-day delivery",
                  },
                ].map((s) => (
                  <motion.button
                    key={s.id}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setShippingMethod(s)}
                    className={`relative text-left p-3 rounded-lg border transition-all ${
                      shippingMethod?.id === s.id
                        ? "border-blue-600 bg-blue-50 shadow-sm"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-800 text-sm sm:text-base">
                          {s.label}
                        </div>
                        <div className="text-xs text-gray-500">{s.desc}</div>
                      </div>
                      <div className="text-sm font-semibold text-gray-800">
                        ₹{s.price}
                      </div>
                    </div>

                    {shippingMethod?.id === s.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 18,
                        }}
                        className="absolute top-1 right-3 text-blue-600"
                      >
                        <FaCheckCircle size={16} />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* PAYMENT METHOD */}
            <motion.div
              className="bg-white rounded-2xl shadow p-4 sm:p-6"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-base sm:text-lg font-semibold mb-4">
                Payment Method
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: "COD", label: "Cash", icon: FaTruck },
                  { id: "Card", label: "Card", icon: FaCreditCard },
                  { id: "UPI", label: "UPI", icon: FaMobileAlt },
                  { id: "NetBanking", label: "Bank", icon: FaUniversity },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id)}
                    className={`p-3 rounded-lg border flex items-center gap-3 transition text-sm ${
                      paymentMethod === m.id
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <m.icon />
                    <div className="text-left">
                      <div className="font-medium">{m.label}</div>
                      <div className="text-xs text-gray-500">
                        {m.id === "COD" ? "Pay on delivery" : "Pay securely"}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>

            <div className="flex justify-end">
              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="mt-4 inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full shadow-lg hover:scale-[1.02] transition disabled:opacity-60 text-sm sm:text-base"
              >
                <span>{loading ? "Processing…" : "Place Order"}</span>
                <FaAngleRight />
              </button>
            </div>
          </section>

          {/* RIGHT SIDE */}
          <aside className="lg:col-span-4">
            <motion.div
              className="sticky mt-6 top-40 bg-white rounded-xl shadow p-4 sm:p-6"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Title with Icon */}
              <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2 text-gray-800">
                <FaClipboardList />
                Order Summary
              </h3>

              <div className="mt-4 divide-y divide-gray-100">
                <div className="space-y-3 max-h-64 overflow-y-auto py-2">
                  {cartItems.map((it) => (
                    <div
                      key={it.productId}
                      className="flex items-center justify-between gap-3 py-2"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={it.image}
                          alt={it.name}
                          className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded"
                        />
                        <div>
                          <div className="text-sm font-medium max-w-[160px] truncate">
                            {it.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {it.quantity} × ₹{it.price}
                          </div>
                        </div>
                      </div>
                      <div className="font-semibold text-sm sm:text-base">
                        ₹{it.price * it.quantity}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 text-sm">
                  {/* Subtotal */}
                  <div className="flex justify-between text-gray-600 items-center">
                    <span className="flex items-center gap-2">
                      <FaMoneyBillWave className="text-black" />
                      Subtotal
                    </span>
                    <span>₹{subtotal}</span>
                  </div>

                  {/* Shipping */}
                  <div className="flex justify-between mt-1 text-gray-600 items-center">
                    <span className="flex items-center gap-2">
                      <FaTruck className="text-black" />
                      Shipping
                    </span>
                    <span>₹{shippingCost}</span>
                  </div>

                  {/* Taxes */}
                  <div className="flex justify-between mt-1 text-gray-600 items-center">
                    <span className="flex items-center gap-2">
                      <FaPercentage className="text-black" />
                      Taxes & fees
                    </span>
                    <span>₹{taxes}</span>
                  </div>

                  {/* Total */}
                  <div className="border-t mt-4 pt-3 flex justify-between items-center">
                    <div>
                      <div className="text-sm text-gray-500">Total</div>
                      <div className="text-xl sm:text-2xl font-bold">
                        ₹{grandTotal}
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">Incl. all taxes</div>
                  </div>

                  <div className="mt-4">
                    <button className="w-full py-2 rounded-lg border border-gray-200 text-sm hover:bg-gray-50">
                      Apply Coupon
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </aside>
        </div>

        {/* SUCCESS OVERLAY */}
        {showSuccess && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-3">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-md text-center"
            >
              <div className="flex flex-col items-center gap-4">
                <FaCheckCircle className="text-green-600 text-5xl" />
                <h2 className="text-xl sm:text-2xl font-bold">
                  Order Confirmed
                </h2>
                <p className="text-gray-600 text-sm sm:text-base">
                  {successPayload?.order?.paymentMethod === "COD"
                    ? "Thank you — your order has been placed and will be collected on delivery."
                    : "Thank you — your payment is confirmed and your order is being processed."}
                </p>
                <div className="mt-4">
                  <button
                    onClick={() => navigate("/")}
                    className="px-5 py-2 bg-blue-600 text-white rounded-lg"
                  >
                    Go back To Home
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
