import { useEffect, useState, useRef } from 'react'
import { useSettingsStore } from '@/stores/settings'
const defautBackground = '/backgrounds/1.jpg'

/**
 * @component
 * @description
 * Displays a background image based on user settings:
 * 1. localBackgroundImage (highest priority)
 * 2. backgroundImage (custom URL)
 * 3. Unsplash (via Web Worker, with frequency control)
 * 4. Random local fallback
 */
export default function BackgroundImageDisplay() {
  const {
    localBackgroundImage,
    backgroundImage,
    unsplashApiKey,
    unsplashCollectionId,
    unsplashFrequency,
    imageOpacity,
  } = useSettingsStore()

  const [imageUrl, setImageUrl] = useState('')
  const workerRef = useRef(null)

  useEffect(() => {
    workerRef.current = new Worker(
      new URL('@/services/imageWorker.js', import.meta.url),
      { type: 'module' }
    )

    workerRef.current.onmessage = (event) => {
      const { type, payload } = event.data
      if (type === 'newImage') {
        if (!localBackgroundImage && !backgroundImage) {
          setImageUrl(payload)
        }
      } else if (type === 'error') {
        console.error('Image Worker Error:', payload)
        if (!localBackgroundImage && !backgroundImage && !imageUrl) {
          setImageUrl(defautBackground) // fallback
        }
      }
    }

    return () => {
      workerRef.current?.terminate()
      workerRef.current = null
    }
  }, [])

  useEffect(() => {
    if (localBackgroundImage) {
      setImageUrl(localBackgroundImage)
    } else if (backgroundImage) {
      setImageUrl(backgroundImage)
    } else if (unsplashApiKey && workerRef.current) {
      setImageUrl('')
      workerRef.current.postMessage({
        type: 'INIT',
        payload: { unsplashApiKey, unsplashCollectionId, unsplashFrequency },
      })
    } else {
      setImageUrl(defautBackground)
    }
  }, [
    localBackgroundImage,
    backgroundImage,
    unsplashApiKey,
    unsplashCollectionId,
    unsplashFrequency,
  ])

  useEffect(() => {
    workerRef.current?.postMessage({
      type: 'SETTINGS_UPDATED',
      payload: { unsplashApiKey, unsplashCollectionId, unsplashFrequency },
    })
  }, [unsplashApiKey, unsplashCollectionId, unsplashFrequency])

  useEffect(() => {
    if (
      !localBackgroundImage &&
      !backgroundImage &&
      unsplashApiKey &&
      unsplashFrequency === 'manual' &&
      workerRef.current
    ) {
      workerRef.current.postMessage({ type: 'FETCH_NOW' })
    }
  }, [unsplashFrequency, unsplashApiKey, localBackgroundImage, backgroundImage])

  if (!imageUrl) return null

  return (
    <div
      className="fixed inset-0 w-full h-full -z-10 bg-cover bg-center transition-all duration-1000 ease-in-out"
      style={{
        backgroundImage: `url(${imageUrl})`,
        filter: 'blur(3px) brightness(0.6)',
        transform: 'scale(1.05)',
        opacity: imageOpacity / 100,
      }}
    />
  )
}
