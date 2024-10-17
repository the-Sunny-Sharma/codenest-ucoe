import React from "react";
import { AlertTriangle } from "lucide-react";

export function AlertBanner() {
  return (
    <div className="bg-yellow-100 dark:bg-yellow-900 p-2 text-center">
      <AlertTriangle className="inline-block mr-2" />
      <span className="text-sm font-medium">
        This project is still under development.
      </span>
    </div>
  );
}
