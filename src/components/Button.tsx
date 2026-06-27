import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "ghost" | "danger" | "link";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
  fullWidth?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "border border-amber-200/70 bg-gradient-to-b from-stone-100 to-amber-100 text-gray-950 hover:from-white hover:to-amber-50 active:from-amber-100 cursor-pointer px-5 py-2 rounded font-medium text-sm shadow-[0_0_18px_rgba(251,191,36,0.16)]",
  ghost:
    "border border-gray-700/80 bg-black/10 text-gray-300 hover:border-gray-500 hover:bg-gray-800/70 hover:text-gray-100 active:bg-gray-900 cursor-pointer px-5 py-2 rounded text-sm",
  danger:
    "border border-red-800/80 bg-red-950/15 text-red-300 hover:border-red-600 hover:bg-red-950/45 active:bg-red-950 cursor-pointer px-5 py-2 rounded text-sm",
  link:
    "text-gray-400 hover:text-gray-100 active:text-gray-300 cursor-pointer underline underline-offset-4 decoration-gray-700 hover:decoration-gray-300 text-sm",
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
      className={`inline-flex items-center justify-center gap-2 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200/80 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 disabled:opacity-45 disabled:cursor-not-allowed disabled:pointer-events-none ${
        fullWidth ? "w-full" : ""
      } ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
