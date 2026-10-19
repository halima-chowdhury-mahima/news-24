
"use client";

import Image from "next/image";
import { useState } from "react";

type NewsCardImageProps = {
  src: string | null | undefined;
  alt: string;
};

export default function NewsCardImage({
  src,
  alt,
}: NewsCardImageProps) {
  const [imageError, setImageError] = useState(false);

  const imageSrc =
    !imageError && src?.trim()
      ? src.trim()
      : "/images/news-placeholder.svg";

  return (
    <Image
      src={imageSrc}
      alt={alt}
      fill
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      className="object-cover transition duration-500 group-hover:scale-105"
      onError={() => setImageError(true)}
    />
  );
}