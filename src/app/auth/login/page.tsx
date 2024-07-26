"use client";

import React from "react";
import Link from "next/link";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";
import LoginAction from "../../../actions/login.action";
import SubmitButton from "@/components/Button/SubmitButton";
import { UserContext } from "@/contexts/user-context";
import styles from "./LoginPage.module.css";

export default function LoginPage() {
  const router = useRouter();
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
    if (user) router.push("/");
  }, [user, router]);

  return (
    <div className={`container ${styles.pageWrapper}`}>
      <p>{state.data ? JSON.stringify(state.data) : ""}</p>

      <h1>Login</h1>
      <p>
        Entre om seu usuário e senha do{" "}
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
    </div>
  );
}
