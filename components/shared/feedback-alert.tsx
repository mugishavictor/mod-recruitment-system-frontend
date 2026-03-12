import { CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type FeedbackAlertProps = {
  type: "success" | "error";
  title: string;
  message?: string;
  className?: string;
};

export function FeedbackAlert({
  type,
  title,
  message,
  className,
}: FeedbackAlertProps) {
  const isSuccess = type === "success";

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-xl border p-4 shadow-sm",
        isSuccess
          ? "border-green-200 bg-green-50 text-green-900"
          : "border-red-200 bg-red-50 text-red-900",
        className
      )}
    >
      <div className="mt-0.5">
        {isSuccess ? (
          <CheckCircle2 className="h-5 w-5 text-green-600" />
        ) : (
          <AlertCircle className="h-5 w-5 text-red-600" />
        )}
      </div>

      <div className="space-y-1">
        <h4 className="text-sm font-semibold">{title}</h4>
        {message ? <p className="text-sm opacity-90">{message}</p> : null}
      </div>
    </div>
  );
}