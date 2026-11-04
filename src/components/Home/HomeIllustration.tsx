import Image from "next/image";

interface HomeIllustrationProps {
  className: string;
}

const HomeIllustration = ({ className }: HomeIllustrationProps) => {
  return (
    <div className={className}>
      <Image
        src="/gif-collection/headroll.gif"
        alt="Illustration"
        width={100}
        height={100}
      />
      <h1>Illu</h1>
    </div>
  );
};

export default HomeIllustration;
