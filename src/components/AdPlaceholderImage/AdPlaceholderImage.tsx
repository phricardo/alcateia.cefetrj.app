"use client";

import React from "react";
import Image from "next/image";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

type AdImageSliderProps = {
  width?: number | string;
  borderRadius?: number;
};

const imageUrls = ["/images/banner.jpeg", "/images/banner_2.jpeg"];

function AutoplayPlugin(slider: any) {
  let timeout: NodeJS.Timeout;
  let mouseOver = false;

  function clearNextTimeout() {
    if (timeout) clearTimeout(timeout);
  }

  function nextTimeout() {
    clearNextTimeout();
    if (mouseOver) return;
    timeout = setTimeout(() => {
      slider.next();
    }, 3000);
  }

  slider.on("created", () => {
    slider.container.addEventListener("mouseover", () => {
      mouseOver = true;
      clearNextTimeout();
    });
    slider.container.addEventListener("mouseout", () => {
      mouseOver = false;
      nextTimeout();
    });
    nextTimeout();
  });

  slider.on("dragStarted", clearNextTimeout);
  slider.on("animationEnded", nextTimeout);
  slider.on("updated", nextTimeout);
}

export default function AdImageSlider({
  width = "100%",
  borderRadius = 8,
}: AdImageSliderProps) {
  const shouldAutoplay = imageUrls.length > 1;

  const [sliderRef] = useKeenSlider(
    {
      loop: shouldAutoplay,
      slides: {
        origin: "center",
        perView: 1,
      },
      mode: "snap",
    },
    shouldAutoplay ? [AutoplayPlugin] : []
  );

  return (
    <div
      style={{
        width,
        height: "150px",
        borderRadius,
        overflow: "hidden",
        border: "1px solid #cbd5e0",
        backgroundColor: "#e2e8f0",
        position: "relative",
      }}
    >
      <div
        ref={sliderRef}
        className="keen-slider"
        style={{ height: "150px", width: "100%" }}
      >
        {imageUrls.map((url, index) => (
          <div
            className="keen-slider__slide"
            key={index}
            style={{ position: "relative", height: "150px" }}
          >
            <Image
              src={url}
              alt={`Slide ${index + 1}`}
              fill
              style={{ objectFit: "cover" }}
              sizes="(max-width: 768px) 100vw, 100vw"
              priority={index === 0}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
