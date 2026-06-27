/**
 * Shimmer skeleton placeholder for menu cards. Render while menu data is loading
 * (client-fetch flows), then swap in the real cards. Animation is a pure
 * transform sweep — no spinner. Reduced-motion users see a static block.
 */
export default function MenuSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="mx-auto grid max-w-[1240px] grid-cols-1 gap-[34px] px-10 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="relative h-72 overflow-hidden rounded-[30px] bg-cream-card"
        >
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-black/[0.06] to-transparent" />
        </div>
      ))}
    </div>
  );
}
