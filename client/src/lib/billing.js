import api from "../api";

let rzpPromise = null;
export function loadRazorpay() {
  if (rzpPromise) return rzpPromise;
  rzpPromise = new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => reject(new Error("Couldn't load the payment library. Check your connection."));
    document.body.appendChild(s);
  });
  return rzpPromise;
}

export async function startCheckout(planKey, user) {
  await loadRazorpay();
  const { data } = await api.post("/billing/checkout", { plan: planKey });
  return new Promise((resolve, reject) => {
    const rzp = new window.Razorpay({
      key: data.keyId,
      amount: data.amount,
      currency: data.currency,
      name: "CareerCraft Pro",
      description: data.label,
      order_id: data.orderId,
      prefill: { name: user?.name || "", email: user?.email || "" },
      theme: { color: "#15634f" },
      handler: async (resp) => {
        try {
          const v = await api.post("/billing/verify", { ...resp, plan: data.plan });
          resolve(v.data.user);
        } catch (e) {
          reject(e);
        }
      },
      modal: { ondismiss: () => reject(new Error("cancelled")) },
    });
    rzp.open();
  });
}