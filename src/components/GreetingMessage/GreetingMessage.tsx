"use client";

import React from "react";
import { SkeletonLoading } from "../SkeletonLoading/SkeletonLoading";
import { UserContext } from "@/contexts/user-context";
import { IAuthenticatedUser } from "@/@types/authUser.type";

function getDisplayName(user: IAuthenticatedUser | null): string {
  if (user?.name) {
    const names = user.name.split(" ");
    if (names.length > 0) {
      const firstName = names[0];
      const lastName = names[names.length - 1];
      return `${firstName} ${lastName}`;
    }
  }
  return "aluno(a)";
}

export default function GreetingMessage() {
  const { user, isLoading } = React.useContext(UserContext);
  const [greeting, setGreeting] = React.useState<string | null>(null);

  React.useEffect(() => {
    const currentHour = new Date().getHours();
    if (currentHour >= 5 && currentHour < 12) {
      setGreeting("Bom dia");
    } else if (currentHour >= 12 && currentHour < 18) {
      setGreeting("Boa tarde");
    } else {
      setGreeting("Boa noite");
    }
  }, []);

  return (
    <h1 style={{ textAlign: "center" }}>
      {greeting && !isLoading ? (
        `${greeting}, ${getDisplayName(user)} 👋!`
      ) : (
        <SkeletonLoading width="20rem" height="2rem" />
      )}
    </h1>
  );
}
