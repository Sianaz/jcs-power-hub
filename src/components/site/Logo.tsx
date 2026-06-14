import logoAsset from "@/assets/jcs-logo.png.asset.json";

export function Logo({ className = "h-12 w-12" }: { className?: string }) {
  return (
    <img
      src={logoAsset.url}
      alt="Servicios Técnicos JC'S"
      className={`${className} object-contain`}
      loading="eager"
    />
  );
}