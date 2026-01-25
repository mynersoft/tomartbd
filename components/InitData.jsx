'use client';

import { useProducts } from '@/hooks/useProducts';
import { useBlogs } from './../hooks/useBlog';
import { useInitializeCart } from '@/hooks/useCart';
import useLoginUser from '@/hooks/useAuth';
import { useStatCard } from '@/hooks/useStatCard';
import { useCombos } from '@/hooks/useCombo';
import { useCategories } from '@/hooks/useCategory';
import { useEffect } from 'react';

export default function InitData() {
  const { user } = useLoginUser();
  useInitializeCart(user?.id);
  useProducts();
  useCategories();
  useCombos();
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
