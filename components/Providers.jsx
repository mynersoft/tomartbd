'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { Toaster } from 'react-hot-toast';
import Header from '@/components/Header/HeaderNew';
import BottomNavigation from '@/components/Header/BottomMenu';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import GoogleAnalytics from './GoogleAnalytics';
import MessengerChat from './MessengerChat';
import Footer from './Footer';
import WhatsappChat from './WhatsappChat';


const queryClient = new QueryClient();

export default function Providers({ children }) {
  const [activeTab, setActiveTab] = useState('Home');
  const pathname = usePathname();

const isAdmin = pathname.startsWith('/admin');
const isSeller = pathname.startsWith('/seller');
const isUser = pathname.startsWith('/user');

  // Routes where Header should be hidden
  const hideHeader =
    pathname.startsWith('/admin') || pathname.startsWith('/seller') || pathname.startsWith('/user');

  return (
    <SessionProvider>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Toaster />
          <GoogleAnalytics />
          <MessengerChat />

          {/* Header only for non-admin/seller routes */}
          {!hideHeader && <Header />}

          {children}

          <WhatsappChat />

          {/* Footer only for non-admin/seller routes (optional) */}
          {!hideHeader && <Footer />}

          {/* Mobile Bottom Navigation (optional) */}
          {!hideHeader && (
            <div className="block mt-8 md:hidden">
              <BottomNavigation
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            </div>
          )}
        </QueryClientProvider>
      </Provider>
    </SessionProvider>
  );
}
