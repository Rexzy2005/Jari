import Image from "next/image";

type JariLogoProps = {
  size?: number;
};

export function JariLogo({ size = 40 }: JariLogoProps) {
  return (
    <span className="inline-flex shrink-0">
      <Image
        src="/logo/JARI_navbar_logo.png"
        alt="JARI"
        width={259}
        height={70}
        style={{ width: `${size * 3.7}px`, height: `${size}px` }}
      />
    </span>
  );
}
