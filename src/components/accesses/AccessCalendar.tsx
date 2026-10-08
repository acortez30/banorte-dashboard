import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import "@/styles/accesses/AccessCalendar.css";


interface AccessCalendarProps {
  value: string;
  max: string;

  onChange: (
    value: string,
  ) => void;
}


const MONTH_FORMATTER =
  new Intl.DateTimeFormat(
    "es-MX",
    {
      month: "long",
      year: "numeric",
    },
  );


const VALUE_FORMATTER =
  new Intl.DateTimeFormat(
    "es-MX",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  );


const WEEK_DAYS = [
  "D",
  "L",
  "M",
  "M",
  "J",
  "V",
  "S",
];


function parseDate(
  value: string,
) {
  const [
    year,
    month,
    day,
  ] = value
    .split("-")
    .map(Number);

  return new Date(
    year,
    month - 1,
    day,
    12,
    0,
    0,
  );
}


function toDateValue(
  date: Date,
) {
  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() + 1,
    ).padStart(
      2,
      "0",
    );

  const day =
    String(
      date.getDate(),
    ).padStart(
      2,
      "0",
    );

  return `${year}-${month}-${day}`;
}


function sameDay(
  first: Date,
  second: Date,
) {
  return (
    first.getFullYear() ===
      second.getFullYear() &&
    first.getMonth() ===
      second.getMonth() &&
    first.getDate() ===
      second.getDate()
  );
}


export default function AccessCalendar({
  value,
  max,
  onChange,
}: AccessCalendarProps) {
  const [
    open,
    setOpen,
  ] = useState(false);


  const selectedDate =
    useMemo(
      () =>
        parseDate(
          value,
        ),
      [value],
    );


  const maxDate =
    useMemo(
      () =>
        parseDate(
          max,
        ),
      [max],
    );


  const [
    visibleMonth,
    setVisibleMonth,
  ] = useState(
    new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      1,
      12,
    ),
  );


  const rootRef =
    useRef<HTMLDivElement | null>(
      null,
    );


  useEffect(() => {
    setVisibleMonth(
      new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        1,
        12,
      ),
    );
  }, [
    selectedDate,
  ]);


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
        setOpen(
          false,
        );
      }
    };


    const handleEscape = (
      event: KeyboardEvent,
    ) => {
      if (
        event.key ===
        "Escape"
      ) {
        setOpen(
          false,
        );
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
     MONTH
     ======================================================= */

  const days =
    useMemo(
      () => {
        const year =
          visibleMonth.getFullYear();

        const month =
          visibleMonth.getMonth();


        const firstDay =
          new Date(
            year,
            month,
            1,
            12,
          );


        const lastDay =
          new Date(
            year,
            month + 1,
            0,
            12,
          );


        const startOffset =
          firstDay.getDay();


        const result:
          Date[] = [];


        /*
         * Always render 6 weeks.
         */
        for (
          let index = 0;
          index < 42;
          index += 1
        ) {
          result.push(
            new Date(
              year,
              month,
              index -
                startOffset +
                1,
              12,
            ),
          );
        }


        return {
          dates:
            result,

          lastDay,
        };
      },
      [
        visibleMonth,
      ],
    );


  /* =======================================================
     NAVIGATION
     ======================================================= */

  const canGoNext =
    useMemo(
      () => {
        const nextMonth =
          new Date(
            visibleMonth.getFullYear(),
            visibleMonth.getMonth() +
              1,
            1,
            12,
          );


        const maxMonth =
          new Date(
            maxDate.getFullYear(),
            maxDate.getMonth(),
            1,
            12,
          );


        return (
          nextMonth <=
          maxMonth
        );
      },
      [
        maxDate,
        visibleMonth,
      ],
    );


  const previousMonth = () => {
    setVisibleMonth(
      (
        current,
      ) =>
        new Date(
          current.getFullYear(),
          current.getMonth() -
            1,
          1,
          12,
        ),
    );
  };


  const nextMonth = () => {
    if (
      !canGoNext
    ) {
      return;
    }


    setVisibleMonth(
      (
        current,
      ) =>
        new Date(
          current.getFullYear(),
          current.getMonth() +
            1,
          1,
          12,
        ),
    );
  };


  const selectDate = (
    date: Date,
  ) => {
    if (
      date >
      maxDate
    ) {
      return;
    }


    onChange(
      toDateValue(
        date,
      ),
    );


    setOpen(
      false,
    );
  };


  const selectToday = () => {
    onChange(
      max,
    );


    setVisibleMonth(
      new Date(
        maxDate.getFullYear(),
        maxDate.getMonth(),
        1,
        12,
      ),
    );


    setOpen(
      false,
    );
  };


  const formattedValue =
    VALUE_FORMATTER.format(
      selectedDate,
    );


  const formattedMonth =
    MONTH_FORMATTER.format(
      visibleMonth,
    );


  return (
    <div
      ref={rootRef}
      className={`
        access-calendar

        ${
          open
            ? "access-calendar--open"
            : ""
        }
      `}
    >
      {/* ===================================================
          TRIGGER
          =================================================== */}

      <button
        type="button"
        className="access-calendar__trigger"
        onClick={() => {
          setOpen(
            (
              current,
            ) =>
              !current,
          );
        }}
        aria-haspopup="dialog"
        aria-expanded={
          open
        }
      >
        <span className="access-calendar__trigger-icon">
          <CalendarDays
            size={16}
            strokeWidth={2}
          />
        </span>


        <span className="access-calendar__trigger-copy">
          <small>
            Fecha
          </small>

          <strong>
            {formattedValue}
          </strong>
        </span>


        <ChevronDown
          size={15}
          strokeWidth={2}
          className="access-calendar__trigger-chevron"
        />
      </button>


      {/* ===================================================
          POPOVER
          =================================================== */}

      {open ? (
        <div
          className="access-calendar__popover"
          role="dialog"
          aria-label="Seleccionar fecha"
        >
          {/* HEADER */}

          <div className="access-calendar__header">
            <div>
              <span>
                Seleccionar fecha
              </span>

              <strong>
                {formattedMonth}
              </strong>
            </div>


            <div className="access-calendar__navigation">
              <button
                type="button"
                onClick={
                  previousMonth
                }
                aria-label="Mes anterior"
              >
                <ChevronLeft
                  size={16}
                />
              </button>


              <button
                type="button"
                onClick={
                  nextMonth
                }
                disabled={
                  !canGoNext
                }
                aria-label="Mes siguiente"
              >
                <ChevronRight
                  size={16}
                />
              </button>
            </div>
          </div>


          {/* WEEK */}

          <div className="access-calendar__week">
            {WEEK_DAYS.map(
              (
                day,
                index,
              ) => (
                <span
                  key={`${day}-${index}`}
                >
                  {day}
                </span>
              ),
            )}
          </div>


          {/* DAYS */}

          <div className="access-calendar__days">
            {days.dates.map(
              (
                date,
                index,
              ) => {
                const outsideMonth =
                  date.getMonth() !==
                  visibleMonth.getMonth();


                const selected =
                  sameDay(
                    date,
                    selectedDate,
                  );


                const today =
                  sameDay(
                    date,
                    maxDate,
                  );


                const future =
                  date >
                  maxDate;


                return (
                  <button
                    key={`${toDateValue(
                      date,
                    )}-${index}`}
                    type="button"
                    disabled={
                      future
                    }
                    className={`
                      access-calendar__day

                      ${
                        outsideMonth
                          ? "access-calendar__day--outside"
                          : ""
                      }

                      ${
                        selected
                          ? "access-calendar__day--selected"
                          : ""
                      }

                      ${
                        today
                          ? "access-calendar__day--today"
                          : ""
                      }
                    `}
                    onClick={() => {
                      selectDate(
                        date,
                      );
                    }}
                  >
                    {date.getDate()}
                  </button>
                );
              },
            )}
          </div>


          {/* FOOTER */}

          <div className="access-calendar__footer">
            <span>
              No puedes consultar fechas futuras.
            </span>

            <button
              type="button"
              onClick={
                selectToday
              }
            >
              Ir a hoy
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}