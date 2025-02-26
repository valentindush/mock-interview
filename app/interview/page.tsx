"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Send } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VideoControls } from "@/components/video-controls"

interface Message {
  id: string
  sender: "interviewer" | "interviewee"
  text: string
  timestamp: Date
}

export default function InterviewSimulator() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [userStream, setUserStream] = useState<MediaStream | null>(null)
  const [interviewerStream, setInterviewerStream] = useState<MediaStream | null>(null)
  const [isCameraOn, setIsCameraOn] = useState(true)
  const [isMicOn, setIsMicOn] = useState(true)
  const [activeTab, setActiveTab] = useState<"video" | "chat">("video")

  const userVideoRef = useRef<HTMLVideoElement>(null)
  const interviewerVideoRef = useRef<HTMLVideoElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  // Initialize camera streams
  useEffect(() => {
    const initializeUserCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        })
        setUserStream(stream)

        if (userVideoRef.current) {
          userVideoRef.current.srcObject = stream
        }
      } catch (error) {
        console.error("Error accessing camera:", error)
      }
    }

    // Simulate interviewer with a placeholder video
    const initializeInterviewerVideo = () => {
      const canvas = document.createElement("canvas")
      canvas.width = 640
      canvas.height = 480
      const ctx = canvas.getContext("2d")

      if (ctx) {
        // Draw a placeholder avatar
        ctx.fillStyle = "#f3f4f6"
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = "#6b7280"
        ctx.beginPath()
        ctx.arc(canvas.width / 2, canvas.height / 2 - 50, 100, 0, Math.PI * 2)
        ctx.fill()
        ctx.beginPath()
        ctx.arc(canvas.width / 2, canvas.height / 2 + 120, 160, 0, Math.PI, true)
        ctx.fill()

        // Create a stream from the canvas
        const stream = canvas.captureStream(30)
        setInterviewerStream(stream)

        if (interviewerVideoRef.current) {
          interviewerVideoRef.current.srcObject = stream
        }
      }
    }

    initializeUserCamera()
    initializeInterviewerVideo()

    // Cleanup
    return () => {
      userStream?.getTracks().forEach((track) => track.stop())
      interviewerStream?.getTracks().forEach((track) => track.stop())
    }
  }, [interviewerStream?.getTracks, userStream?.getTracks])

  // Toggle camera
  const toggleCamera = () => {
    if (userStream) {
      userStream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled
      })
      setIsCameraOn(!isCameraOn)
    }
  }

  // Toggle microphone
  const toggleMic = () => {
    if (userStream) {
      userStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled
      })
      setIsMicOn(!isMicOn)
    }
  }

  // Send a message
  const sendMessage = (sender: "interviewer" | "interviewee") => {
    if (inputValue.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        sender,
        text: inputValue,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, newMessage])
      setInputValue("")

      // Auto-scroll to bottom of chat
      setTimeout(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
        }
      }, 100)
    }
  }

  // Simulate interviewer response
  const simulateInterviewerResponse = () => {
    const responses = [
      "Tell me about yourself.",
      "What are your strengths and weaknesses?",
      "Why do you want to work for our company?",
      "Where do you see yourself in 5 years?",
      "Describe a challenging situation you faced at work and how you handled it.",
      "What questions do you have for me?",
      "How do you handle stress and pressure?",
      "What are your salary expectations?",
      "Why should we hire you?",
      "Thank you for your answers. Do you have any other questions?",
    ]

    const randomResponse = responses[Math.floor(Math.random() * responses.length)]

    setTimeout(
      () => {
        const newMessage: Message = {
          id: Date.now().toString(),
          sender: "interviewer",
          text: randomResponse,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, newMessage])

        // Auto-scroll to bottom of chat
        setTimeout(() => {
          if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
          }
        }, 100)
      },
      1000 + Math.random() * 2000,
    ) // Random delay between 1-3 seconds
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage("interviewee")
    simulateInterviewerResponse()
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-2xl font-bold mb-6 text-center">Interview Simulator</h1>

      {/* Mobile tabs */}
      <div className="md:hidden mb-4">
        <Tabs defaultValue="video" onValueChange={(value) => setActiveTab(value as "video" | "chat")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="video">Video</TabsTrigger>
            <TabsTrigger value="chat">Chat</TabsTrigger>
          </TabsList>
          <TabsContent value="video" className="mt-2">
            <div className="space-y-4">
              {/* Video containers for mobile */}
              <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                <video ref={interviewerVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                  Interviewer
                </div>
              </div>

              <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                <video ref={userVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">You</div>
              </div>

              <VideoControls
                isCameraOn={isCameraOn}
                isMicOn={isMicOn}
                toggleCamera={toggleCamera}
                toggleMic={toggleMic}
              />
            </div>
          </TabsContent>
          <TabsContent value="chat" className="mt-2">
            <div className="h-[60vh] flex flex-col">
              <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 bg-muted/30 rounded-lg mb-4">
                {messages.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">No messages yet. Start the conversation!</div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`mb-4 max-w-[80%] ${message.sender === "interviewee" ? "ml-auto" : "mr-auto"}`}
                    >
                      <div
                        className={`p-3 rounded-lg ${
                          message.sender === "interviewee" ? "bg-primary text-primary-foreground" : "bg-muted"
                        }`}
                      >
                        {message.text}
                      </div>
                      <div className={`text-xs mt-1 ${message.sender === "interviewee" ? "text-right" : ""}`}>
                        {message.sender === "interviewee" ? "You" : "Interviewer"} •{" "}
                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  ))
                )}
              </div>
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1"
                />
                <Button type="submit" size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Desktop layout */}
      <div className="hidden md:grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-4">
          {/* Main video (interviewer) */}
          <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
            <video ref={interviewerVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">Interviewer</div>
          </div>

          {/* User video (smaller) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
              <video ref={userVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
              <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">You</div>
            </div>
            <div className="flex items-center justify-center">
              <VideoControls
                isCameraOn={isCameraOn}
                isMicOn={isMicOn}
                toggleCamera={toggleCamera}
                toggleMic={toggleMic}
              />
            </div>
          </div>
        </div>

        {/* Chat section */}
        <div className="h-[calc(100vh-10rem)] flex flex-col">
          <h2 className="text-lg font-semibold mb-2">Chat</h2>
          <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 bg-muted/30 rounded-lg mb-4">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">No messages yet. Start the conversation!</div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-4 max-w-[80%] ${message.sender === "interviewee" ? "ml-auto" : "mr-auto"}`}
                >
                  <div
                    className={`p-3 rounded-lg ${
                      message.sender === "interviewee" ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    {message.text}
                  </div>
                  <div className={`text-xs mt-1 ${message.sender === "interviewee" ? "text-right" : ""}`}>
                    {message.sender === "interviewee" ? "You" : "Interviewer"} •{" "}
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              ))
            )}
          </div>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button type="submit" size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}