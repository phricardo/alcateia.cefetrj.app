"use client";

import React from "react";
import styles from "./Footer.module.css";
import Link from "next/link";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div>
        <h1>Integra.Cefet/RJ</h1>
        <p>Integração extraoficial e código aberto com o Cefet/RJ</p>
      </div>
      <Link
        href="https://github.com/phricardorj/integra.cefetrj"
        target="_blank"
      >
        Github / Repositório
      </Link>
    </footer>
  );
}
