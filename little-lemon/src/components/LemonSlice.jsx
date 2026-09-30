/** Decorative lemon slice. Hidden from assistive technology because it carries no information. */
export default function LemonSlice({ className }) {
  const spokes = Array.from({ length: 10 }, (_, i) => i * 36);
  return (
    <svg className={className} viewBox="0 0 200 200" aria-hidden="true" focusable="false">
      <circle cx="100" cy="100" r="96" fill="#E6B800" />
      <circle cx="100" cy="100" r="88" fill="#FFF3B0" />
      <circle cx="100" cy="100" r="76" fill="#F4CE14" />
      {spokes.map((angle) => (
        <line
          key={angle}
          x1="100"
          y1="100"
          x2="100"
          y2="26"
          stroke="#FFF3B0"
          strokeWidth="4"
          strokeLinecap="round"
          transform={`rotate(${angle} 100 100)`}
        />
      ))}
      <circle cx="100" cy="100" r="8" fill="#FFF3B0" />
    </svg>
  );
}
