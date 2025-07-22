"use client";

import React from "react";
import Image from "next/image";
import { useQRCode } from "next-qrcode";
import { UserContext } from "@/contexts/user-context";
import { SkeletonLoading } from "@/components/SkeletonLoading/SkeletonLoading";
import { STUDENT_CARD_VALIDATE_GET } from "@/functions/api";
import { IEnrollmentValidationData } from "@/@types/authUser.type";
import styles from "./page.module.css";

function getCampusName(enumValue?: string | null): string {
  if (!enumValue) return "Campus desconhecido";

  const map: Record<string, string> = {
    MARACANA: "Maracanã",
    NOVA_FRIBURGO: "Nova Friburgo",
    PETROPOLIS: "Petrópolis",
    ITAGUAI: "Itaguaí",
    ANGRA_DOS_REIS: "Angra dos Reis",
    NOVA_IGUACU: "Nova Iguaçu",
    VALENCA: "Valença",
    CANTAGALO: "Cantagalo",
  };

  return (
    map[enumValue] ??
    enumValue
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

export default function StudentIdCardPage() {
  const { Canvas } = useQRCode();
  const currentYear: number = new Date().getFullYear();
  const { user, isLoading } = React.useContext(UserContext);
  const [data, setData] = React.useState<IEnrollmentValidationData | null>(
    null
  );

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        if (user?.studentId) {
          const { url, options } = STUDENT_CARD_VALIDATE_GET(user.studentId);
          const response = await fetch(url, options);
          const json = (await response.json()) as IEnrollmentValidationData;
          setData(json);
        }
      } catch (err) {
        setData(null);
      }
    };
    fetchData();
  }, [user]);

  const studentId = user?.enrollment?.slice(0, 6);

  if ((!user && isLoading) || !data) {
    return (
      <div className={`${styles.pageWrapper} container`}>
        <SkeletonLoading width="100%" height="60vh" />
      </div>
    );
  }

  return (
    <div className={`${styles.pageWrapper} container`}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <Image
            src={`https://ui-avatars.com/api/?size=120&background=dddddd&color=000000&name=${
              user?.name ?? "Estudante"
            }`}
            alt={`Foto de ${user?.name ?? "Estudante"}`}
            height={100}
            width={100}
            className={styles.avatar}
          />
          <div className={styles.cardHeaderText}>
            <Image
              src={`/images/cefetrj.png`}
              alt="Logotipo CEFET/RJ"
              height={40}
              width={180}
              className={styles.logo}
            />
            <h1>{user?.name ?? "Nome não disponível"}</h1>
            <p>{user?.course ?? "Curso não disponível"}</p>
          </div>
        </div>

        <ul className={styles.cardDetails}>
          <li>
            <strong>ID:</strong> {studentId ?? "N/A"}
          </li>
          <li>
            <strong>CPF:</strong> {user?.document?.id ?? "N/A"}
          </li>
          <li>
            <strong>Matrícula:</strong> {user?.enrollment ?? "N/A"}
          </li>
          <li>
            <strong>Campus:</strong> {getCampusName(user?.campus)}
          </li>
          <li>
            <strong>Validade:</strong> 31/12/{currentYear}
          </li>
        </ul>

        <div className={styles.qrCodeWrapper}>
          <Canvas
            text={data.student.url}
            options={{
              errorCorrectionLevel: "M",
              margin: 0,
              scale: 4,
              width: 180,
              color: {
                dark: "#000000",
                light: "#FFFFFF",
              },
            }}
          />
          <p className={styles.authCode}>Autenticação: {data.student.code}</p>
        </div>
      </div>
    </div>
  );
}
