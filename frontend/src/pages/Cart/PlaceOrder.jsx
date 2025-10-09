import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaTruck,
  FaCreditCard,
  FaMobileAlt,
  FaUniversity,
  FaCheckCircle,
  FaAngleRight,
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

  const subtotal = cartItems.reduce((sum, i) => sum + (i.price || 0) * (i.quantity || 1), 0);
  const defaultShipping = 49;

  // --- Load saved addresses from localStorage ---
  const savedOrders = JSON.parse(localStorage.getItem("savedOrders") || "[]");
  const savedAddresses = savedOrders.map((o) => o.shippingAddress);

  // --- Shipping address state, default to last saved or user info ---
  const [shippingAddress, setShippingAddress] = useState(
    savedAddresses.length ? savedAddresses[savedAddresses.length - 1] : {
      fullName: user?.name || "",
      phone: user?.phone || "",
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "India",
    }
  );

  const [shippingMethod, setShippingMethod] = useState({ id: "standard", label: "Standard (3-5 days)", price: defaultShipping });
  const shippingCost = shippingMethod.price;
  const taxes = Math.round((subtotal + shippingCost) * 0.05 * 100) / 100;
  const grandTotal = Math.round((subtotal + shippingCost + taxes) * 100) / 100;

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [successPayload, setSuccessPayload] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const el = document.querySelector('#po-fullName');
    if (el) el.focus();
  }, []);

  const validateShipping = () => {
    const e = {};
    if (!shippingAddress.fullName?.trim()) e.fullName = "Full name required";
    if (!shippingAddress.phone?.trim()) e.phone = "Phone required";
    if (!shippingAddress.street?.trim()) e.street = "Street required";
    if (!shippingAddress.city?.trim()) e.city = "City required";
    if (!shippingAddress.postalCode?.trim()) e.postalCode = "Postal code required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    setShippingAddress((s) => ({ ...s, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
  };

  const openRazorpay = async (razorpayOrder, orderDbRecord) => {
    if (!window.Razorpay) {
      toast.error("Razorpay script not loaded. Add <script src=\"https://checkout.razorpay.com/v1/checkout.js\"></script>");
      return;
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
        subtotal: subtotal,
        shipping: shippingMethod.id,
      },
      theme: { color: "#2563eb" },
      handler: async function (response) {
        setLoading(true);
        try {
          await api.post("/payment/verify-payment", {
            orderId: orderDbRecord._id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          });

          setSuccessPayload({ order: orderDbRecord, payment: response });
          setShowSuccess(true);
          try {
            const confettiModule = await import("canvas-confetti");
            confettiModule.default({ particleCount: 160, spread: 80, origin: { y: 0.6 } });
          } catch (_) {}

          dispatch(clearCartBackend());
          toast.success("Payment successful — order confirmed!");
        } catch (err) {
          console.error("Verify error:", err?.response || err);
          toast.error(err?.response?.data?.message || "Payment verification failed");
        } finally {
          setLoading(false);
        }
      },
    };

    const rzp = new window.Razorpay(options);

    rzp.on("payment.failed", function (response) {
      console.error("Razorpay failed:", response);
      toast.error(response?.error?.description || "Payment failed");
    });

    rzp.open();
  };

  const handlePlaceOrder = async () => {
    if (!cartItems.length) {
      toast.warn("Your cart is empty — add items before placing an order.");
      return;
    }

    if (!validateShipping()) return;

    setLoading(true);
    try {
      const payload = {
        shippingAddress,
        paymentMethod,
        shippingMethod: shippingMethod.id,
      };

      const { data } = await api.post("/order", payload);
      const { order, razorpayOrder, message } = data;

      // --- SAVE ADDRESS TO LOCALSTORAGE AFTER ORDER ---
      try {
        const savedOrders = JSON.parse(localStorage.getItem("savedOrders") || "[]");
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
      // -------------------------------------------------

      if (paymentMethod === "COD") {
        toast.success(message || "Order placed (COD)");
        dispatch(clearCartBackend());
        setSuccessPayload({ order, payment: null });
        setShowSuccess(true);
          try {
            const confettiModule = await import("canvas-confetti");
            confettiModule.default({ particleCount: 160, spread: 80, origin: { y: 0.6 } });
          } catch (_) {}

        return;
      }

      if (razorpayOrder && order) {
        if (razorpayOrder.amount && Math.round(grandTotal * 100) !== razorpayOrder.amount) {
          toast.info("Note: Razorpay transaction amount may be capped in test mode to allow checkout.");
        }

        await openRazorpay(razorpayOrder, order);
      } else {
        throw new Error("Payment init failed, try again");
      }
    } catch (err) {
      console.error("Place order error:", err?.response || err);
      toast.error(err?.response?.data?.message || err.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#E0EFFF] py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.header
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Checkout</h1>
            <p className="text-sm text-gray-500">Secure checkout • {cartItems.length} item(s)</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-xs bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-2 rounded-full flex items-center gap-2">
              <FaTruck /> <span>Fast & secure</span>
            </div>
            <div className="text-xs text-gray-500">Total: <strong className="ml-1">₹{grandTotal}</strong></div>
          </div>
        </motion.header>

        <div className="grid md:grid-cols-12 gap-6">
          <section className="md:col-span-8 space-y-6">

            {/* --- ADDRESS HISTORY DROPDOWN --- */}
            {savedAddresses.length > 0 && (
              <div className="mb-4">
                <label className="text-sm  text-gray-600">Select saved address</label>
                <select
                  className="w-full bg-white mt-1 px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-400 outline-none"
                  value={JSON.stringify(shippingAddress)}
                  onChange={(e) => setShippingAddress(JSON.parse(e.target.value))}
                >
                  {savedAddresses.slice(0, 5).map((addr, idx) => (
                    <option key={idx} value={JSON.stringify(addr)}>
                      {addr.fullName}, {addr.street}, {addr.city}, {addr.state}, {addr.postalCode}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* --- SHIPPING FORM (unchanged) --- */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow p-6"
            >
              <h2 className="text-lg font-semibold mb-4">Shipping Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="col-span-1">
                  <label className="text-sm text-gray-600">Full name</label>
                  <input
                    id="po-fullName"
                    name="fullName"
                    value={shippingAddress.fullName}
                    onChange={handleChange}
                    className={`w-full mt-1 px-4 py-2 rounded-lg border ${errors.fullName ? "border-red-400" : "border-gray-200"} focus:ring-2 focus:ring-blue-400 outline-none`}
                    placeholder="John Doe"
                  />
                  {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
                </div>
                <div>
                  <label className="text-sm text-gray-600">Phone</label>
                  <input
                    name="phone"
                    value={shippingAddress.phone}
                    onChange={handleChange}
                    className={`w-full mt-1 px-4 py-2 rounded-lg border ${errors.phone ? "border-red-400" : "border-gray-200"} focus:ring-2 focus:ring-blue-400 outline-none`}
                    placeholder="+91 98765 43210"
                  />
                  {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <label className="text-sm text-gray-600">Street / Address</label>
                  <input
                    name="street"
                    value={shippingAddress.street}
                    onChange={handleChange}
                    className={`w-full mt-1 px-4 py-2 rounded-lg border ${errors.street ? "border-red-400" : "border-gray-200"} focus:ring-2 focus:ring-blue-400 outline-none col-span-2`}
                    placeholder="Flat, Building, Area"
                  />
                  {errors.street && <p className="text-xs text-red-500 mt-1">{errors.street}</p>}
                </div>
                <div>
                  <label className="text-sm text-gray-600">City</label>
                  <input name="city" value={shippingAddress.city} onChange={handleChange} className="w-full mt-1 px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-400 outline-none" />
                </div>
                <div>
                  <label className="text-sm text-gray-600">State</label>
                  <input name="state" value={shippingAddress.state} onChange={handleChange} className="w-full mt-1 px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-400 outline-none" />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Postal Code</label>
                  <input name="postalCode" value={shippingAddress.postalCode} onChange={handleChange} className="w-full mt-1 px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-400 outline-none" />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Country</label>
                  <input name="country" value={shippingAddress.country} onChange={handleChange} className="w-full mt-1 px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-400 outline-none" />
                </div>
              </div>
            </motion.div>

           <motion.div className="bg-white rounded-2xl shadow p-6" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="text-lg font-semibold mb-4">Shipping Method</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: "standard", label: "Standard (3-5 days)", price: defaultShipping, desc: "Free delivery above ₹999" },
                  { id: "express", label: "Express (1-2 days)", price: 199, desc: "Faster delivery" },
                  { id: "overnight", label: "Overnight", price: 499, desc: "Next-day delivery" },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setShippingMethod(s)}
                    className={`text-left p-3 rounded-lg border transition ${shippingMethod.id === s.id ? "border-blue-600 bg-blue-50" : "border-gray-200 hover:border-blue-300"}`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{s.label}</div>
                        <div className="text-xs text-gray-500">{s.desc}</div>
                      </div>
                      <div className="text-sm font-semibold">₹{s.price}</div>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.div className="bg-white rounded-2xl shadow p-6" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: "COD", label: "Cash on Delivery", icon: FaTruck },
                  { id: "Card", label: "Card", icon: FaCreditCard },
                  { id: "UPI", label: "UPI", icon: FaMobileAlt },
                  { id: "NetBanking", label: "Netbanking", icon: FaUniversity },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id)}
                    className={`p-3 rounded-lg border flex items-center gap-3 transition ${paymentMethod === m.id ? "border-blue-600 bg-blue-50" : "border-gray-200 hover:border-blue-300"}`}
                  >
                    <m.icon />
                    <div className="text-left">
                      <div className="text-sm font-medium">{m.label}</div>
                      <div className="text-xs text-gray-500">{m.id === "COD" ? "Pay on delivery" : "Pay securely"}</div>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>

            <div className="flex justify-end">
              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="mt-4 inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-full shadow-lg hover:scale-[1.01] transition disabled:opacity-60"
              >
                <span>{loading ? "Processing…" : "Place Order"}</span>
                <FaAngleRight />
              </button>
            </div>

          </section>

          {/* RIGHT: order summary */}
          <aside className="md:col-span-4">
            <motion.div className="sticky mt-7 top-43 bg-white rounded-xl shadow p-6" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
              <h3 className="text-lg font-semibold">Order Summary</h3>

              <div className="mt-4 divide-y divide-gray-100">
                <div className="space-y-3 max-h-64 overflow-y-auto py-2">
                  {cartItems.map((it) => (
                    <div key={it.productId} className="flex items-center justify-between gap-3 py-2">
                      <div className="flex items-center gap-3">
                        <img src={it.image} alt={it.name} className="w-12 h-12 object-cover rounded" />
                        <div>
                          <div className="text-sm font-medium max-w-[180px] truncate">{it.name}</div>
                          <div className="text-xs text-gray-500">{it.quantity} × ₹{it.price}</div>
                        </div>
                      </div>
                      <div className="font-semibold">₹{it.price * it.quantity}</div>
                    </div>
                  ))}
                </div>

                <div className="pt-4">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 mt-1">
                    <span>Shipping</span>
                    <span>₹{shippingCost}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 mt-1">
                    <span>Taxes & fees</span>
                    <span>₹{taxes}</span>
                  </div>

                  <div className="border-t mt-4 pt-3 flex justify-between items-center">
                    <div>
                      <div className="text-sm text-gray-500">Total</div>
                      <div className="text-2xl font-bold">₹{grandTotal}</div>
                    </div>
                    <div className="text-xs text-gray-400">Incl. all taxes</div>
                  </div>

                  <div className="mt-4">
                    <button className="w-full py-2 rounded-lg border border-gray-200 text-sm hover:bg-gray-50">Apply Coupon</button>
                  </div>
                </div>
              </div>
            </motion.div>
          </aside>
        </div>

        {/* Success overlay */}
        {showSuccess && (
  <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }} 
      animate={{ scale: 1, opacity: 1 }} 
      className="bg-white p-8 rounded-2xl shadow-2xl w-[420px] text-center"
    >
      <div className="flex flex-col items-center gap-4">
        <FaCheckCircle className="text-green-600 text-5xl" />
        <h2 className="text-2xl font-bold">Order Confirmed</h2>
        <p className="text-gray-600">
          {successPayload?.order?.paymentMethod === "COD" 
            ? "Thank you — your order has been placed and will be collected on delivery." 
            : "Thank you — your payment is confirmed and your order is being processed."}
        </p>
        <div className="mt-4">
          <button 
            onClick={() => navigate('/')} 
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





  

  