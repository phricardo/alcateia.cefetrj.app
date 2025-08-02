"use client";

import React from "react";
import Image from "next/image";
import styles from "./page.module.css";

export default function SobrePage() {
  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.title}>Sobre</h1>

      <p className={styles.paragraph}>
        Este aplicativo foi desenvolvida por alunos de forma independente e com
        código aberto. Nosso objetivo é facilitar o acesso às informações
        acadêmicas de maneira mais moderna e acessível.
      </p>

      <p className={styles.paragraph}>
        <span className={styles.warning}>Atenção:</span> dependemos totalmente
        da estabilidade e disponibilidade do sistema oficial do CEFET/RJ (
        <a
          href="https://alunos.cefet-rj.br"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          alunos.cefet-rj.br
        </a>
        ) para funcionar corretamente. Se o sistema oficial estiver fora do ar,
        alguns recursos podem não estar disponíveis aqui também.
      </p>

      <p className={styles.version}>
        Versão: <strong>1.0.2</strong>
      </p>

      <div className={styles.authorContainer}>
        <Image
          src="https://github.com/phricardo.png"
          alt="Desenvolvedor"
          width={64}
          height={64}
          className={styles.avatar}
        />
        <div className={styles.authorInfo}>
          <p style={{ margin: 0 }}>Desenvolvido por Pedro Ricardo</p>
          <a
            href="https://github.com/phricardo"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            github.com/phricardo
          </a>
        </div>
      </div>
    </div>
  );
}
