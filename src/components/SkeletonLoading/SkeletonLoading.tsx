"use client";

import React from "react";
import styles from "./SkeletonLoading.module.css";

interface SkeletonLoadingProps
  extends Omit<React.HTMLProps<HTMLDivElement>, "className" | "style"> {
  height: string;
  width: string;
  marginTop?: string;
  marginBottom?: string;
}

export function SkeletonLoading({
  height,
  width,
  marginTop,
  marginBottom,
  ...props
}: SkeletonLoadingProps) {
  const customStyles = {
    height,
    width,
    marginTop: marginTop || undefined,
    marginBottom: marginBottom || undefined,
  };

  return (
    <div
      {...props}
      style={customStyles}
      className={`${styles.skeletonItem} ${styles.skeletonAnimation}`}
    ></div>
  );
}
