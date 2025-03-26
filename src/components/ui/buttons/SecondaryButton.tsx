import { ReactNode } from "react";

interface SecondaryButtonProps {
  text: string;
  onClick: () => void;
  icon?: ReactNode;
  disabled?: boolean;
  active?: boolean;
  styles?: string;
}

export function SecondaryButton({
  text,
  onClick,
  icon,
  disabled = false,
  active = false,
  styles = "",
}: SecondaryButtonProps) {
  const baseStyles = "flex items-center justify-center rounded-[5px] px-3 py-2 transition-colors duration-200";
  const stateStyles = disabled
    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
    : active
    ? "bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100"
    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${stateStyles} ${styles}`}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {text}
    </button>
  );
}