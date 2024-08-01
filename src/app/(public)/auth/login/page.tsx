"use client";

import React from "react";
import Link from "next/link";
import { useFormState } from "react-dom";
import SubmitButton from "@/components/Button/SubmitButton";
import { UserContext } from "@/contexts/user-context";
import { Lock } from "@phosphor-icons/react";
import styles from "./LoginPage.module.css";
import PasswordInput from "@/components/PasswordInput/PasswordInput";
import LoginAction from "@/actions/login.action";

export default function LoginPage() {
  const { setUser, user } = React.useContext(UserContext);
  const [state, action] = useFormState(LoginAction, {
    ok: false,
    error: null,
    data: null,
  });

  React.useEffect(() => {
    if (state.ok) setUser(state.data);
  }, [state, setUser]);

  React.useEffect(() => {
    const domLoaded = typeof window !== "undefined";
    if (user && domLoaded) window.location.href = "/";
  }, [user]);

  return (
    <div className={`container ${styles.pageWrapper}`}>
      <div className={styles.loginWrapper}>
        <h1>Acesso</h1>
        <p>
          Entre com seu usuário e senha do{" "}
          <Link href="https://alunos.cefet-rj.br" target="_blank">
            Portal do Aluno
          </Link>
        </p>

        <form action={action}>
          <label htmlFor="username">
            Usuário:
            <input
              type="text"
              name="username"
              id="username"
              required
            />
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

      <div className={styles.safe}>
        <p>
          <Lock /> Área segura conectada com o Portal do Aluno
        </p>
      </div>

      {state.error && <p>{state.error}</p>}
    </div>
  );
}
