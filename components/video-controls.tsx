import { Mic, MicOff, Video, VideoOff } from "lucide-react"
import { Button } from "@/components/ui/button"

interface VideoControlsProps {
  isCameraOn: boolean
  isMicOn: boolean
  toggleCamera: () => void
  toggleMic: () => void
}

export function VideoControls({ isCameraOn, isMicOn, toggleCamera, toggleMic }: VideoControlsProps) {
  return (
    <div className="flex justify-center gap-4">
      <Button
        onClick={toggleCamera}
        variant={isCameraOn ? "default" : "destructive"}
        size="icon"
        className="rounded-full h-12 w-12"
      >
        {isCameraOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
      </Button>
      <Button
        onClick={toggleMic}
        variant={isMicOn ? "default" : "destructive"}
        size="icon"
        className="rounded-full h-12 w-12"
      >
        {isMicOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
      </Button>
    </div>
  )
}

