"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { useQRCode } from "next-qrcode";
import { UserContext } from "@/contexts/user-context";
import { SkeletonLoading } from "@/components/SkeletonLoading/SkeletonLoading";
import styles from "./page.module.css";
import html2pdf from "html2pdf.js";
import { DownloadSimple } from "@phosphor-icons/react";
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
  const currentYear = new Date().getFullYear();
  const { user, isLoading } = React.useContext(UserContext);
  const cardRef = useRef<HTMLDivElement>(null);

  const studentId = user?.studentId;
  const authCode = user?.studentCard?.authCode ?? "";
  const consultationURL = user?.studentCard?.consultationURL ?? "";

  const handleDownloadPDF = () => {
    if (!cardRef.current) return;
    const element = cardRef.current;

    html2pdf()
      .set({
        margin: 0,
        filename: "carteirinha.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 4 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .from(element)
      .save();
  };

  if ((!user && isLoading) || !consultationURL || !authCode) {
    return (
      <div className={styles.pageWrapper}>
        <SkeletonLoading width="100%" height="60vh" />
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <button onClick={handleDownloadPDF} className={styles.printButton}>
        <DownloadSimple size={20} weight="bold" style={{ marginRight: 8 }} />{" "}
        Baixar PDF
      </button>

      <div className={styles.card} ref={cardRef}>
        <div className={styles.cardHeader}>
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
          <div className={styles.qrCodeSection}>
            <Canvas
              text={consultationURL}
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
          </div>
          <p className={styles.authCode}>
            Autenticação:
            <br /> {authCode}
          </p>
        </div>
      </div>
    </div>
  );
}
