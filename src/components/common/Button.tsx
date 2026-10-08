import type {
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

import type {
  LucideIcon,
} from "lucide-react";

import "@/styles/common/Button.css";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger";

export type ButtonSize =
  | "sm"
  | "md"
  | "lg";

interface ButtonProps
  extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "children"
  > {
  children: ReactNode;

  icon?: LucideIcon;

  iconPosition?: "left" | "right";

  variant?: ButtonVariant;

  size?: ButtonSize;

  fullWidth?: boolean;

  loading?: boolean;
}

export default function Button({
  children,

  icon: Icon,

  iconPosition = "left",

  variant = "primary",

  size = "md",

  fullWidth = false,

  loading = false,

  type = "button",

  className = "",

  disabled,

  ...props
}: ButtonProps) {
  const isDisabled =
    disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={`
        app-button
        app-button--${variant}
        app-button--${size}

        ${
          fullWidth
            ? "app-button--full"
            : ""
        }

        ${
          loading
            ? "app-button--loading"
            : ""
        }

        ${className}
      `}
      {...props}
    >
      {loading ? (
        <span
          className="app-button__spinner"
          aria-hidden="true"
        />
      ) : (
        <>
          {Icon &&
          iconPosition === "left" ? (
            <Icon
              size={17}
              strokeWidth={2}
              className="app-button__icon"
              aria-hidden="true"
            />
          ) : null}

          <span className="app-button__label">
            {children}
          </span>

          {Icon &&
          iconPosition === "right" ? (
            <Icon
              size={17}
              strokeWidth={2}
              className="app-button__icon"
              aria-hidden="true"
            />
          ) : null}
        </>
      )}
    </button>
  );
}