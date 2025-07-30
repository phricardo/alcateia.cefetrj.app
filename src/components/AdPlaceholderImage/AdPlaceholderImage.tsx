"use client";

import React from "react";

type AdPlaceholderImageProps = {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  text?: string;
};

export default function AdPlaceholderImage({
  width = "100%",
  height = 200,
  borderRadius = 8,
  text = "Ad Placeholder",
}: AdPlaceholderImageProps) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius,
        backgroundColor: "#e2e8f0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#4a5568",
        fontWeight: "bold",
        fontSize: "1rem",
        textAlign: "center",
        border: "1px dashed #cbd5e0",
      }}
    >
      {text}
    </div>
  );
}
