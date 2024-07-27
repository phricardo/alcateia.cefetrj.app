"use client";

import React from "react";
import { IAuthenticatedUser } from "@/@types/authUser.type";

export type IUserContext = {
  user: IAuthenticatedUser | null;
  isLoading: boolean;
  setUser: (user: IAuthenticatedUser | null) => void;
};

const initialUserContextValue: IUserContext = {
  user: null,
  isLoading: false,
  setUser: () => {},
};

export const UserContext = React.createContext<IUserContext>(
  initialUserContextValue
);

export function UserContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [user, setUser] = React.useState<IAuthenticatedUser | null>(null);

  React.useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  React.useEffect(() => {
    setIsLoading(true);
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const authUser = JSON.parse(storedUser) as IAuthenticatedUser;
      setUser(authUser);
    }
    setIsLoading(false);
  }, []);

  return (
    <UserContext.Provider value={{ isLoading, user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
