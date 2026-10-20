import { toast } from "react-toastify";

type CustomerDetails = {
  name?: string | null;
  email?: string | null;
  contact?: string | null;
};

type PaymentCallbacks = {
  onSuccess?: () => void;
};

export const payFee = async (
  amount: number,
  studentFeeId: number,
  customer?: CustomerDetails,
  callbacks?: PaymentCallbacks,
) => {
  try {
    const res = await fetch("/api/create-payment-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount,
        studentFeeId,
      }),
    });

    const order = await res.json();

    if (!res.ok) {
      throw new Error(order?.error || "Failed to create payment order");
    }

    if (!order?.id || !order?.amount) {
      throw new Error("Invalid Razorpay order received");
    }

    const contact = customer?.contact
      ? customer.contact.replace(/\D/g, "").slice(-10)
      : "";

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: "INR",
      name: "TrueSunshine School",
      description: "Fee Payment",
      order_id: order.id,

      prefill: {
        name: customer?.name ?? "",
        email: customer?.email ?? "",
        contact,
      },

      theme: {
        color: "#4B517D",
      },

      handler: async function (response: any) {
        try {
          const verifyResponse = await fetch("/api/verify-payment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...response,
              studentFeeId,
              amount,
            }),
          });

          const result = await verifyResponse.json();

          if (!verifyResponse.ok) {
            throw new Error(result?.error || "Payment verification failed");
          }

          toast.success("Payment successful!");

          callbacks?.onSuccess?.();
        } catch (error) {
          console.error("Payment verification error:", error);

          toast.error(
            error instanceof Error
              ? error.message
              : "Payment verification failed.",
          );
        }
      },
    };

    const Razorpay = (window as any).Razorpay;

    if (!Razorpay) {
      toast.error("Razorpay could not be loaded.");
      return;
    }

    const rzp = new Razorpay(options);

    rzp.on("payment.failed", (response: any) => {
      console.error("Razorpay payment failed:", response);

      toast.error(
        response?.error?.description || "Payment failed. Please try again.",
      );
    });

    rzp.open();
  } catch (error) {
    console.error("Payment initialization error:", error);

    toast.error(
      error instanceof Error ? error.message : "Unable to start payment.",
    );
  }
};
