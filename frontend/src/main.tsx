import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { CaptainProvider } from './context/CaptainContext';
import { UserProvider } from './context/userContext.tsx';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserProvider>
      <CaptainProvider>
        <App />
      </CaptainProvider>
    </UserProvider>
  </StrictMode>
);
