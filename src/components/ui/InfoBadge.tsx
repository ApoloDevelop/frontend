interface InfoBadgeProps {
  label: string;
  value: string | number | null;
  variant?: "purple" | "gray" | "blue" | "green";
  className?: string;
}

const variantStyles = {
  purple: "bg-purple-100 text-purple-700",
  gray: "bg-gray-100 text-gray-600",
  blue: "bg-blue-100 text-blue-700",
  green: "bg-green-100 text-green-700",
};

export function InfoBadge({
  label,
  value,
  variant = "gray",
  className = "",
}: InfoBadgeProps) {
  return (
    <div
      aria-label={label}
      className={`min-w-16 rounded-xl px-3 py-2 text-center ${variantStyles[variant]} ${className}`}
    >
      <div className="text-xs uppercase tracking-wide">{label}</div>
      <div className="text-2xl font-bold">{value ?? "-"}</div>
    </div>
  );
}
