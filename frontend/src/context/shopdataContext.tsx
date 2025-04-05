import React, { createContext, useState, useContext, ReactNode } from 'react';

interface ShopInfo {
  shopName: string | null;
  shopAddress: string | null;
  latitude: number | null;
  longitude: number | null;
}

interface ShopContextType {
  selectedShop: ShopInfo;
  setSelectedShop: (shop: ShopInfo) => void;
}

const ShopContext = createContext<ShopContextType>({
  selectedShop: { shopName: null, shopAddress: null, latitude: null, longitude: null },
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
  });

  return (
    <ShopContext.Provider value={{ selectedShop, setSelectedShop }}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  return useContext(ShopContext);
};