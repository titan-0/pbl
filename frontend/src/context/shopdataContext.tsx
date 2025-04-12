import React, { createContext, useState, useContext, ReactNode } from 'react';

interface ShopInfo {
  shopName: string | null;
  shopAddress: string | null;
  email: string | null;
  phone: string | null;
  latitude: number | null;
  longitude: number | null;
  medicine_name: string | null;
}

interface ShopContextType {
  selectedShop: ShopInfo;
  setSelectedShop: (shop: ShopInfo) => void;
}

const ShopContext = createContext<ShopContextType>({
  selectedShop: { shopName: null, shopAddress: null, latitude: null, longitude: null, medicine_name: null, email: null, phone: null },
  setSelectedShop: () => {},
});

interface ShopProviderProps {
  children: ReactNode;
}

export const ShopProvider: React.FC<ShopProviderProps> = ({ children }) => {
  const [selectedShop, setSelectedShop] = useState<ShopInfo>({
    shopName: null,
    shopAddress: null,
    latitude: null,
    longitude: null,
    medicine_name: null,
    email: null,
    phone: null,
  }); // Fixed missing closing brace

  return (
    <ShopContext.Provider value={{ selectedShop, setSelectedShop }}>
      {children}
    </ShopContext.Provider>
  ); // Fixed missing closing parenthesis
}; // Fixed missing closing brace for the function

export const useShop = () => {
  return useContext(ShopContext);
};