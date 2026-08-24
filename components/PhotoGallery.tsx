"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { GalleryImage } from "@/content/board-paper";

function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

const navBtnClass =
  "absolute top-1/2 z-[61] flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-white text-text-primary shadow-[0_4px_20px_rgba(0,0,0,0.45)] transition hover:bg-brand-orange hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:h-14 sm:w-14";

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

  const gridClass =
    images.length === 1
      ? "grid grid-cols-1"
      : "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3";

  return (
    <figure className="mt-6">
      {title && (
        <figcaption className="mb-3 text-sm font-semibold text-text-primary">
          {title}
        </figcaption>
      )}
      <ul className={gridClass}>
        {images.map((img, i) => {
          const fit = img.fit ?? "cover";
          return (
            <li key={`${img.src}-${i}`}>
              <button
                type="button"
                className="group relative block w-full overflow-hidden rounded-lg border border-border-default bg-surface-metric text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-orange"
                onClick={() => setActive(i)}
                aria-label={`Open photo: ${img.alt}`}
              >
                <span
                  className={`relative block w-full ${
                    images.length === 1 ? "aspect-[16/9]" : "aspect-[4/3]"
                  }`}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes={
                      images.length === 1
                        ? "(max-width: 896px) 100vw, 832px"
                        : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    }
                    className={`transition-transform duration-500 ease-out group-hover:scale-[1.02] ${
                      fit === "contain" ? "object-contain p-2" : "object-cover"
                    }`}
                  />
                </span>
                {(img.caption || img.alt) && images.length > 1 && (
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent px-3 pb-2.5 pt-8 text-left">
                    <span className="line-clamp-2 text-[12px] font-medium text-white">
                      {img.caption ?? img.alt}
                    </span>
                  </span>
                )}
              </button>
              {images.length === 1 && (img.caption || img.alt) && (
                <p className="mt-2 text-sm text-text-secondary">
                  {img.caption ?? img.alt}
                </p>
              )}
            </li>
          );
        })}
      </ul>

      {active !== null && (
        <div
          className="no-print fixed inset-0 z-[60] flex items-center justify-center bg-text-primary/85 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          onClick={() => setActive(null)}
        >
          <button
            type="button"
            className="absolute right-4 top-4 z-[61] rounded-full border-2 border-white bg-white px-4 py-2 text-sm font-semibold text-text-primary shadow-[0_4px_20px_rgba(0,0,0,0.45)] hover:bg-brand-orange hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            onClick={() => setActive(null)}
            aria-label="Close photo"
          >
            Close
          </button>
          {images.length > 1 && (
            <>
              <button
                type="button"
                className={`${navBtnClass} left-3 sm:left-6`}
                aria-label="Previous photo"
                onClick={(e) => {
                  e.stopPropagation();
                  setActive((i) =>
                    i === null ? i : (i - 1 + images.length) % images.length,
                  );
                }}
              >
                <ChevronLeftIcon className="h-6 w-6 sm:h-7 sm:w-7" />
              </button>
              <button
                type="button"
                className={`${navBtnClass} right-3 sm:right-6`}
                aria-label="Next photo"
                onClick={(e) => {
                  e.stopPropagation();
                  setActive((i) => (i === null ? i : (i + 1) % images.length));
                }}
              >
                <ChevronRightIcon className="h-6 w-6 sm:h-7 sm:w-7" />
              </button>
            </>
          )}
          <div
            className="relative max-h-[85vh] w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative mx-auto aspect-[4/3] w-full overflow-hidden rounded-lg bg-black/50 sm:aspect-[16/10]">
              <Image
                src={images[active].src}
                alt={images[active].alt}
                fill
                priority
                sizes="90vw"
                className="object-contain"
              />
            </div>
            <p className="mt-3 text-center text-sm font-medium text-white">
              {images[active].caption ?? images[active].alt}
              {images.length > 1 && (
                <span className="ml-2 text-white/80">
                  ({active + 1}/{images.length})
                </span>
              )}
            </p>
          </div>
        </div>
      )}
    </figure>
  );
}
