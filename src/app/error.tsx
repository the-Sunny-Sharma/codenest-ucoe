"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ErrorPageProps {
  error: Error;
  reset: () => void;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ error, reset }) => {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Oops! Something went wrong</AlertTitle>
          <AlertDescription>
            We apologize for the inconvenience. An unexpected error has
            occurred.
          </AlertDescription>
        </Alert>

        <div className="bg-card text-card-foreground rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-4">Error Details</h1>
          <p className="text-muted-foreground mb-4">
            {error.message || "An unknown error occurred."}
          </p>

          <div className="flex flex-col space-y-4">
            <Button onClick={reset} variant="default" className="w-full">
              <RefreshCcw className="mr-2 h-4 w-4" /> Try Again
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" /> Return to Home
              </Link>
            </Button>
          </div>

          <p className="mt-6 text-sm text-center text-muted-foreground">
            If this error persists, please{" "}
            <Link href="/contact" className="text-primary hover:underline">
              contact our support team
            </Link>
            .
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default ErrorPage;
