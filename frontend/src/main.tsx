import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { CaptainProvider } from './context/CaptainContext';
import { UserProvider } from './context/userContext.tsx';
import { ShopProvider } from './context/shopdataContext.tsx';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ShopProvider>
    <UserProvider>
      <CaptainProvider>
        <App />
      </CaptainProvider>
    </UserProvider>
    </ShopProvider>
  </StrictMode>
);
