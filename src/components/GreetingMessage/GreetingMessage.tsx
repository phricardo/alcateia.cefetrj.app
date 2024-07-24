"use client";

import React from "react";
import { SkeletonLoading } from "../SkeletonLoading/SkeletonLoading";

export default function GreetingMessage() {
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
    <h1>
      {greeting ? (
        `${greeting}, aluno(a)👋!`
      ) : (
        <SkeletonLoading width="20rem" height="2rem" />
      )}
    </h1>
  );
}
