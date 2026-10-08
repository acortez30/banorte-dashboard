import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Boxes,
  Check,
  ChevronDown,
  Sparkles,
  UsersRound,
} from "lucide-react";

import "@/styles/employees/EmployeeLockerSelect.css";

interface LockerLoad {
  locker: {
    id: string;
    alias: string;
    active: boolean;
  };

  assigned: number;
  available: number;
}

interface EmployeeLockerSelectProps {
  value: string;

  loads: LockerLoad[];

  allowAuto?: boolean;

  currentLockerId?: string;

  onChange: (
    value: string,
  ) => void;
}

const LOCKER_CAPACITY = 113;

export default function EmployeeLockerSelect({
  value,
  loads,
  allowAuto = true,
  currentLockerId,
  onChange,
}: EmployeeLockerSelectProps) {
  const [
    open,
    setOpen,
  ] = useState(false);

  const rootRef =
    useRef<HTMLDivElement | null>(
      null,
    );

  useEffect(() => {
    const handleOutsideClick = (
      event: MouseEvent,
    ) => {
      if (
        rootRef.current &&
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
      if (
        event.key === "Escape"
      ) {
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


  /* =======================================================
     AVAILABLE LOCKERS
     ======================================================= */

  const availableLoads =
    loads.filter(
      ({
        locker,
        available,
      }) =>
        locker.active &&
        (
          available > 0 ||
          locker.id ===
            currentLockerId
        ),
    );

  const selected =
    availableLoads.find(
      ({ locker }) =>
        locker.id === value,
    );


  /* =======================================================
     LABEL
     ======================================================= */

  const selectedLabel =
    value === "AUTO"
      ? "Asignación automática"
      : selected?.locker.alias ??
        "Seleccionar isla";


  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <div
      ref={rootRef}
      className={`
        employee-locker-select
        ${
          open
            ? "employee-locker-select--open"
            : ""
        }
      `}
    >
      {/* TRIGGER */}
      <button
        type="button"
        className="employee-locker-select__trigger"
        onClick={() => {
          setOpen(
            (current) =>
              !current,
          );
        }}
        aria-expanded={
          open
        }
        aria-haspopup="listbox"
      >
        <div className="employee-locker-select__trigger-content">
          {value === "AUTO" ? (
            <Sparkles
              size={15}
              strokeWidth={2}
            />
          ) : (
            <Boxes
              size={15}
              strokeWidth={2}
            />
          )}

          <span>
            {selectedLabel}
          </span>
        </div>

        <ChevronDown
          size={15}
          strokeWidth={2}
          className="employee-locker-select__chevron"
        />
      </button>


      {/* MENU */}
      {open ? (
        <div
          className="employee-locker-select__menu"
          role="listbox"
        >
          {/* AUTO */}
          {allowAuto ? (
            <button
              type="button"
              role="option"
              aria-selected={
                value === "AUTO"
              }
              className={`
                employee-locker-select__option
                employee-locker-select__option--auto

                ${
                  value === "AUTO"
                    ? "employee-locker-select__option--selected"
                    : ""
                }
              `}
              onClick={() => {
                onChange(
                  "AUTO",
                );

                setOpen(
                  false,
                );
              }}
            >
              <div className="employee-locker-select__option-main">
                <div className="employee-locker-select__option-icon">
                  <Sparkles
                    size={15}
                    strokeWidth={2}
                  />
                </div>

                <div>
                  <strong>
                    Asignación automática
                  </strong>

                  <span>
                    Selecciona la isla con menor carga
                  </span>
                </div>
              </div>

              {value === "AUTO" ? (
                <Check
                  size={15}
                  strokeWidth={2.2}
                />
              ) : null}
            </button>
          ) : null}


          {/* LOCKERS */}
          {availableLoads.map(
            ({
              locker,
              assigned,
              available,
            }) => {
              const isSelected =
                value ===
                locker.id;

              const percentage =
                Math.min(
                  100,
                  Math.round(
                    (
                      assigned /
                      LOCKER_CAPACITY
                    ) *
                      100,
                  ),
                );

              return (
                <button
                  key={
                    locker.id
                  }
                  type="button"
                  role="option"
                  aria-selected={
                    isSelected
                  }
                  className={`
                    employee-locker-select__option

                    ${
                      isSelected
                        ? "employee-locker-select__option--selected"
                        : ""
                    }
                  `}
                  onClick={() => {
                    onChange(
                      locker.id,
                    );

                    setOpen(
                      false,
                    );
                  }}
                >
                  <div className="employee-locker-select__option-main">
                    <div className="employee-locker-select__option-icon">
                      <Boxes
                        size={15}
                        strokeWidth={2}
                      />
                    </div>

                    <div className="employee-locker-select__option-details">
                      <div className="employee-locker-select__option-title">
                        <strong>
                          {
                            locker.alias
                          }
                        </strong>

                        <span>
                          {
                            percentage
                          }
                          %
                        </span>
                      </div>

                      <div className="employee-locker-select__option-meta">
                        <span>
                          <UsersRound
                            size={12}
                          />

                          {
                            assigned
                          }{" "}
                          asignados
                        </span>

                        <span>
                          {
                            available
                          }{" "}
                          libres
                        </span>
                      </div>
                    </div>
                  </div>

                  {isSelected ? (
                    <Check
                      size={15}
                      strokeWidth={2.2}
                    />
                  ) : null}
                </button>
              );
            },
          )}
        </div>
      ) : null}
    </div>
  );
}