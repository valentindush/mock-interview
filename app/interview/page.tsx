'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useConversation } from '@11labs/react';
import { MicIcon, MicOffIcon, VideoIcon, VideoOffIcon, MessageSquareIcon, Users, PhoneOff } from 'lucide-react';
import { Message } from '@/lib/types';

export function InterviewInterface() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const chatContainerRef = useRef<HTMLDivElement | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isChatOpen, setIsChatOpen] = useState(true);
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);
    const [isAudioEnabled, setIsAudioEnabled] = useState(true);
    const [messageInput, setMessageInput] = useState('');

    const conversation = useConversation({
        onConnect: () => console.log('Connected'),
        onDisconnect: () => console.log('Disconnected'),
        onMessage: (message: Message) => {
            setMessages((prev) => [...prev, message]);
        },
        onError: (error: any) => console.error('Error:', error),
    });

    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);



    const startInterview = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }

            await conversation.startSession({
                agentId: process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID,
            });

        } catch (error) {
            console.error('Failed to start interview:', error);
        }
    }, [conversation]);

    const stopInterview = useCallback(async () => {
        await conversation.endSession();
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
    }, [conversation]);

    const toggleMicrophone = () => setIsAudioEnabled(prev => !prev);
    const toggleVideo = () => setIsVideoEnabled(prev => !prev);
    const toggleChat = () => setIsChatOpen(prev => !prev);

    const sendMessage = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (messageInput.trim()) {
            const newMessage: Message = {
                message: messageInput,
                source: "user"
            };
            setMessages(prev => [...prev, newMessage]);
            setMessageInput('');
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Main content area */}
            <div className={`flex-1 flex flex-col ${isChatOpen ? '' : ''}`}>
                {/* Video area */}
                <div className="flex-1 bg-gray-900 relative">
                    {/* Main video display */}
                    <div className="w-full h-full flex items-center justify-center">
                        {isVideoEnabled ? (
                            <div className="relative w-full h-full">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="bg-gray-800 w-3/4 h-3/4 rounded-lg flex items-center justify-center">
                                        <div className={`text-white w-24 h-24 text-2xl flex items-center justify-center font-semibold rounded-full  bg-blue-400 ${conversation.isSpeaking ? "animate-pulse" : "animation-none"}`}>AI</div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full w-full">
                                <div className="bg-gray-800 w-24 h-24 rounded-full flex items-center justify-center">
                                    <Users size={48} className="text-white" />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Self-view (small picture-in-picture) */}
                    <div className="absolute bottom-5 right-5 w-48 h-36 bg-gray-700 rounded-lg border-2 border-gray-600 shadow-lg overflow-hidden">
                        {isVideoEnabled ? (
                            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    muted
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ) : (
                            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                                <Users size={24} className="text-white" />
                            </div>
                        )}
                    </div>

                    {/* Status indicators */}
                    <div className="absolute top-5 left-5 bg-black bg-opacity-50 rounded-lg px-3 py-1 text-white flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-2 ${conversation.status === 'connected' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className="text-sm">{conversation.status === 'connected' ? 'Connected' : 'Disconnected'}</span>

                        {conversation.status === 'connected' && (
                            <div className="ml-3 flex items-center">
                                <div className={`w-3 h-3 rounded-full mr-2 ${conversation.isSpeaking ? 'bg-blue-500' : 'bg-yellow-500'}`}></div>
                                <span className="text-sm">{conversation.isSpeaking ? 'Speaking' : 'Listening'}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Controls bar */}
                <div className="h-20 bg-gray-800 flex items-center justify-center px-4">
                    <div className="flex space-x-4">
                        <button
                            onClick={toggleMicrophone}
                            className={`p-3 rounded-full ${isAudioEnabled ? 'bg-gray-600 hover:bg-gray-700' : 'bg-red-500 hover:bg-red-600'}`}
                        >
                            {isAudioEnabled ? <MicIcon className="text-white" /> : <MicOffIcon className="text-white" />}
                        </button>

                        <button
                            onClick={toggleVideo}
                            className={`p-3 rounded-full ${isVideoEnabled ? 'bg-gray-600 hover:bg-gray-700' : 'bg-red-500 hover:bg-red-600'}`}
                        >
                            {isVideoEnabled ? <VideoIcon className="text-white" /> : <VideoOffIcon className="text-white" />}
                        </button>

                        <button
                            onClick={startInterview}
                            disabled={conversation.status === 'connected'}
                            className="px-6 py-2 rounded-full bg-green-600 hover:bg-green-700 text-white font-medium disabled:bg-gray-600 disabled:cursor-not-allowed"
                        >
                            Start Interview
                        </button>

                        <button
                            onClick={stopInterview}
                            disabled={conversation.status !== 'connected'}
                            className="px-6 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white font-medium disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center"
                        >
                            <PhoneOff className="mr-2" size={16} />
                            End Interview
                        </button>

                        <button
                            onClick={toggleChat}
                            className={`p-3 rounded-full ${isChatOpen ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 hover:bg-gray-700'}`}
                        >
                            <MessageSquareIcon className="text-white" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Sidebar chat */}
            {isChatOpen && (
                <div ref={chatContainerRef} className="w-80 bg-white border-l border-gray-300 flex flex-col h-full">
                    <div className="p-4 border-b border-gray-200">
                        <h2 className="text-lg font-medium">Conversation</h2>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.length === 0 ? (
                            <p className="text-gray-500 text-center mt-10">No messages yet</p>
                        ) : (
                            messages.map((msg, index) => (
                                <div key={index} className={`flex flex-col ${msg.source === 'user' ? 'items-end' : 'items-start'}`}>
                                    <div className={`px-4 py-2 rounded-lg max-w-xs ${msg.source === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                                        <p>{msg.message}</p>
                                    </div>
                                    <span className="text-xs text-gray-500 mt-1">
                                        {msg.source === 'user' ? 'You' : 'AI'} • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>

                    <form onSubmit={sendMessage} className="p-4 border-t border-gray-200">
                        <div className="flex">
                            <input
                                type="text"
                                value={messageInput}
                                disabled
                                onChange={(e) => setMessageInput(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600"
                            >
                                Send
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

export default InterviewInterface;