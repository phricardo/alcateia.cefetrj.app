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

async function fetchUser(): Promise<IAuthenticatedUser | null> {
  try {
    const { url, options } = USER_GET();
    const response = await fetch(url, options);
    const json = await response.json();
    return json?.user ?? null;
  } catch {
    return null;
  }
}

let setUserStateGlobal: React.Dispatch<
  React.SetStateAction<IAuthenticatedUser | null>
>;
let setIsLoadingGlobal: React.Dispatch<React.SetStateAction<boolean>>;

export async function loadUser() {
  if (setIsLoadingGlobal && setUserStateGlobal) {
    setIsLoadingGlobal(true);
    const user = await fetchUser();
    setUserStateGlobal(user);
    setIsLoadingGlobal(false);
  }
}

export function UserContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [user, setUserState] = React.useState<IAuthenticatedUser | null>(null);

  setUserStateGlobal = setUserState;
  setIsLoadingGlobal = setIsLoading;

  const setUser = (user: IAuthenticatedUser | null) => {
    setUserState(user);
  };

  React.useEffect(() => {
    loadUser();
  }, []);

  return (
    <UserContext.Provider value={{ isLoading, user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
