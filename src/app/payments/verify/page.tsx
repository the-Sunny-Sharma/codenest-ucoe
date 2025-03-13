"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  AlertCircle,
  CheckCircle,
  Loader2,
  RefreshCcw,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PaymentDetails {
  orderId: string;
  amount: number;
  status: string;
  transactionId: string;
  paymentMethod: string;
  date: string;
}

export default function PaymentVerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const orderId = searchParams.get("order_id");
  const email = searchParams.get("email");
  const courseId = searchParams.get("courseId");

  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState<
    "loading" | "success" | "error"
  >("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(
    null
  );
  const [courseDetails, setCourseDetails] = useState<{
    id: string;
    slug: string;
  } | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!orderId || !email || !courseId) {
      toast.error("Invalid payment details");
      setVerificationStatus("error");
      setErrorMessage("Missing required payment information");
      setIsVerifying(false);
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

        const data = await response.json();

        if (response.ok && data.success) {
          setVerificationStatus("success");
          setPaymentDetails(data.paymentDetails);
          setCourseDetails({
            id: data.courseId,
            slug: data.slug,
          });

          if (data.isMock) {
            toast.success("Mock payment successful! You are now enrolled.");
          } else {
            toast.success("Payment successful! You are now enrolled.");
          }
        } else {
          setVerificationStatus("error");
          setErrorMessage(data.error || "Payment verification failed");
          toast.error(data.error || "Payment verification failed");
        }
      } catch (error) {
        console.error("Verification Error:", error);
        setVerificationStatus("error");
        setErrorMessage("Error connecting to payment server");
        toast.error("Error verifying payment");
      } finally {
        setIsVerifying(false);
      }
    };

    verifyPayment();
  }, [orderId, email, courseId, retryCount]);

  const handleRetry = () => {
    setIsVerifying(true);
    setVerificationStatus("loading");
    setRetryCount((prev) => prev + 1);
  };

  const handleGoToCourse = () => {
    if (courseDetails) {
      router.push(`/courses/${courseDetails.id}/${courseDetails.slug}`);
    } else {
      router.push("/courses");
    }
  };

  const handleGoToHome = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            {verificationStatus === "loading" && "Verifying Payment"}
            {verificationStatus === "success" && "Payment Successful"}
            {verificationStatus === "error" && "Payment Verification Failed"}
          </CardTitle>
          <CardDescription className="text-center">
            {verificationStatus === "loading" &&
              "Please wait while we verify your payment"}
            {verificationStatus === "success" &&
              "Your enrollment has been confirmed"}
            {verificationStatus === "error" &&
              "We encountered an issue verifying your payment"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center mb-6">
            {verificationStatus === "loading" && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              >
                <Loader2 className="h-16 w-16 text-primary" />
              </motion.div>
            )}
            {verificationStatus === "success" && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
              >
                <CheckCircle className="h-16 w-16 text-green-500" />
              </motion.div>
            )}
            {verificationStatus === "error" && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
              >
                <AlertCircle className="h-16 w-16 text-red-500" />
              </motion.div>
            )}
          </div>

          {verificationStatus === "success" && paymentDetails && (
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-medium mb-2">Payment Details</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-muted-foreground">Order ID:</span>
                  <span>{paymentDetails.orderId}</span>

                  <span className="text-muted-foreground">Amount:</span>
                  <span>₹{paymentDetails.amount}</span>

                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant="success" className="w-fit">
                    {paymentDetails.status}
                  </Badge>

                  <span className="text-muted-foreground">Transaction ID:</span>
                  <span className="truncate">
                    {paymentDetails.transactionId}
                  </span>

                  <span className="text-muted-foreground">Payment Method:</span>
                  <span>{paymentDetails.paymentMethod}</span>

                  <span className="text-muted-foreground">Date:</span>
                  <span>{new Date(paymentDetails.date).toLocaleString()}</span>
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  A confirmation email has been sent to {email}
                </p>
              </div>
            </div>
          )}

          {verificationStatus === "error" && (
            <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
              <h3 className="font-medium text-red-800 dark:text-red-300 mb-2">
                Error Details
              </h3>
              <p className="text-sm text-red-700 dark:text-red-400">
                {errorMessage}
              </p>
              <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                Order ID: {orderId || "Not available"}
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          {verificationStatus === "success" && (
            <Button className="w-full" onClick={handleGoToCourse}>
              Go to Course <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}

          {verificationStatus === "error" && (
            <>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleRetry}
              >
                <RefreshCcw className="mr-2 h-4 w-4" /> Retry Verification
              </Button>
              <p className="text-xs text-center text-muted-foreground mt-1 mb-2">
                If the problem persists, please contact support with your Order
                ID.
              </p>
            </>
          )}

          <Button variant="ghost" className="w-full" onClick={handleGoToHome}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Return to Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
