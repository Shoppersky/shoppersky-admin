'use client';

import React, { useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';

interface Props {
  onParamsFetch: (params: Record<string, string>) => void;
  children?: React.ReactNode;
}

const SuspenseSearchParamsWrapper: React.FC<Props> = ({ onParamsFetch, children }) => {
  const searchParams = useSearchParams();
  const hasFetched = useRef(false); // prevent repeated fetch

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });

    onParamsFetch(params);
  }, [searchParams, onParamsFetch]);

  return <>{children}</>;
};

export default SuspenseSearchParamsWrapper;
