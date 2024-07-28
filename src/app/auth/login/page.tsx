"use client";

import React from "react";
import Link from "next/link";
import { useFormState } from "react-dom";
import LoginAction from "../../../actions/login.action";
import SubmitButton from "@/components/Button/SubmitButton";
import { UserContext } from "@/contexts/user-context";
import styles from "./LoginPage.module.css";

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
      <h1>Login</h1>
      <p>
        Entre com seu usuário e senha do {" "}
        <Link href="https://alunos.cefet-rj.br" target="_blank">
          Portal do Aluno
        </Link>
      </p>
      <form action={action}>
        <label>
          Usuário:
          <input type="text" name="username" placeholder="Usuário" />
        </label>

        <label>
          Senha:
          <input type="password" name="password" placeholder="Senha" />
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

      {state.error && <p>{state.error}</p>}
    </div>
  );
}
