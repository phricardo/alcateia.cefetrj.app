"use client";

import React, { ButtonHTMLAttributes } from "react";
import { SignIn } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";

interface SignInLinkProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> {
  text?: string;
}

export function SignInLink({ text = "Entrar", ...props }: SignInLinkProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push("/auth/login");
  };

  return (
    <button {...props} onClick={handleClick}>
      <SignIn size={20} /> {text}
    </button>
  );
}
