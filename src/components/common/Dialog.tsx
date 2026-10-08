import {
  useEffect,
  type ReactNode,
} from "react";

import {
  X,
} from "lucide-react";

interface DialogProps {
  open: boolean;
  onClose: () => void;

  title: string;
  description?: string;

  children: ReactNode;
  footer?: ReactNode;

  width?: string;

  panelClassName?: string;
}

export default function Dialog({
  open,
  onClose,

  title,
  description,

  children,
  footer,

  width = "max-w-xl",

  panelClassName = "",
}: DialogProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (
        event.key === "Escape"
      ) {
        onClose();
      }
    };

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [
    open,
    onClose,
  ]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="
        fixed inset-0 z-[1000]
        flex items-center justify-center
        p-4 sm:p-6
      "
      role="presentation"
    >
      {/* ===================================================
          OVERLAY
          =================================================== */}
      <button
        type="button"
        className="
          absolute inset-0
          cursor-default
          bg-slate-950/45
          backdrop-blur-[2px]
        "
        onClick={
          onClose
        }
        aria-label="Cerrar diálogo"
      />

      {/* ===================================================
          PANEL
          =================================================== */}
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        aria-describedby={
          description
            ? "dialog-description"
            : undefined
        }
        className={`
          relative z-10
          flex
          w-full
          max-h-[calc(100vh-48px)]
          flex-col
          overflow-hidden

          border border-border
          bg-card

          shadow-[0_28px_80px_rgba(15,23,42,.22),0_10px_30px_rgba(15,23,42,.10)]

          ${width}
          ${panelClassName}
        `}
      >
        {/* =================================================
            HEADER
            ================================================= */}
        <header
          className="
            flex
            shrink-0
            items-start
            justify-between
            gap-5

            border-b border-border

            px-5
            py-4
          "
        >
          <div className="min-w-0">
            <h2
              id="dialog-title"
              className="
                font-poppins
                text-[17px]
                font-bold
                leading-tight
                text-foreground
              "
            >
              {title}
            </h2>

            {description ? (
              <p
                id="dialog-description"
                className="
                  mt-1
                  text-xs
                  leading-relaxed
                  text-muted-foreground
                "
              >
                {description}
              </p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={
              onClose
            }
            className="
              flex
              h-9 w-9
              shrink-0
              items-center
              justify-center

              rounded-[10px]

              border border-transparent

              text-muted-foreground

              transition

              hover:border-border
              hover:bg-muted
              hover:text-primary

              focus:outline-none
              focus-visible:ring-2
              focus-visible:ring-primary/20
            "
            aria-label="Cerrar"
            title="Cerrar"
          >
            <X
              size={18}
              strokeWidth={2}
            />
          </button>
        </header>

        {/* =================================================
            CONTENT
            ================================================= */}
        <div
          className="
            min-h-0
            flex-1
            overflow-y-auto

            px-5
            py-5
          "
        >
          {children}
        </div>

        {/* =================================================
            FOOTER
            ================================================= */}
        {footer ? (
          <footer
            className="
              shrink-0

              border-t border-border

              bg-muted/20

              px-5
              py-3.5
            "
          >
            {footer}
          </footer>
        ) : null}
      </section>
    </div>
  );
}