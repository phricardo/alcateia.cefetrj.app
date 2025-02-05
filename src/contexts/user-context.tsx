"use client";

import React from "react";
import { USER_GET } from "@/functions/api";
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
  const [isLoading, setIsLoading] = React.useState(true);
  const [user, setUser] = React.useState<IAuthenticatedUser | null>(null);

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const { url, options } = USER_GET();
        const response = await fetch(url, options);
        const json = await response.json();
        setUser(json.user);
        console.log(json.user);
      } catch (err: unknown) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ isLoading, user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
