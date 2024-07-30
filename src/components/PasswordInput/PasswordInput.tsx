"use client";

import { useRef, useState } from "react";
import { Eye, EyeSlash } from "@phosphor-icons/react";
import styles from "./PasswordInput.module.css";

type InputPasswordProps = React.InputHTMLAttributes<HTMLInputElement>;

export default function PasswordInput({
  id,
  name,
  ...restProps
}: InputPasswordProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  function handleTogglePassword() {
    setShowPassword(!showPassword);
  }

  return (
    <span
      className={`${styles.wrapper} ${
        (isFocused || isHovered) && styles.active
      }`}
      onClick={() => inputRef.current?.focus()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <input
        id={id}
        ref={inputRef}
        type={showPassword ? "text" : "password"}
        name={name}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...restProps}
        className={styles.password}
      ></input>

      <button
        type="button"
        className={styles.button}
        onClick={handleTogglePassword}
      >
        {showPassword ? <EyeSlash /> : <Eye />}
      </button>
    </span>
  );
}
