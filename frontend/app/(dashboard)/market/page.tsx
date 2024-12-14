'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const MarketplaceContent = dynamic(
  () => import('./MarketplaceContent'),
  { 
    ssr: false
  }
);

export default function MarketplacePage() {
  return <MarketplaceContent />;
}