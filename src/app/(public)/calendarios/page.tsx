"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { FileArrowDown } from "@phosphor-icons/react";
import { CalendarResponse } from "@/@types/calendarResponse.type";
import { SkeletonLoading } from "@/components/SkeletonLoading/SkeletonLoading";
import {
  campusCalendarsLinks,
  campusDisplayNames,
} from "@/utils/constants.util";
import styles from "./CalendarsPage.module.css";

export default function CalendarsPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCampus, setSelectedCampus] = useState<string>("MARACANA");
  const [calendarData, setCalendarData] = useState<CalendarResponse | null>(
    null
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        if (!campusCalendarsLinks[selectedCampus]) {
          throw new Error(`Campus link not found for key: ${selectedCampus}`);
        }

        const response = await fetch(
          `/api/v1/calendars?url=${campusCalendarsLinks[selectedCampus]}`,
          { next: { revalidate: 0 } }
        );
        const data: CalendarResponse = await response.json();
        setCalendarData(data);
      } catch (error: unknown) {
        setCalendarData(null);
        console.error("Error fetching calendar data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedCampus]);

  const handleCampusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCampus(event.target.value);
  };

  if (loading && !calendarData) {
    return (
      <div className={`container ${styles.skeletonWrapper}`}>
        <SkeletonLoading height="5vh" width="100%" />
        <SkeletonLoading height="30vh" width="100%" />
        <SkeletonLoading height="30vh" width="100%" />
        <SkeletonLoading height="30vh" width="100%" />
      </div>
    );
  }

  return (
    <>
      {calendarData && (
        <div className={`container ${styles.calendars}`}>
          <div className={styles.nav}>
            <label htmlFor="campusSelect">
              Selecione a Unidade:
              <select
                id="campusSelect"
                value={selectedCampus}
                onChange={handleCampusChange}
              >
                {Object.keys(campusCalendarsLinks).map((campus) => (
                  <option key={campus} value={campus}>
                    {campusDisplayNames[campus]}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className={styles.headerCalendar}>
            <h1>Caléndarios: {campusDisplayNames[selectedCampus]}</h1>
          </div>

          {/* Calendário do Ano Atual */}
          <section className={styles.wrapper}>
            <h2>Calendário do Ano Atual</h2>
            {calendarData?.calendars?.currentYear ? (
              <div>
                {calendarData.calendars.currentYear.undergraduate && (
                  <>
                    <h4>Graduação</h4>
                    <ul>
                      {calendarData.calendars.currentYear.undergraduate.map(
                        (link, index) => (
                          <li key={index}>
                            <Link
                              href={link.link}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <FileArrowDown /> {link.title}
                            </Link>
                          </li>
                        )
                      )}
                    </ul>
                  </>
                )}

                {calendarData.calendars.currentYear.subsequent_technical && (
                  <>
                    <h4>Técnico Subsequente</h4>
                    <ul>
                      {calendarData.calendars.currentYear.subsequent_technical.map(
                        (link, index) => (
                          <li key={index}>
                            <Link
                              href={link.link}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <FileArrowDown /> {link.title}
                            </Link>
                          </li>
                        )
                      )}
                    </ul>
                  </>
                )}

                {calendarData?.calendars?.currentYear.others && (
                  <>
                    <h4>Outros</h4>
                    <ul>
                      {calendarData.calendars.currentYear.others.map(
                        (link, index) => (
                          <li key={index}>
                            <Link
                              href={link.link}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <FileArrowDown /> {link.title}
                            </Link>
                          </li>
                        )
                      )}
                    </ul>
                  </>
                )}
              </div>
            ) : (
              <p>Não há calendários disponíveis para o ano atual.</p>
            )}
          </section>

          {/* Calendários de Anos Anteriores */}
          <section className={styles.wrapper}>
            <h2>Calendários de Anos Anteriores</h2>
            {calendarData?.calendars?.previousYears &&
            Object.keys(calendarData.calendars.previousYears).length > 0 ? (
              Object.entries(calendarData.calendars.previousYears)
                .reverse()
                .map(([year, links], index) => (
                  <div key={index}>
                    <h3>{year}</h3>
                    <div>
                      {links.undergraduate && (
                        <>
                          <h4>Graduação</h4>
                          <ul>
                            {links.undergraduate.map((link, index) => (
                              <li key={index}>
                                <Link
                                  href={link.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <FileArrowDown /> {link.title}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </>
                      )}

                      {links.integrated_technical && (
                        <>
                          <h4>Técnico Integrado</h4>
                          <ul>
                            {links.integrated_technical.map((link, index) => (
                              <li key={index}>
                                <Link
                                  href={link.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <FileArrowDown /> {link.title}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </>
                      )}

                      {links.subsequent_technical && (
                        <>
                          <h4>Técnico Subsequente</h4>
                          <ul>
                            {links.subsequent_technical.map((link, index) => (
                              <li key={index}>
                                <Link
                                  href={link.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <FileArrowDown /> {link.title}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                    </div>
                  </div>
                ))
            ) : (
              <p>Não há calendários disponíveis para anos anteriores.</p>
            )}
          </section>
        </div>
      )}
    </>
  );
}
