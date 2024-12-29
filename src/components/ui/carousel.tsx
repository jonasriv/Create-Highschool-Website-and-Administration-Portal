"use client";

import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay"; // Importer autoplay-plugin
import { cn } from "@/lib/utils";

const Carousel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    opts?: Parameters<typeof useEmblaCarousel>[0];
    setApi?: (api: ReturnType<typeof useEmblaCarousel>[1] | undefined) => void;
    autoplay?: boolean; // Ny prop for å aktivere autoplay
  }
>(({ opts, setApi, autoplay = false, className, children, ...props }, ref) => {
  const plugins = React.useMemo(
    () => (autoplay ? [Autoplay()] : []), // Legg til autoplay hvis aktivert
    [autoplay]
  );

  const [carouselRef, api] = useEmblaCarousel(opts, plugins);

  React.useEffect(() => {
    if (setApi && api) {
      setApi(api);
    }
  }, [api, setApi]);

  return (
    <div ref={carouselRef} className={cn("relative", className)} {...props}>
      {children}
    </div>
  );
});
Carousel.displayName = "Carousel";

const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("flex", className)} {...props} />
  );
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
