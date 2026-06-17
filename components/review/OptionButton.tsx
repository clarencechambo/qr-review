"use client";

interface OptionButtonProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

export default function OptionButton({ label, selected, onClick }: OptionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-3 text-left border rounded-2xl px-4 py-3.5 text-sm font-medium transition-all"
      style={{
        backgroundColor: selected ? "#E8174B0d" : "#fff",
        borderColor: selected ? "#E8174B" : "#e5e7eb",
        color: "#111827",
      }}
    >
      <span
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors"
        style={{
          borderColor: selected ? "#E8174B" : "#d1d5db",
          backgroundColor: selected ? "#E8174B" : "transparent",
        }}
      >
        {selected && (
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        )}
      </span>
      <span>{label}</span>
    </button>
  );
}
