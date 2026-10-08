import type {
  LucideIcon,
} from "lucide-react";

import {
  Info,
} from "lucide-react";

import "@/styles/common/MetricCard.css";

export type MetricCardTone =
  | "neutral"
  | "brand"
  | "success"
  | "warning"
  | "danger";

interface MetricCardProps {
  label: string;
  value: string | number;

  helper?: string;
  description?: string;

  icon: LucideIcon;

  tone?: MetricCardTone;

  metaLabel?: string;
  metaValue?: string | number;
}

export default function MetricCard({
  label,
  value,
  helper,
  description,
  icon: Icon,
  tone = "neutral",
  metaLabel,
  metaValue,
}: MetricCardProps) {
  return (
    <article
      className={`
        metric-card
        metric-card--${tone}
      `}
    >
      {/* ===================================================
          HEADER
          =================================================== */}
      <div className="metric-card__header">
        <div className="metric-card__heading">
          <span className="metric-card__label">
            {label}
          </span>

          {description ? (
            <div className="metric-card__tooltip">
              <button
                type="button"
                className="metric-card__info"
                aria-label={`Información sobre ${label}`}
              >
                <Info
                  size={13}
                  strokeWidth={2}
                />
              </button>

              <div
                className="metric-card__tooltip-content"
                role="tooltip"
              >
                <strong>
                  {label}
                </strong>

                <p>
                  {description}
                </p>
              </div>
            </div>
          ) : null}
        </div>

        <div className="metric-card__icon">
          <Icon
            size={19}
            strokeWidth={2}
          />
        </div>
      </div>

      {/* ===================================================
          KPI
          =================================================== */}
      <div className="metric-card__main">
        <div className="metric-card__value">
          {value}
        </div>

        {helper ? (
          <p className="metric-card__helper">
            {helper}
          </p>
        ) : null}
      </div>

      {/* ===================================================
          SECONDARY INFORMATION
          =================================================== */}
      {metaLabel || metaValue !== undefined ? (
        <div className="metric-card__meta">
          <span className="metric-card__meta-label">
            {metaLabel}
          </span>

          {metaValue !== undefined ? (
            <span className="metric-card__meta-value">
              {metaValue}
            </span>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}