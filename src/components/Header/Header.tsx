"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BackLink } from "../BackLink/BackLink";
import { UserContext } from "@/contexts/user-context";
import styles from "./Header.module.css";
import LogoutButton from "../Button/LogoutButton";

export function Header() {
  const pathname = usePathname();
  const { user } = React.useContext(UserContext);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div>
          <Link href="/">
            <h1 className={styles.logo}>Integra.Cefet/RJ</h1>
          </Link>
        </div>

        {pathname != "/" && (
          <div>
            <BackLink
              text="Voltar"
              className={styles.btnBack}
              redirectToHome={true}
            />
          </div>
        )}

        {!user ? <Link href="/auth/login">Entrar</Link> : <LogoutButton />}
      </div>
    </header>
  );
}
