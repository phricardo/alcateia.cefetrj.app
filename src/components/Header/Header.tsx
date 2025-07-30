"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { UserContext } from "@/contexts/user-context";
import { IAuthenticatedUser } from "@/@types/authUser.type";
import { SkeletonLoading } from "../SkeletonLoading/SkeletonLoading";
import styles from "./Header.module.css";
import Image from "next/image";
import Link from "next/link";
import { BackLink } from "../BackLink/BackLink";
import { SignInLink } from "../SignInLink/SignInLink";

export function Header() {
  const pathname = usePathname();
  const { user, isLoading } = React.useContext(UserContext);
  const [greeting, setGreeting] = React.useState<string | null>(null);

  function getDisplayName(user: IAuthenticatedUser | null): string {
    if (user?.name) {
      const names = user.name.split(" ");
      if (names.length > 0) {
        const firstName = names[0];
        const lastName = names[names.length - 1];
        return `${firstName} ${lastName}`;
      }
    }
    return "aluno(a)";
  }

  React.useEffect(() => {
    const currentHour = new Date().getHours();
    if (currentHour >= 5 && currentHour < 12) {
      setGreeting("Bom dia");
    } else if (currentHour >= 12 && currentHour < 18) {
      setGreeting("Boa tarde");
    } else {
      setGreeting("Boa noite");
    }
  }, []);

  return (
    <header className={styles.header}>
      <div className="container">
        <div className={styles.menu}>
          <div>
            <Link href="/">
              <Image
                src="/images/logo.png"
                height={35}
                width={184}
                alt="Integra.Cefet/RJ"
              />
            </Link>
          </div>

          <div>
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

            {!isLoading && !user && pathname === "/" && <SignInLink />}

            {!isLoading && user && pathname === "/" && <button>dkkd</button>}
          </div>
        </div>
        <div className={styles.hero}>
          <h1>
            {greeting && !isLoading ? (
              `${greeting}, ${getDisplayName(user)} 👋!`
            ) : (
              <SkeletonLoading width="20rem" height="2rem" />
            )}
          </h1>
          <p>
            {!isLoading && user
              ? `Você está matriculado no campus ${
                  user.campus
                    ?.replaceAll("_", " ")
                    .toLowerCase()
                    .replace(/\b\w/g, (l) => l.toUpperCase()) ?? "desconhecido"
                }.`
              : "Faça login para obter mais recursos!"}
          </p>
        </div>
      </div>
    </header>
  );
}
