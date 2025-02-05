"use client";

import React from "react";
import Link from "next/link";
import {
  Calendar,
  CalendarStar,
  Student,
  ArrowSquareOut,
  Newspaper,
  IdentificationCard,
  ChalkboardSimple,
} from "@phosphor-icons/react";
import { UserContext } from "@/contexts/user-context";
import GreetingMessage from "@/components/GreetingMessage/GreetingMessage";
import styles from "./page.module.css";

export default function IndexPage() {
  const { user, isLoading } = React.useContext(UserContext);

  return (
    <div className={`container ${styles.wrapper}`}>
      <GreetingMessage />
      <br /> <br />
      <div className={styles.links}>
        <ul>
          <li className={styles.linkWrapper}>
            <Link href="/noticias">
              <div>
                <Newspaper />
              </div>
              <span>Notícias</span>
            </Link>
          </li>
          <li className={styles.linkWrapper}>
            <Link href="/calendarios">
              <div>
                <Calendar />
              </div>
              <span>Calendário Acadêmico</span>
            </Link>
          </li>
          <li className={styles.linkWrapper}>
            <Link href="/eventos">
              <div>
                <CalendarStar />
              </div>
              <span>Eventos</span>
            </Link>
          </li>

          {!isLoading && user && (
            <li className={styles.linkWrapper}>
              <Link href="/aluno/carteirinha">
                <div>
                  <IdentificationCard />
                </div>
                <span>Minha Carteirinha</span>
              </Link>
            </li>
          )}

          {!isLoading && user && (
            <li className={styles.linkWrapper}>
              <Link href="/aluno/aulas">
                <div>
                  <ChalkboardSimple />
                </div>
                <span>Minhas Aulas</span>
              </Link>
            </li>
          )}

          <li className={styles.linkWrapper}>
            <Link
              href="https://alunos.cefet-rj.br/aluno/login.action"
              target="_blank"
            >
              <div>
                <ChalkboardSimple />
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
