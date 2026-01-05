interface HomeIllustrationProps {
  className: string;
}

const HomeIllustration = ({ className }: HomeIllustrationProps) => {
  return (
    <div className={className}>
      <h1>Illu</h1>
    </div>
  );
};

export default HomeIllustration;
