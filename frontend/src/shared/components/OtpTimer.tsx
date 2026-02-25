import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

type Props = {
  seconds: number; // 120 for 2 min
  onExpire: () => void;
  onReset?: number; // increment this prop to reset the timer
};

export default function OtpTimer({ seconds, onExpire, onReset }: Props) {
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    setRemaining(seconds);
  }, [seconds, onReset]);

  useEffect(() => {
    if (remaining <= 0) { onExpire(); return; }
    const t = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(t);
  }, [remaining, onExpire]);

  const mins = Math.floor(remaining / 60).toString().padStart(2, "0");
  const secs = (remaining % 60).toString().padStart(2, "0");
  const isUrgent = remaining <= 30;

  return (
    <span className={`inline-flex items-center gap-1.5 text-sm font-semibold tabular-nums
      ${isUrgent ? "text-red-500" : "text-indigo-600"}`}
    >
      <Clock className="w-3.5 h-3.5" />
      {mins}:{secs}
    </span>
  );
}
