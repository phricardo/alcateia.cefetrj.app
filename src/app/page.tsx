"use client";

import React from "react";
import Link from "next/link";
import {
  Calendar,
  CalendarStar,
  Student,
  ArrowSquareOut,
  Newspaper,
} from "@phosphor-icons/react";
import styles from "./page.module.css";

export default function IndexPage() {
  return (
    <div className={`container ${styles.pageWrapper}`}>
      <div className={styles.links}>
        <ul>
          <li className={styles.linkWrapper}>
            <Link href="/noticias">
              <div>
                <Newspaper />
              </div>
              Noticias
            </Link>
          </li>
          <li className={styles.linkWrapper}>
            <Link href="/calendarios">
              <div>
                <Calendar />
              </div>
              Calendario Acadêmico
            </Link>
          </li>
          <li className={styles.linkWrapper}>
            <Link href="/eventos">
              <div>
                <CalendarStar />
              </div>
              Eventos
            </Link>
          </li>
          <li className={styles.linkWrapper}>
            <Link
              href="https://alunos.cefet-rj.br/aluno/login.action"
              target="_blank"
            >
              <div>
                <Student />
              </div>
              <span>
                Portal do Aluno <ArrowSquareOut color="#000000" size={18} />
              </span>
            </Link>
          </li>
          <li className={styles.linkWrapper}>
            <Link href="https://registro.cefet-rj.br/" target="_blank">
              <div>
                <Student />
              </div>
              <span>
                Registro Cefet/RJ <ArrowSquareOut size={18} />
              </span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
