type Props = {
  children?: React.ReactNode;
};

const Container = ({ children }: Props) => {
  return <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">{children}</div>;
};

export default Container;
