import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

import "@/styles/common/PageSizeSelect.css";

interface PageSizeSelectProps {
  value: number;
  options: number[];
  onChange: (value: number) => void;
  label?: string;
}

export default function PageSizeSelect({
  value,
  options,
  onChange,
  label = "Resultados por página",
}: PageSizeSelectProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!rootRef.current) return;

      if (!rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className={`page-size-select ${open ? "page-size-select--open" : ""}`}
    >
      <span className="page-size-select__label">
        {label}
      </span>

      <button
        type="button"
        className="page-size-select__trigger"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="page-size-select__value">
          {value}
        </span>

        <ChevronDown
          size={14}
          strokeWidth={2}
          className="page-size-select__chevron"
        />
      </button>

      {open ? (
        <div
          className="page-size-select__menu"
          role="listbox"
          aria-label={label}
        >
          {options.map((option) => {
            const selected = option === value;

            return (
              <button
                key={option}
                type="button"
                role="option"
                aria-selected={selected}
                className={`page-size-select__option ${
                  selected ? "page-size-select__option--selected" : ""
                }`}
                onClick={() => {
                  onChange(option);
                  setOpen(false);
                }}
              >
                <span>{option}</span>

                {selected ? (
                  <Check
                    size={14}
                    strokeWidth={2.2}
                  />
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}