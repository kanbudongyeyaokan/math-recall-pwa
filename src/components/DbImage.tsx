import { useLiveQuery } from 'dexie-react-hooks'
import { ImageOff } from 'lucide-react'
import { db } from '../db'
import { useObjectUrl } from '../hooks/useObjectUrl'

interface DbImageProps {
  imageId?: string
  alt: string
  className?: string
  onClick?: () => void
}

export function DbImage({ imageId, alt, className = '', onClick }: DbImageProps) {
  const image = useLiveQuery(() => imageId ? db.images.get(imageId) : undefined, [imageId])
  const url = useObjectUrl(image?.blob)

  if (!imageId) return null
  if (!url) {
    return (
      <div className={`image-placeholder ${className}`} aria-label={`${alt}加载中`}>
        <ImageOff size={22} aria-hidden="true" />
      </div>
    )
  }

  return (
    <button className={`db-image-button ${onClick ? 'is-zoomable' : ''}`} onClick={onClick} type="button">
      <img src={url} alt={alt} className={className} />
    </button>
  )
}
