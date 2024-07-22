"use client";

import React, { ButtonHTMLAttributes } from "react";
import { CaretLeft } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";

interface BackLinkProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> {
  text?: string;
  redirectToHome?: boolean;
}

export function BackLink({
  text = "Voltar",
  redirectToHome = false,
  ...props
}: BackLinkProps) {
  const router = useRouter();

  const handleClick = () => {
    if (redirectToHome) {
      router.push("/");
    } else {
      router.back();
    }
  };

  return (
    <button
      {...props}
      onClick={handleClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.2rem",
        justifyContent: "center",
      }}
    >
      <CaretLeft size={20} /> {text}
    </button>
  );
}
