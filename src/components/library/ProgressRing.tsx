export default function ProgressRing({ value }: { value: number }) {
  const clamped = Math.min(Math.max(value, 0), 100);

  return (
    <div
      className="grid h-14 w-14 place-items-center rounded-full"
      style={{
        background: `conic-gradient(#d97706 ${clamped * 3.6}deg, #e7e5e4 0deg)`,
      }}
    >
      <div className="grid h-11 w-11 place-items-center rounded-full bg-white text-xs font-bold text-stone-950">
        {clamped}%
      </div>
    </div>
  );
}
