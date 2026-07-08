interface ToastProps {
  message: string;
  type?: "success" | "error" | "warning" | "info";
}

const styles = {
  success: "bg-green-600",
  error: "bg-red-600",
  warning: "bg-yellow-500",
  info: "bg-blue-600",
};

const icons = {
  success: "✅",
  error: "❌",
  warning: "⚠️",
  info: "ℹ️",
};

export default function Toast({
  message,
  type = "success",
}: ToastProps) {
  return (
    <div
      className={`fixed top-5 right-5 z-50 px-6 py-4 rounded-xl shadow-xl text-white transition-all duration-300 ${styles[type]}`}
    >
      <span className="mr-2">{icons[type]}</span>
      {message}
    </div>
  );
}