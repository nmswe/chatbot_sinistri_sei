import Image from "next/image";

export default function Intro() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <Image
        src="/intro_scenarios/living-room-svg.svg"
        alt="Logo"
        width={400}
        height={400}
      />
    </div>
  );
}
