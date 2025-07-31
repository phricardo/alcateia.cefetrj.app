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
  const [user, setUserState] = React.useState<IAuthenticatedUser | null>(null);

  const setUser = (user: IAuthenticatedUser | null) => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
    setUserState(user);
  };

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);

        const savedUser = localStorage.getItem("user");
        if (savedUser) {
          setUserState(JSON.parse(savedUser));
          setIsLoading(false);
          return;
        }

        const { url, options } = USER_GET();
        const response = await fetch(url, options);
        const json = await response.json();

        if (json.user) {
          setUser(json.user);
        } else {
          setUser(null);
        }
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
