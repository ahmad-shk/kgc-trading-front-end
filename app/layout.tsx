'use client';

import './globals.css'
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { useEffect } from 'react';
import '../config/appkitConfig';
import { useAppKitAccount, useDisconnect } from "@reown/appkit/react";
import { AccountProvider } from '@/config/context/AccountContext';
import { Toaster } from 'sonner';
import Header from '@/components/header';


export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const account = useAppKitAccount(); // Automatically tracks changes from MetaMask
  useEffect(() => {
    console.log('Client-side effect: Component mounted');
  }, []);

  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          <AccountProvider>
            <Toaster richColors position="top-right" />
            <Header />
            {children}
          </AccountProvider>
        </Provider>
      </body>
    </html>
  )
}
