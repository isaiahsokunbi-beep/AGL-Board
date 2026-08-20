"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { GalleryImage } from "@/content/board-paper";

export function PhotoGallery({
  images,
  title,
}: {
  images: GalleryImage[];
  title?: string;
}) {
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    if (active === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setActive(null);
      if (e.key === "ArrowRight") {
        setActive((i) => (i === null ? i : (i + 1) % images.length));
      }
      if (e.key === "ArrowLeft") {
        setActive((i) =>
          i === null ? i : (i - 1 + images.length) % images.length,
        );
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, images.length]);

  if (images.length === 0) return null;

  return (
    <figure className="mt-6">
      {title && (
        <figcaption className="mb-3 text-sm font-semibold text-text-primary">
          {title}
        </figcaption>
      )}
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((img, i) => (
          <li key={`${img.src}-${i}`}>
            <button
              type="button"
              className="group relative block w-full overflow-hidden rounded-lg bg-surface-metric text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-orange"
              onClick={() => setActive(i)}
              aria-label={`Open photo: ${img.alt}`}
            >
              <span className="relative block aspect-[4/3] w-full">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                />
              </span>
              {(img.caption || img.alt) && (
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent px-3 pb-2.5 pt-8 text-left">
                  <span className="line-clamp-2 text-[12px] font-medium text-white">
                    {img.caption ?? img.alt}
                  </span>
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>

      {active !== null && (
        <div
          className="no-print fixed inset-0 z-[60] flex items-center justify-center bg-text-primary/80 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          onClick={() => setActive(null)}
        >
          <button
            type="button"
            className="absolute right-4 top-4 rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white hover:bg-white/20"
            onClick={() => setActive(null)}
            aria-label="Close photo"
          >
            Close
          </button>
          {images.length > 1 && (
            <>
              <button
                type="button"
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 px-3 py-2 text-white hover:bg-white/20 sm:left-6"
                aria-label="Previous photo"
                onClick={(e) => {
                  e.stopPropagation();
                  setActive((i) =>
                    i === null ? i : (i - 1 + images.length) % images.length,
                  );
                }}
              >
                ‹
              </button>
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 px-3 py-2 text-white hover:bg-white/20 sm:right-6"
                aria-label="Next photo"
                onClick={(e) => {
                  e.stopPropagation();
                  setActive((i) => (i === null ? i : (i + 1) % images.length));
                }}
              >
                ›
              </button>
            </>
          )}
          <div
            className="relative max-h-[85vh] w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative mx-auto aspect-[4/3] w-full overflow-hidden rounded-lg bg-black/40">
              <Image
                src={images[active].src}
                alt={images[active].alt}
                fill
                priority
                sizes="90vw"
                className="object-contain"
              />
            </div>
            <p className="mt-3 text-center text-sm text-white/90">
              {images[active].caption ?? images[active].alt}
              <span className="ml-2 text-white/50">
                ({active + 1}/{images.length})
              </span>
            </p>
          </div>
        </div>
      )}
    </figure>
  );
}
