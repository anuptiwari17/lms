// components/ui/slider.tsx - Simple Custom Slider Component (No Radix UI)
"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SliderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value: number[]
  max: number
  min?: number
  step?: number
  onValueChange?: (value: number[]) => void
}

const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  ({ className, value = [0], max = 100, min = 0, step = 1, onValueChange, ...props }, ref) => {
    const sliderRef = React.useRef<HTMLDivElement>(null)
    const [isDragging, setIsDragging] = React.useState(false)

    const currentValue = value[0] || 0
    const percentage = ((currentValue - min) / (max - min)) * 100

    const handleMouseDown = React.useCallback((event: React.MouseEvent) => {
      event.preventDefault()
      setIsDragging(true)
      updateValue(event.clientX)
    }, [])

    const handleMouseMove = React.useCallback((event: MouseEvent) => {
      if (isDragging) {
        updateValue(event.clientX)
      }
    }, [isDragging])

    const handleMouseUp = React.useCallback(() => {
      setIsDragging(false)
    }, [])

    const updateValue = React.useCallback((clientX: number) => {
      if (sliderRef.current) {
        const rect = sliderRef.current.getBoundingClientRect()
        const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
        const rawValue = min + percentage * (max - min)
        const steppedValue = Math.round(rawValue / step) * step
        const clampedValue = Math.max(min, Math.min(max, steppedValue))
        
        if (onValueChange && clampedValue !== currentValue) {
          onValueChange([clampedValue])
        }
      }
    }, [min, max, step, currentValue, onValueChange])

    React.useEffect(() => {
      if (isDragging) {
        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)
        return () => {
          document.removeEventListener('mousemove', handleMouseMove)
          document.removeEventListener('mouseup', handleMouseUp)
        }
      }
    }, [isDragging, handleMouseMove, handleMouseUp])

    const handleClick = (event: React.MouseEvent) => {
      if (!isDragging) {
        updateValue(event.clientX)
      }
    }

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex w-full touch-none select-none items-center cursor-pointer",
          className
        )}
        onMouseDown={handleMouseDown}
        onClick={handleClick}
        {...props}
      >
        <div 
          ref={sliderRef}
          className="relative h-2 w-full grow overflow-hidden rounded-full bg-white/20"
        >
          <div 
            className="absolute h-full bg-white rounded-full transition-all"
            style={{ width: `${Math.max(0, Math.min(100, percentage))}%` }}
          />
        </div>
        <div
          className="absolute block h-5 w-5 rounded-full border-2 border-white bg-white shadow-lg transition-all hover:scale-110"
          style={{ 
            left: `calc(${Math.max(0, Math.min(100, percentage))}% - 10px)`,
            transform: isDragging ? 'scale(1.1)' : 'scale(1)'
          }}
        />
      </div>
    )
  }
)

Slider.displayName = "Slider"

export { Slider }