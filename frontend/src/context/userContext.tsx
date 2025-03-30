import { createContext, useContext, useState, ReactNode } from 'react';

interface UserData {
  _id: string;
  fullname: {
    firstname: string;
    lastname: string;
  };
  email: string;
  password: string;
}

interface UserContextType {
  user: UserData | null;
  setUser: (user: UserData | null) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(() => {
    const storedUser = localStorage.getItem('user');
    console.log('Stored user data:', JSON.parse(storedUser || 'null'));
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  // console.log('User data in context:', context.user);
  return context;
}