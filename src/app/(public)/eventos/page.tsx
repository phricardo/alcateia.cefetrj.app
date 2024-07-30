"use client";

import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { EventsResponse } from "@/@types/eventsResponse.type";
import { campusDisplayNames } from "@/utils/constants.util";
import { formatDate } from "@/utils/formatarData.util";
import { FunnelSimple, MagnifyingGlass } from "@phosphor-icons/react";
import CopyButton from "@/components/CopyButton/CopyButton";
import { SkeletonLoading } from "@/components/SkeletonLoading/SkeletonLoading";
import styles from "./page.module.css";
import Image from "next/image";

type ErrorPayload = {
  message: string;
  isSearchError: boolean;
};

export default function EventsPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<ErrorPayload | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [data, setData] = useState<EventsResponse | null>(null);

  const searchQueryRef = useRef<string>("");
  const selectedCampusRef = useRef<string | null>(null);

  const buildURL = (): string => {
    let url = `/api/v1/events?page=${currentPage}`;
    if (selectedCampusRef.current)
      url += `&campus=${selectedCampusRef.current}`;
    if (searchQueryRef.current) url += `&q=${searchQueryRef.current}`;
    return url;
  };

  const handleFetchResponse = async (
    response: Response
  ): Promise<EventsResponse> => {
    if (!response.ok) {
      const errorPayload = {
        message:
          response.status === 404
            ? "Não encontramos nada para sua pesquisa."
            : "Serviços temporariamente desligados.",
        isSearchError: response.status === 404,
      };
      throw new Error(JSON.stringify(errorPayload));
    }
    return (await response.json()) as EventsResponse;
  };

  const handleError = (error: unknown) => {
    if (error instanceof Error) {
      const err = JSON.parse(error.message) as ErrorPayload;
      setError(err);
    } else {
      console.error("Error: There was a generic error on the client side");
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const url = buildURL();
      const response = await fetch(url, { next: { revalidate: 3600 } });
      const data = await handleFetchResponse(response);
      setData(data);
    } catch (error: unknown) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const syncRSSFeed = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/v1/events/rss/sync");
        if (!response.ok) throw new Error("Network response was not ok");
        console.log("Ok! Synced with RSS feed");
      } catch (error: unknown) {
        console.error("Failed to sync RSS feed:", error);
      } finally {
        fetchData();
      }
    };
    syncRSSFeed();
  }, []);

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  useEffect(() => {
    if (error && !error.isSearchError) setData(null);
  }, [error]);

  const handleCampusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setError(null);
    selectedCampusRef.current = event.target.value;
    fetchData();
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    searchQueryRef.current = event.target.value;
    fetchData();
  };

  if (loading && !data) {
    return (
      <div className="container">
        <div className={styles.skeletonWrapper}>
          <SkeletonLoading height="50px" width="100%" marginBottom="0.5rem" />
          {Array.from({ length: 5 }).map((_, index) => (
            <SkeletonLoading key={index} height="150px" width="100%" />
          ))}
        </div>
      </div>
    );
  }

  if (!data) return <p>Nenhum dado encontrado.</p>;

  return (
    <div className={`container ${styles.feed}`}>
      <div className={styles.options}>
        <div className={styles.option}>
          <label htmlFor="search">
            <MagnifyingGlass color="#000000" size={22} /> Pesquisar:
          </label>
          <input
            type="text"
            id="search"
            defaultValue={searchQueryRef.current}
            onChange={handleSearchChange}
            placeholder="Digite sua pesquisa..."
          />
          <p>{error && error.isSearchError && error.message}</p>
        </div>

        <div className={styles.option}>
          <label htmlFor="selectCampus">
            <FunnelSimple color="#000000" size={22} /> Filtrar por Unidade:
          </label>
          <select
            id="selectCampus"
            defaultValue={selectedCampusRef.current || ""}
            onChange={handleCampusChange}
          >
            <option value="">Todas as Unidades</option>
            {Object.keys(campusDisplayNames).map((campus) => (
              <option key={campus} value={campus}>
                {campusDisplayNames[campus]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.eventsWrapper}>
        {data.events.map((item) => (
          <div key={item.guid} className={styles.eventsItem}>
            {item.thumbnail && (
              <div>
                <Image
                  width={200}
                  height={200}
                  src={item.thumbnail}
                  alt={item.title}
                />
              </div>
            )}

            <div>
              <div className={styles.eventsItemHeader}>
                <div className={styles.eventsItemDetails}>
                  <span>{formatDate(item.pubDate)}</span>
                  {item.isAllCampusEvent ? (
                    <span>Geral</span>
                  ) : (
                    <span>Uned {campusDisplayNames[item.campus]}</span>
                  )}
                </div>
                <div>
                  <CopyButton
                    className={styles.copyLink}
                    valueToCopy={item.guid}
                    buttonText="Copiar Link"
                  />
                </div>
              </div>

              <Link href={item.guid} target="_blank">
                <h1>{item.title}</h1>
              </Link>
              <p>{item.description}</p>
              <Link href={item.guid} target="_blank">
                Ler Mais
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.pagination}>
        <p>
          Página {data.pagination.page} de {data.pagination.totalPages}
        </p>

        <div className={styles.pageNav}>
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Anterior
          </button>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === data.pagination.totalPages}
          >
            Próximo
          </button>
        </div>
      </div>
    </div>
  );
}
