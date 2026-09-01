import FXImg from "@/components/fx/FXImg";
export function PageHeroArt({ src, focus = "50% 50%" }: { src: string; focus?: string }) {
  return (
    <span className="page-hero-art" aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <FXImg className="page-hero-img" src={src} alt="" style={{ objectPosition: focus }} />
      <span className="page-hero-scrim" />
    </span>
  );
}
