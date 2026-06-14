import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Returns the distance between two points in meters. */
export function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

/** Scrolls to an element by ID. */
export function scrollToElement(elementId: string): void {
  setTimeout(() => {
    document.getElementById(elementId)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, 200)
}

/**
 * Formats a Date object as a string in the format "HH:MM:SS".
 */
export function formatTime(date: Date): string {
  const hr = date.getHours().toString().padStart(2, '0')
  const min = date.getMinutes().toString().padStart(2, '0')
  const sec = date.getSeconds().toString().padStart(2, '0')
  const time = `${hr}:${min}:${sec}`
  return time
}

/**
 * Returns the time difference between two Date objects in minutes.
 */
export function timeDiffInMinutes(date: Date, from: Date): number {
  const diff = from.getTime() - date.getTime()
  return diff / 1000 / 60
}
