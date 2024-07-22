"use client";

import React from "react";
import Link from "next/link";
import { Warning } from "@phosphor-icons/react";
import styles from "./PinnedHomeMessage.module.css";

export function PinnedHomeMessage() {
  return (
    <div className={styles.message}>
      <h1>
        <Warning color="#000000" size={22} /> Novo calendário acadêmico
      </h1>
      <p>Publicado: Quinta, 11 de Julho de 2024</p>
      <p>
        A Diretoria de Ensino (DIREN) do Cefet /RJ divulgou, nesta quarta-feira
        (10), as datas previstas para o retorno às atividades acadêmicas após o
        fim da greve dos docentes. As novas datas foram aprovadas pelo Conselho
        de Ensino (CONEN) em sua 2ª sessão extraordinária. <br />
        <br />
        <Link
          href="https://www.cefet-rj.br/attachments/article/8576/AtoN%C2%BA6_CONEN_24_com%20anexo.pdf"
          target="_blank"
        >
          Clique para conferir a estrutura de calendário de reposição de 2024
          aprovada pelo conselho.
        </Link>
      </p>
    </div>
  );
}
