"use client";

import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronRight, ChevronLeft} from 'lucide-react';
import { cn } from "@/lib/utils";

const Carousel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    opts?: Parameters<typeof useEmblaCarousel>[0];
    setApi?: (api: ReturnType<typeof useEmblaCarousel>[1] | undefined) => void;
    autoplay?: boolean;
    autoplayDelay?: number;
    showButtons?: boolean; // Prop for å vise/hide knappene
  }
>(
  (
    {
      opts,
      setApi,
      autoplay = false,
      autoplayDelay = 3000,
      className,
      children,
      showButtons = false, // Standard: ikke vis knappene
      ...props
    },
    ref
  ) => {
    const plugins = React.useMemo(
      () => (autoplay ? [Autoplay({ delay: autoplayDelay })] : []),
      [autoplay, autoplayDelay]
    );
    const [carouselRef, api] = useEmblaCarousel(opts, plugins);
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const [slideCount, setSlideCount] = React.useState(0);

    React.useEffect(() => {
      if (setApi && api) {
        setApi(api);
      }
      if (api) {
        setSlideCount(api.slideNodes().length); // Oppdater antall slides
        const onSelect = () => setSelectedIndex(api.selectedScrollSnap());
        api.on("select", onSelect); // Lytt til endringer i aktiv slide
        onSelect();
      }
    }, [api, setApi]);

    return (
      <div
        ref={(node) => {
          carouselRef(node);
          if (typeof ref === "function") {
            ref(node);
          } else if (ref && "current" in ref) {
            ref.current = node;
          }
        }}
        className={cn("relative", className)}
        {...props}
      >
        {/* Slide content */}
        {children}

        {/* Navigeringsknapper (valgfri via props) */}
        {showButtons && (
          <>
            <button
              onClick={() => api?.scrollPrev()} // Gå til forrige slide
              className="absolute top-1/3 left-3 transform -translate-y-1/2 bg-black/60 py-[11px] px-[12px] rounded-full hover:bg-gray-400"
            >
              <ChevronLeft/>
            </button>
            <button
              onClick={() => api?.scrollNext()} // Gå til neste slide
              className="absolute top-1/3 right-3 transform -translate-y-1/2 bg-black/60 py-[11px] px-[12px] rounded-full hover:bg-gray-400"
            >
              <ChevronRight/>
            </button>
          </>
        )}

        {/* Indikatorer (flyttet til toppen) */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {Array.from({ length: slideCount }).map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)} // Naviger til valgt slide
              className={cn(
                "w-3 h-3 rounded-full transition-colors",
                index === selectedIndex
                  ? "bg-pinky"
                  : "bg-gray-300 hover:bg-gray-400"
              )}
            />
          ))}
        </div>
      </div>
    );
  }
);
Carousel.displayName = "Carousel";

const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("flex", className)} {...props} />;
});
CarouselContent.displayName = "CarouselContent";

const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("min-w-0 shrink-0 grow-0 basis-full", className)}
      {...props}
    />
  );
});
CarouselItem.displayName = "CarouselItem";

export { Carousel, CarouselContent, CarouselItem };
