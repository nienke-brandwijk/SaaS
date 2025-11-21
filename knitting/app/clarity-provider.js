'use client';

import { useEffect } from 'react';
import Clarity from '@microsoft/clarity';

export default function ClarityProvider() {
  useEffect(() => {
    Clarity.init('u6134nr9yg');
  }, []);

  return null;
}