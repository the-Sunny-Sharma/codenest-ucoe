"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
// @ts-expect-error: No type definitions available for this module
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
    setIsLoading(true);
    try {
      const cashfree = await load({ mode: "sandbox" });

      const response = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, studentEmail }),
      });

      if (!response.ok) {
        throw new Error("Failed to initialize payment");
      }

      const data = await response.json();

      cashfree
        .checkout({
          paymentSessionId: data.payment_session_id,
          redirectTarget: "_self",
        })
        .then(() => {
          router.push(
            `/payments/verify?order_id=${data.order_id}&email=${studentEmail}&courseId=${courseId}`
          );
        })
        .catch((error) => {
          console.error("Payment Error:", error);
          toast.error("Payment failed. Please try again.");
        });
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
