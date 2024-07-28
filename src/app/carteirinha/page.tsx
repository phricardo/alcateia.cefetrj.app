"use client";

import React from "react";
import Image from "next/image";
import { useQRCode } from "next-qrcode";
import { UserContext } from "@/contexts/user-context";
import { SkeletonLoading } from "@/components/SkeletonLoading/SkeletonLoading";
import styles from "./page.module.css";
import { STUDENT_CARD_VALIDATE_GET } from "@/functions/api";
import { IEnrollmentValidationData } from "@/@types/authUser.type";

export default function StudentIdCardPage() {
  const { Canvas } = useQRCode();
  const currentYear: number = new Date().getFullYear();
  const { user, isLoading } = React.useContext(UserContext);
  const [data, setData] = React.useState<IEnrollmentValidationData | null>(
    null
  );

  React.useEffect(() => {
    const domLoaded = typeof window !== "undefined";
    if (!isLoading && domLoaded && !user) window.location.href = "/";
  }, [isLoading, user]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        if (user && user.studentId) {
          const { url, options } = STUDENT_CARD_VALIDATE_GET(user.studentId);
          const response = await fetch(url, options);
          const json = (await response.json()) as IEnrollmentValidationData;
          setData(json);
        }
      } catch (err: unknown) {
        setData(null);
      }
    };
    fetchData();
  }, [user]);

  if ((!user && isLoading) || !data)
    return (
      <div className={`${styles.pageWrapper} container`}>
        <SkeletonLoading width="40rem" height="60vh" />
      </div>
    );

  if (user && !isLoading && data)
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
                src={`/images/cefetrj.png`}
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
              <strong>Validate:</strong> 31/12/{currentYear}
            </li>
          </ul>

          <div>
            <Canvas
              text={`${data.student.url}`}
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
            <br />
            <p>Autenticação: {data.student.code}</p>
          </div>
        </div>
      </div>
    );
}
