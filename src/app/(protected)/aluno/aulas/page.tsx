"use client";

import React from "react";
import { UserContext } from "@/contexts/user-context";
import { STUDENT_SCHEDULE_GET } from "@/functions/api";
import { SkeletonLoading } from "@/components/SkeletonLoading/SkeletonLoading";
import styles from "./page.module.css";

interface ScheduleItem {
  weekday: string;
  startTime: string;
  endTime: string;
  startDate: string;
  endDate: string;
  courseCode: string;
  courseName: string;
  location: string;
}

export default function StudentSchedulePage() {
  const { user, isLoading } = React.useContext(UserContext);
  const [schedule, setSchedule] = React.useState<ScheduleItem[]>([]);
  const [isScheduleLoading, setIsScheduleLoading] =
    React.useState<boolean>(false);

  React.useEffect(() => {
    const fetchData = async () => {
      setIsScheduleLoading(true);
      try {
        if (user?.studentId) {
          const { url, options } = STUDENT_SCHEDULE_GET(user.studentId);
          const response = await fetch(url, options);
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const json: { schedule: ScheduleItem[] } = await response.json();
          setSchedule(json.schedule);
        }
      } catch (error) {
        console.error("Failed to fetch student schedule:", error);
      } finally {
        setIsScheduleLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if ((!user && isLoading) || isScheduleLoading)
    return (
      <div className={`${styles.pageWrapper} container`}>
        <SkeletonLoading width="100%" height="60vh" />
      </div>
    );

  if (user && !isLoading)
    return (
      <div className={`${styles.pageWrapper} container`}>
        <h1 className={styles.title}>Minhas aulas</h1>
        <div className={styles.scheduleList}>
          {schedule.map((item, index) => (
            <div key={index} className={styles.scheduleItem}>
              <h2 className={styles.courseName}>
                {item.courseCode} - {item.courseName}
              </h2>
              <p>
                <strong>Dia:</strong> {item.weekday}
              </p>
              <p>
                <strong>Horário:</strong> {item.startTime} - {item.endTime}
              </p>
              <p>
                <strong>Local:</strong> {item.location}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
}
