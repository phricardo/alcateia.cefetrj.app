"use client";

import React from "react";
import { useFormStatus } from "react-dom";
import Button from "./Button";

interface SubmitButtonProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  children: React.ReactNode;
}

export default function SubmitButton({
  children,
  ...props
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button {...props} isLoading={pending}>
      {pending ? "Carregando..." : children}
    </Button>
  );
}
