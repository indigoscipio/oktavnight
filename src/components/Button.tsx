import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "ghost" | "danger" | "link";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
  fullWidth?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-gray-200 text-gray-950 hover:bg-gray-300 cursor-pointer px-5 py-2 rounded font-medium text-sm",
  ghost:
    "border border-gray-700 text-gray-300 hover:bg-gray-800 cursor-pointer px-5 py-2 rounded text-sm",
  danger:
    "border border-red-900 text-red-400 hover:bg-red-950 cursor-pointer px-5 py-2 rounded text-sm",
  link:
    "text-gray-400 hover:text-gray-200 cursor-pointer underline underline-offset-2 text-sm",
};

export default function Button({
  variant = "primary",
  children,
  fullWidth,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none ${
        fullWidth ? "w-full" : ""
      } ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
