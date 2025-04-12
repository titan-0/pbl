import { createContext, useContext, useState, ReactNode } from 'react';
// import { json } from 'react-router-dom';


interface CaptainData {
  id?: string;
  fullname: {
    firstname: string;
    lastname: string;
  };
  email: string;
  shopname: string;
  phoneNumber: string;
  shop: {
    shop_address: string;
    gstNumber: string;
    licenceNumber: number;
    location: {
      latitude: number | null;
      longitude: number | null;
    };
    medicines: string[];
    services: string[];
  };
}

interface CaptainContextType {
  captain: CaptainData | null;
  setCaptain: (captain: CaptainData | null) => void;
  logout: () => void;
}

const CaptainContext = createContext<CaptainContextType | undefined>(undefined);

export function CaptainProvider({ children }: { children: ReactNode }) {
  const [captain, setCaptain] = useState<CaptainData | null>(() => {
    const storedCaptain = localStorage.getItem('captain');
    console.log('stored captain data: ',JSON.parse(storedCaptain || 'null'));
    return storedCaptain ? JSON.parse(storedCaptain) : null;
  });

  const logout = () => {
    setCaptain(null);
    localStorage.removeItem('captain');
    localStorage.removeItem('token');
  };

  return (
    <CaptainContext.Provider value={{ captain, setCaptain, logout }}>
      {children}
    </CaptainContext.Provider>
  );
}

export function useCaptain() {
  const context = useContext(CaptainContext);
  if (!context) {
    throw new Error('useCaptain must be used within a CaptainProvider');
  }
  // console.log('captain data in captain : ', context.captain);
  return context;
}