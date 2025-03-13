"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { load } from "@cashfreepayments/cashfree-js";

interface PaymentButtonProps {
  courseId: string;
  price: number;
  studentEmail: string;
}

export function PaymentButton({
  courseId,
  price,
  studentEmail,
}: PaymentButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const initializePayment = async () => {
    if (!courseId) {
      toast.error("Invalid course information");
      return;
    }

    setIsLoading(true);
    try {
      // Create payment session
      const response = await fetch("/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ courseId, studentEmail }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to initialize payment");
      }

      const { payment_session_id, order_id } = await response.json();

      // For development/testing - mock payment flow
      if (payment_session_id.startsWith("mock-session-")) {
        toast.info("Using mock payment in development mode");
        router.push(
          `/payments/verify?order_id=${order_id}&email=${encodeURIComponent(
            studentEmail
          )}&courseId=${courseId}`
        );
        return;
      }

      // Initialize Cashfree SDK
      try {
        const cashfree = await load({
          mode: "sandbox", // Change to "production" for live
        });

        // Launch Cashfree checkout
        cashfree
          .checkout({
            paymentSessionId: payment_session_id,
            redirectTarget: "_self",
          })
          .then((result: any) => {
            console.log("Payment Result:", result);
            router.push(
              `/payments/verify?order_id=${order_id}&email=${encodeURIComponent(
                studentEmail
              )}&courseId=${courseId}`
            );
          })
          .catch((error: any) => {
            console.error("Payment Error:", error);
            toast.error("Payment failed. Please try again.");
          });
      } catch (sdkError) {
        console.error("Cashfree SDK error:", sdkError);
        toast.error("Payment system error. Please try again later.");
        // Fallback to verification page even if SDK fails
        router.push(
          `/payments/verify?order_id=${order_id}&email=${encodeURIComponent(
            studentEmail
          )}&courseId=${courseId}`
        );
      }
    } catch (error) {
      console.error("Payment initialization error:", error);
      toast.error("Failed to initialize payment");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={initializePayment}
      disabled={isLoading}
      className="w-full"
      size="lg"
    >
      {isLoading ? "Processing..." : `Pay ₹${price}`}
    </Button>
  );
}
