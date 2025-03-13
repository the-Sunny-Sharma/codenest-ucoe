"use client";
import { useState, useEffect } from "react";

const formatTimeRemaining = (scheduledTime: string | Date) => {
  const now = new Date();
  const scheduleDate = new Date(scheduledTime);
  const timeRemaining = scheduleDate.getTime() - now.getTime();

  if (timeRemaining <= 0) return "Starting soon";

  const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

  if (days > 0) return `${days}d ${hours}h ${minutes}m remaining`;
  if (hours > 0) return `${hours}h ${minutes}m remaining`;
  if (minutes > 0) return `${minutes}m ${seconds}s remaining`;
  return `${seconds}s remaining`;
};

const CountdownTimer = ({
  scheduledTime,
}: {
  scheduledTime: string | Date;
}) => {
  console.log("CountdownTimer mounted"); // ✅ Debug 1: Check if component is rendering

  console.log("Scheduled time received:", scheduledTime); // ✅ Debug 2: Check scheduledTime value
  const parsedScheduledTime = new Date(scheduledTime);
  console.log("Parsed scheduled date:", parsedScheduledTime); // ✅ Debug 3: Check if it's a valid date

  const [timeLeft, setTimeLeft] = useState(
    formatTimeRemaining(parsedScheduledTime)
  );

  useEffect(() => {
    console.log("useEffect triggered, scheduledTime:", scheduledTime); // ✅ Debug 5: Check if effect runs on prop change

    const updateTimer = () => {
      const newTimeLeft = formatTimeRemaining(parsedScheduledTime);
      console.log("Updated time left:", newTimeLeft); // ✅ Debug 4: Check if countdown is updating
      setTimeLeft(newTimeLeft);
    };

    // Initial update
    updateTimer();

    // Update every second
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [scheduledTime]);

  return <span className="ml-2 text-orange-500">{timeLeft}</span>;
};

export default CountdownTimer;
