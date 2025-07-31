"use client";

import React from "react";
import styles from "./Button.module.css";

type ButtonProps = {
  isLoading: boolean;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ isLoading, children, ...props }: ButtonProps) {
  const buttonClassName = isLoading ? styles.loading : "";

  return (
    <button
      {...props}
      disabled={isLoading || props.disabled}
      className={buttonClassName}
    >
      {isLoading ? (
        <div className={styles.loadingContent}>
          <span>Carregando</span>
          <span className={styles.dots}></span>
        </div>
      ) : (
        children
      )}
    </button>
  );
}
