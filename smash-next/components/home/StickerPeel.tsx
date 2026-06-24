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
        {/* exposed backing where the sticker has lifted off — darker in the
            crook of the peel so the curl above reads as raised paper */}
        <div
          className="absolute inset-0 z-[1] rounded-[28px] bg-[radial-gradient(circle_at_88%_88%,#a39a88_0%,#cdc5b4_38%,#efe7d8_70%)] shadow-[inset_0_-2px_14px_rgba(0,0,0,0.18)]"
          style={{ transform: "rotate(-4deg)" }}
        />
        <div
          className="absolute inset-0 z-[2] overflow-hidden rounded-[28px] bg-gradient-to-r from-red to-yellow-bright p-[9px] shadow-[0_22px_44px_rgba(42,20,8,0.26)] transition-transform duration-300 group-hover:scale-[1.03]"
          style={{
            transform: "rotate(-4deg)",
            clipPath: "polygon(0 0, 100% 0, 100% 78%, 78% 100%, 0 100%)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/certified-smash-fan.jpg"
            alt="Certified Smash Fan sticker on a truck window"
            className="block h-full w-full rounded-[19px] object-cover"
          />
        </div>

        {/* curled-up corner flap — the folded paper showing its underside,
            with a lit raised tip and a drop shadow so it floats off the card */}
        <div
          className="absolute inset-0 z-[3] bg-[linear-gradient(135deg,#ffffff_0%,#f3ecdf_40%,#cabfa9_100%)] [filter:drop-shadow(3px_4px_5px_rgba(20,8,2,0.45))]"
          style={{
            transform: "rotate(-4deg)",
            clipPath: "polygon(78% 78%, 100% 78%, 78% 100%)",
          }}
        />
      </div>
    </section>
  );
}
