import { X } from 'lucide-react'
import { DbImage } from './DbImage'

export function Lightbox({ imageId, alt, onClose }: { imageId: string; alt: string; onClose: () => void }) {
  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label="查看大图" onClick={onClose}>
      <button type="button" className="icon-button lightbox-close" aria-label="关闭大图" onClick={onClose}>
        <X size={24} />
      </button>
      <div className="lightbox-content" onClick={(event) => event.stopPropagation()}>
        <DbImage imageId={imageId} alt={alt} className="lightbox-image" />
      </div>
    </div>
  )
}
