import Image from 'next/image';
import React from 'react';

const Logo: React.FC = () => {
  return (
    <Image
      src="/logo.png"
      alt="Logo"
      width={20}
      height={20}
    />
  );
};

export default Logo;
