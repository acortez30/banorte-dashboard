import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Boxes,
  Check,
  ChevronDown,
} from "lucide-react";

import type {
  LockerIsland,
} from "@/types/dashboard";

import "@/styles/admin-lockers/LockerIslandSelect.css";

export default function LockerIslandSelect({
  value,
  lockers,
  onChange,
}: {
  value: string;
  lockers: LockerIsland[];
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onMouseDown = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const selected = lockers.find((locker) => locker.id === value) ?? lockers[0];

  return (
    <div ref={rootRef} className={`locker-island-select ${open ? "locker-island-select--open" : ""}`}>
      <button
        type="button"
        className="locker-island-select__trigger"
        onClick={() => setOpen((current) => !current)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="locker-island-select__trigger-main">
          <Boxes size={16} strokeWidth={2} />
          <span>
            <strong>{selected?.alias ?? "Seleccionar isla"}</strong>
            {selected?.location ? <small>{selected.location}</small> : null}
          </span>
        </span>

        <ChevronDown size={16} strokeWidth={2} className="locker-island-select__chevron" />
      </button>

      {open ? (
        <div className="locker-island-select__menu" role="listbox">
          {lockers.map((locker) => {
            const isSelected = locker.id === selected?.id;

            return (
              <button
                key={locker.id}
                type="button"
                role="option"
                aria-selected={isSelected}
                className={`locker-island-select__option ${isSelected ? "locker-island-select__option--selected" : ""}`}
                onClick={() => {
                  onChange(locker.id);
                  setOpen(false);
                }}
              >
                <span>
                  <strong>{locker.alias}</strong>
                  <small>{locker.location}</small>
                </span>
                {isSelected ? <Check size={15} strokeWidth={2.2} /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
