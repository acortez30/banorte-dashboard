export default function ToggleSwitch({ checked, onChange, label }: { checked: boolean; onChange: (checked: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${checked ? "bg-primary" : "bg-slate-300 dark:bg-slate-600"}`}
    >
      <span className={`block h-[18px] w-[18px] rounded-full bg-white shadow transition-transform ${checked ? "translate-x-[22px]" : "translate-x-[3px]"}`} />
    </button>
  );
}
