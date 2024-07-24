"use client";

import React from "react";
import styles from "./Header.module.css";
import { usePathname } from "next/navigation";
import { BackLink } from "../BackLink/BackLink";
import Link from "next/link";

export function Header() {
  const pathname = usePathname();

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
      </div>
    </header>
  );
}
