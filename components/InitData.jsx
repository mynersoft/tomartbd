'use client';

import { useProducts } from '@/hooks/useProducts';
import { useBlogs } from './../hooks/useBlog';
import { useInitializeCart } from '@/hooks/useCart';
import useLoginUser from '@/hooks/useAuth';
import { useStatCard } from '@/hooks/useStatCard';
import { useEffect } from 'react';

export default function InitData() {
  const { user } = useLoginUser();
  useInitializeCart(user?.id);
  useProducts();
  useBlogs();

  useStatCard();
  useEffect(() => {
    fetch('/api/visitor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path: window.location.pathname,
      }),
    });
  }, []);
  return null;
}
