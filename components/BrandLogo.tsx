import Image from "next/image";

type BrandLogoProps = {
  className?: string;
  priority?: boolean;
};

export function BrandLogo({ className = "h-auto w-[140px]", priority = false }: BrandLogoProps) {
  return (
    <Image
      src="/images/agriarche-logo.png"
      alt="Agriarche"
      width={334}
      height={90}
      priority={priority}
      className={className}
    />
  );
}
