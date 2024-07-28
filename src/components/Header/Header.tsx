"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BackLink } from "../BackLink/BackLink";
import { UserContext } from "@/contexts/user-context";
import LogoutButton from "../Button/LogoutButton";
import { SkeletonLoading } from "../SkeletonLoading/SkeletonLoading";
import { SignIn } from "@phosphor-icons/react";
import Image from "next/image";
import styles from "./Header.module.css";

export function Header() {
  const pathname = usePathname();
  const { user, isLoading } = React.useContext(UserContext);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <Link href="/">
            <Image
              src="/images/logo.png"
              height={45}
              width={237}
              alt="Integra.Cefet/RJ"
            />
          </Link>
        </div>

        {pathname != "/" && (
          <div>
            <BackLink
              text="Voltar"
              className={styles.btnBack}
              redirectToHome={true}
            />
          </div>
        )}

        {isLoading && pathname === "/" && (
          <SkeletonLoading width="4rem" height="2rem" />
        )}

        {!isLoading && !user && pathname === "/" && (
          <Link href="/auth/login">
            <SignIn /> Entrar
          </Link>
        )}

        {!isLoading && user && pathname === "/" && <LogoutButton />}
      </div>
    </header>
  );
}
