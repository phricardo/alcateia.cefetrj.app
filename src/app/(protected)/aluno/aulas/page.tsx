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

  React.useEffect(() => {
    const fetchData = async () => {
      if (user && user.studentId) {
        const { url, options } = STUDENT_SCHEDULE_GET(user.studentId);
        const response = await fetch(url, options);
        const json: { schedule: ScheduleItem[] } = await response.json();
        console.log(json);
        setSchedule(json.schedule);
      }
    };
    fetchData();
  }, [user]);

  if (!user && isLoading)
    return (
      <div className={`${styles.pageWrapper} container`}>
        <SkeletonLoading width="100%" height="60vh" />
      </div>
    );

  if (user && !isLoading)
    return (
      <div className={`${styles.pageWrapper} container`}>
        <h1 className={styles.title}>Meu Horário</h1>
        <div className={styles.scheduleList}>
          {schedule.map((item, index) => (
            <div key={index} className={styles.scheduleItem}>
              <h2 className={styles.courseName}>{item.courseName}</h2>
              <p className={styles.courseCode}>{item.courseCode}</p>
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
