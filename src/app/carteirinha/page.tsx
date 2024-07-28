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
  const currentYear: number = new Date().getFullYear();
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
              src={`https://ui-avatars.com/api/?size=120&background=dddddd&color=000000&name=${user?.name}`}
              alt={`Foto de ${user?.name}`}
              height={150}
              width={150}
            />
            <div>
              <Image
                src={`/cefetrj.png`}
                alt={`Foto de ${user?.name}`}
                height={50}
                width={201}
              />
              <h1>{user.name}</h1>
              <p>{user.course}</p>
            </div>
          </div>

          <ul className={styles.cardDetails}>
            <li>
              <strong>CPF:</strong> {user.document?.id}
            </li>
            <li>
              <strong>Matrícula:</strong> {user.enrollment}
            </li>
            <li>
              <strong>Ingressou:</strong> {user.enrollmentPeriod}
            </li>
            <li>
              <strong>Validate:</strong> 31/12/{currentYear}
            </li>
          </ul>

          <Canvas
            text={user.studentId}
            options={{
              errorCorrectionLevel: "M",
              margin: 0,
              scale: 4,
              width: 250,
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
