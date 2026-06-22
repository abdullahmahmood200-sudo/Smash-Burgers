export default function StickerPeel() {
  return (
    <section className="relative flex flex-wrap items-center justify-center gap-[70px] px-6 py-28">
      <div className="max-w-[460px]">
        <div className="font-poster text-[clamp(16px,1.6vw,24px)] tracking-[2px] text-orange">
          PEEL &amp; STICK
        </div>
        <h2 className="mb-0 mt-2.5 font-display text-[clamp(48px,6vw,96px)] leading-[0.86] tracking-tight text-red-bright [text-shadow:3px_3px_0_#fff]">
          CERTIFIED
          <br />
          SMASH FAN
        </h2>
        <p className="mt-6 text-[clamp(18px,1.5vw,26px)] font-semibold leading-snug text-ink">
          Slap one on your laptop, your truck, your forehead. Every order ships
          with a fresh batch of stickers — peel a corner and see.
        </p>
      </div>

      <div className="group relative h-[clamp(260px,82vw,340px)] w-[clamp(260px,82vw,340px)] flex-none">
        {/* grey "peel" backing — same size/rotation as the card so it only
            shows through the clipped corner with flush edges */}
        <div
          className="absolute inset-0 z-[1] rounded-[28px] bg-gradient-to-br from-[#c9c0b0] to-[#efe7d8] shadow-[inset_0_-2px_14px_rgba(0,0,0,0.18)]"
          style={{ transform: "rotate(-4deg)" }}
        />
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-3.5 overflow-hidden rounded-[28px] border-[9px] border-white bg-red shadow-[0_22px_44px_rgba(42,20,8,0.26)] transition-transform duration-300 group-hover:scale-[1.03]"
          style={{
            transform: "rotate(-4deg)",
            clipPath: "polygon(0 0, 100% 0, 100% 78%, 78% 100%, 0 100%)",
          }}
        >
          <div className="-rotate-3 font-poster text-[46px] tracking-wide text-yellow-bright [text-shadow:3px_3px_0_rgba(0,0,0,0.18)]">
            SMASH
          </div>
          <div className="h-[120px] w-[120px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/burger.png"
              alt=""
              className="block w-full [filter:drop-shadow(0_8px_10px_rgba(0,0,0,0.3))]"
            />
          </div>
          <div className="font-body text-lg font-bold tracking-[3px] text-white">
            EST. 2008
          </div>
        </div>
      </div>
    </section>
  );
}
