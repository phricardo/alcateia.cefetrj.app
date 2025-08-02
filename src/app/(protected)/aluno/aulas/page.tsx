"use client";

import React from "react";
import { UserContext } from "@/contexts/user-context";
import { SkeletonLoading } from "@/components/SkeletonLoading/SkeletonLoading";
import styles from "./page.module.css";

export default function StudentSchedulePage() {
  const { user, isLoading } = React.useContext(UserContext);

  if (!user && isLoading)
    return (
      <div className={`${styles.pageWrapper} container`}>
        <SkeletonLoading width="100%" height="60vh" />
      </div>
    );

  if (user && !isLoading)
    return (
      <div className={`${styles.pageWrapper} container`}>
        <h1 className={styles.title}>Minhas Aulas</h1>
        <div className={styles.scheduleList}>
          {user.currentDisciplines && user.currentDisciplines.length > 0 ? (
            user.currentDisciplines.map((discipline, index) => (
              <div key={index} className={styles.scheduleItem}>
                <p>{discipline}</p>
              </div>
            ))
          ) : (
            <p>
              Você ainda não possui disciplinas cadastradas. Aguarde a abertura
              do período de matrícula para que suas aulas apareçam aqui.
            </p>
          )}
        </div>
      </div>
    );

  return null;
}
