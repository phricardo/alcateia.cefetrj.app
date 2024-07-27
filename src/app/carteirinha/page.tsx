"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { UserContext } from "@/contexts/user-context";
import { useQRCode } from "next-qrcode";
import Image from "next/image";
import styles from "./page.module.css";

export default function StudentIdCardPage() {
  const router = useRouter();
  const { Canvas } = useQRCode();
  const { user, isLoading } = React.useContext(UserContext);

  React.useEffect(() => {
    if (!isLoading && !user) router.push("/");
  }, [isLoading, user, router]);

  if (!user && isLoading)
    return (
      <div className={`${styles.pageWrapper} container`}>
        <h1>Carregando</h1>
      </div>
    );

  if (user && !isLoading)
    return (
      <div className={`${styles.pageWrapper} container`}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <Image
              src={`/cefetrj.png`}
              alt={`Foto de ${user?.name}`}
              height={50}
              width={201}
            />

            <Image
              src={`https://ui-avatars.com/api/?size=120&background=dddddd&color=000000&name=${user?.name}`}
              alt={`Foto de ${user?.name}`}
              height={150}
              width={150}
            />
            <h1>{user.name}</h1>
            <p>{user.course}</p>
            <p>Período Atual: {user.currentPeriod}º período</p>
          </div>

          <ul className={styles.cardDetails}>
            <li>CPF: {user.document?.id}</li>
            <li>Periodo de Mtricula: {user.enrollmentPeriod}</li>
          </ul>

          <Canvas
            text={user.studentId}
            options={{
              errorCorrectionLevel: "M",
              margin: 0,
              scale: 4,
              width: 150,
              color: {
                dark: "#000000",
                light: "#FFFFFF",
              },
            }}
          />
        </div>
      </div>
    );
}
