import Image from 'next/image';
import gradientBg from '../assets/image/gradient-bg.png';

export default function GradientBg() {
  return (
    <div className="absolute inset-0 -z-0 ">
      <Image
        src={gradientBg}
        quality={100}
        alt="gradient-bg"
        fill
        className="object-cover"
      />
    </div>
  );
}
