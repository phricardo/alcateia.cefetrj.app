"use client";

import React from "react";
import Link from "next/link";
import { useFormState } from "react-dom";
import SubmitButton from "@/components/Button/SubmitButton";
import styles from "./LoginPage.module.css";
import PasswordInput from "@/components/PasswordInput/PasswordInput";
import LoginAction from "@/actions/login.action";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [state, action] = useFormState(LoginAction, {
    ok: false,
    error: null,
    data: null,
  });

  React.useEffect(() => {
    const domLoaded = typeof window !== "undefined";
    if (state && state.ok && domLoaded) window.location.href = "/";
  }, [state]);

  React.useEffect(() => {
    if (state && state.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.header}>
        <h1>Acesso</h1>
        <p>
          Entre com seu usuário e senha do{" "}
          <Link href="https://alunos.cefet-rj.br" target="_blank">
            Portal do Aluno
          </Link>
        </p>
      </div>

      <form action={action}>
        <label htmlFor="username">
          Usuário:
          <input type="text" name="username" id="username" required />
        </label>

        <label htmlFor="password">
          Senha:
          <PasswordInput name="password" id="password" required />
        </label>

        <p>
          Esqueceu a senha?{" "}
          <Link
            href="https://alunos.cefet-rj.br/usuario/publico/usuario/recuperacaosenha.action"
            target="_blank"
          >
            Recuperar agora.
          </Link>
        </p>

        <SubmitButton>Entrar</SubmitButton>
      </form>
    </div>
  );
}
