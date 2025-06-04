'use client';

import { useEffect } from 'react';

interface PageTitleUpdaterProps {
  price?: string;
  coinName?: string;
  anotherPage?: string;
}

const PageTitleUpdater: React.FC<PageTitleUpdaterProps> = ({ price, coinName, anotherPage }) => {
  useEffect(() => {
    if (anotherPage === "buyCrypto") {
      if (coinName && price !== undefined) {
        document.title = `${price} | ${coinName} | KGC Trading`;
      }
    } else {
      document.title = `${anotherPage} | KGC Trading`;
    }
  }, [price, coinName, anotherPage]);

  return null;
};

export default PageTitleUpdater;
