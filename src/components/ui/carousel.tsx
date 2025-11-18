'use client'

import * as React from "react"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import { ChevronRight, ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"

const Carousel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    opts?: Parameters<typeof useEmblaCarousel>[0]
    setApi?: (api: ReturnType<typeof useEmblaCarousel>[1] | undefined) => void
    autoplay?: boolean
    autoplayDelay?: number
    showButtons?: boolean
    buttonsPosition?: string
  }
>(
  (
    {
      opts,
      setApi,
      autoplay = false,
      autoplayDelay = 5000,
      className,
      children,
      showButtons = false,
      buttonsPosition = "top-1/3",
      ...props
    },
    ref
  ) => {
    // Wait for hydration before initializing Embla
    const [hydrated, setHydrated] = React.useState(false)
    React.useEffect(() => {
      setHydrated(true)
    }, [])

    // Initialize Embla only after hydration
    const [carouselRef, api] = useEmblaCarousel(
      opts,
      hydrated && autoplay ? [Autoplay({ delay: autoplayDelay })] : []
    )

    React.useEffect(() => {
      if (setApi && api) setApi(api)
    }, [api, setApi])

    // Prevent mismatched HTML on SSR vs client
    if (!hydrated) {
      return (
        <div
          className={cn(
            "w-full h-[24rem] md:h-[28rem] lg:h-[32rem]",
            className
          )}
        />
      )
    }

    return (
      <div
        ref={(node) => {
          carouselRef(node)
          if (typeof ref === "function") ref(node)
          else if (ref && "current" in ref) ref.current = node
        }}
        className={cn("relative", className)}
        {...props}
      >
        {children}

        {showButtons && (
          <>
            <button
              onClick={() => api?.scrollPrev()}
              className={cn(
                "absolute left-3 transform -translate-y-1/2 bg-white/40 py-[11px] px-[12px] rounded-full md:hover:bg-white/20",
                buttonsPosition
              )}
            >
              <ChevronLeft color="black" />
            </button>
            <button
              onClick={() => api?.scrollNext()}
              className={cn(
                "absolute right-3 transform -translate-y-1/2 bg-white/40 py-[11px] px-[12px] rounded-full md:hover:bg-white/20",
                buttonsPosition
              )}
            >
              <ChevronRight color="black" />
            </button>
          </>
        )}
      </div>
    )
  }
)
Carousel.displayName = "Carousel"

// --- Content wrapper ---
const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex", className)} {...props} />
))
CarouselContent.displayName = "CarouselContent"

// --- Item ---
const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("min-w-0 shrink-0 grow-0 basis-full", className)}
    {...props}
  />
))
CarouselItem.displayName = "CarouselItem"

export { Carousel, CarouselContent, CarouselItem }
