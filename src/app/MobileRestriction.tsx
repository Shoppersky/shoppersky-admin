"use client";

import { useEffect, useState } from "react";

export default function MobileRestriction({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768); // mobile threshold
    handleResize(); // initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isMobile) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center p-4 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
        {/* Koala bear image */}
        <img
          src="/koala.png" // place your koala image in public folder
          alt="Koala Bear"
          className="w-32 h-32 mb-4 object-contain"
        />
        <h1 className="text-lg sm:text-xl font-semibold">
          This application is available on tablet and laptop screens only.
        </h1>
      </div>
    );
  }

  return <>{children}</>;
}
