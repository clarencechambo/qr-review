interface StarsProps {
  value: number;
  size?: number;
}

// Read-only star rating display (filled vs empty), gold.
export default function Stars({ value, size = 16 }: StarsProps) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill={i <= value ? "#FBBF24" : "none"}
          stroke={i <= value ? "#FBBF24" : "#D1D5DB"}
          strokeWidth="2"
          strokeLinejoin="round"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </span>
  );
}
