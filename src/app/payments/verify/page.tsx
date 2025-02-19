// "use client";

// import { useEffect, useState } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { toast } from "sonner";

// export default function PaymentVerifyPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const orderId = searchParams.get("order_id");
//   const email = searchParams.get("email");
//   const courseId = searchParams.get("courseId");

//   const [isVerifying, setIsVerifying] = useState(true);

//   useEffect(() => {
//     if (!orderId || !email || !courseId) {
//       toast.error("Invalid payment details.");
//       router.push("/");
//       return;
//     }

//     const verifyPayment = async () => {
//       try {
//         const response = await fetch("/api/payments/verify", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ orderId, email, courseId }),
//         });

//         if (!response.ok) {
//           throw new Error("Payment verification failed.");
//         }

//         const data = await response.json();

//         if (data.success) {
//           toast.success("Payment successful! You are now enrolled.");
//           router.push(`/courses/${courseId}`); // Redirect to the course page
//         } else {
//           toast.error("Payment verification failed.");
//           router.push("/");
//         }
//       } catch (error) {
//         console.error("Verification Error:", error);
//         toast.error("Error verifying payment.");
//         router.push("/");
//       } finally {
//         setIsVerifying(false);
//       }
//     };

//     verifyPayment();
//   }, [orderId, email, courseId, router]);

//   return (
//     <div className="flex items-center justify-center h-screen">
//       <div className="text-center">
//         <h1 className="text-xl font-semibold">Verifying Payment...</h1>
//         {isVerifying && <p>Please wait while we verify your payment.</p>}
//       </div>
//     </div>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function PaymentVerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const orderId = searchParams.get("order_id");
  const email = searchParams.get("email");
  const courseId = searchParams.get("courseId");

  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    if (!orderId || !email || !courseId) {
      toast.error("Invalid payment details.");
      router.push("/");
      return;
    }

    const verifyPayment = async () => {
      try {
        const response = await fetch("/api/payments/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ orderId, email, courseId }),
        });

        if (!response.ok) {
          throw new Error("Payment verification failed.");
        }

        const data = await response.json();

        if (data.success) {
          toast.success("Payment successful! You are now enrolled.");
          router.push(`/courses/${courseId}`); // Redirect to the course page
        } else {
          toast.error("Payment verification failed.");
          router.push("/");
        }
      } catch (error) {
        console.error("Verification Error:", error);
        toast.error("Error verifying payment.");
        router.push("/");
      } finally {
        setIsVerifying(false);
      }
    };

    verifyPayment();
  }, [orderId, email, courseId, router]);

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-100 to-purple-100">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center bg-white p-8 rounded-lg shadow-lg"
      >
        <h1 className="text-2xl font-semibold mb-4">Verifying Payment</h1>
        {isVerifying && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
            className="mb-4"
          >
            <Loader2 className="w-12 h-12 text-blue-500 mx-auto" />
          </motion.div>
        )}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          Please wait while we verify your payment.
        </motion.p>
      </motion.div>
    </div>
  );
}
