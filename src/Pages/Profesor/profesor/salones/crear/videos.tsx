import { Maximize, Minimize, Pause, Play, X } from "lucide-react"
import { useRef, useState } from "react"






function getYoutubeId(url: string) {
  // Si ya es un embed, extrae el ID
  const embedMatch = url.match(/\/embed\/([a-zA-Z0-9_-]{11})/)
  if (embedMatch) return embedMatch[1]
  // Si es watch?v=...
  const watchMatch = url.match(/v=([a-zA-Z0-9_-]{11})/)
  if (watchMatch) return watchMatch[1]
  // Si es youtu.be/...
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/)
  if (shortMatch) return shortMatch[1]
  return ""
}

export const VideoPlayer = ({ url, onClose }: { url: string, onClose: () => void }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const videoRef = useRef<HTMLIFrameElement>(null)

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
    if (videoRef.current) {
      if (!isFullscreen) {
        videoRef.current.requestFullscreen()
      } else {
        document.exitFullscreen()
      }
    }
  }

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center ${isFullscreen ? 'p-0' : 'p-4'}`}>
      <div className={`relative ${isFullscreen ? 'w-full h-full' : 'w-full max-w-4xl aspect-video'}`}>
        <button 
          onClick={onClose}
          className="absolute -top-10 right-0 text-white hover:text-gray-300 z-50"
        >
          <X size={24} />
        </button>
        
        <iframe
            width="100%"
            height="315"
            src={`https://www.youtube.com/embed/${getYoutubeId(url)}`}
            title="Video Player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            />  
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
          <button 
            onClick={togglePlay}
            className="bg-white bg-opacity-20 rounded-full p-2 hover:bg-opacity-30"
          >
            {isPlaying ? <Pause size={20} color="white" /> : <Play size={20} color="white" />}
          </button>
          <button 
            onClick={toggleFullscreen}
            className="bg-white bg-opacity-20 rounded-full p-2 hover:bg-opacity-30"
          >
            {isFullscreen ? <Minimize size={20} color="white" /> : <Maximize size={20} color="white" />}
          </button>
        </div>
      </div>
    </div>
  )
}