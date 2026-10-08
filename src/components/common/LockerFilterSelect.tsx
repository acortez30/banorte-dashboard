import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Check,
  ChevronDown,
  Boxes,
} from "lucide-react";

import "@/styles/common/LockerFilterSelect.css";

interface LockerOption {
  id: string;
  alias: string;
}

interface LockerFilterSelectProps {
  value: string;
  lockers: LockerOption[];
  onChange: (value: string) => void;
}

export default function LockerFilterSelect({
  value,
  lockers,
  onChange,
}: LockerFilterSelectProps) {
  const [open, setOpen] = useState(false);

  const rootRef =
    useRef<HTMLDivElement | null>(
      null,
    );

  useEffect(() => {
    const handleOutsideClick = (
      event: MouseEvent,
    ) => {
      if (!rootRef.current) {
        return;
      }

      if (
        !rootRef.current.contains(
          event.target as Node,
        )
      ) {
        setOpen(false);
      }
    };

    const handleEscape = (
      event: KeyboardEvent,
    ) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick,
    );

    document.addEventListener(
      "keydown",
      handleEscape,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick,
      );

      document.removeEventListener(
        "keydown",
        handleEscape,
      );
    };
  }, []);

  const selectedLocker =
    value === "ALL"
      ? null
      : lockers.find(
          (locker) =>
            locker.id === value,
        );

  const selectedLabel =
    selectedLocker?.alias ??
    "Todas las islas";

  return (
    <div
      ref={rootRef}
      className={`
        locker-filter
        ${
          open
            ? "locker-filter--open"
            : ""
        }
      `}
    >
      {/* ===================================================
          TRIGGER
          =================================================== */}
      <button
        type="button"
        className="locker-filter__trigger"
        onClick={() => {
          setOpen(
            (current) => !current,
          );
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Filtrar empleados por isla"
      >
        <div className="locker-filter__trigger-content">
          <Boxes
            size={15}
            strokeWidth={2}
            className="locker-filter__trigger-icon"
          />

          <span className="locker-filter__trigger-label">
            {selectedLabel}
          </span>
        </div>

        <ChevronDown
          size={15}
          strokeWidth={2}
          className="locker-filter__chevron"
        />
      </button>

      {/* ===================================================
          DROPDOWN
          =================================================== */}
      {open ? (
        <div
          className="locker-filter__menu"
          role="listbox"
          aria-label="Seleccionar isla"
        >
          {/* ALL */}
          <button
            type="button"
            role="option"
            aria-selected={
              value === "ALL"
            }
            className={`
              locker-filter__option
              ${
                value === "ALL"
                  ? "locker-filter__option--selected"
                  : ""
              }
            `}
            onClick={() => {
              onChange("ALL");
              setOpen(false);
            }}
          >
            <div className="locker-filter__option-content">
              <div className="locker-filter__option-icon">
                <Boxes
                  size={14}
                  strokeWidth={2}
                />
              </div>

              <span>
                Todas las islas
              </span>
            </div>

            {value === "ALL" ? (
              <Check
                size={15}
                strokeWidth={2.2}
              />
            ) : null}
          </button>

          {/* LOCKERS */}
          {lockers.map((locker) => {
            const selected =
              value === locker.id;

            return (
              <button
                key={locker.id}
                type="button"
                role="option"
                aria-selected={
                  selected
                }
                className={`
                  locker-filter__option
                  ${
                    selected
                      ? "locker-filter__option--selected"
                      : ""
                  }
                `}
                onClick={() => {
                  onChange(
                    locker.id,
                  );

                  setOpen(false);
                }}
              >
                <div className="locker-filter__option-content">
                  <div className="locker-filter__option-icon">
                    <Boxes
                      size={14}
                      strokeWidth={2}
                    />
                  </div>

                  <span>
                    {locker.alias}
                  </span>
                </div>

                {selected ? (
                  <Check
                    size={15}
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