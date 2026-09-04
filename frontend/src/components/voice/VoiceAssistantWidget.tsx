import { useRef, useState, useCallback, useEffect } from 'react'
import { API_BASE_URL } from '../../api/connection'

// ---------------------------------------------------------------------------
// TTS — speak text aloud via backend /api/voice/tts
// ---------------------------------------------------------------------------

let activeAudio: HTMLAudioElement | null = null

export async function speakText(text: string, language: string = 'en'): Promise<void> {
    // Stop any currently playing audio
    if (activeAudio) {
        activeAudio.pause()
        activeAudio = null
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/voice/tts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, language }),
        })

        if (!response.ok) {
            throw new Error(`TTS API Error: ${response.status}`)
        }

        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        const audio = new Audio(url)
        activeAudio = audio
        await audio.play()
        audio.onended = () => {
            URL.revokeObjectURL(url)
            if (activeAudio === audio) activeAudio = null
        }
    } catch (error) {
        console.error('[TTS] Failed to speak text:', error)
        throw error
    }
}

// ---------------------------------------------------------------------------
// SpeakerButton — small icon button for assistant responses
// ---------------------------------------------------------------------------

type SpeakerButtonProps = {
    text: string
    language?: string
    className?: string
}

export function SpeakerButton({ text, language = 'en', className = '' }: SpeakerButtonProps) {
    const [isPlaying, setIsPlaying] = useState(false)

    const handleSpeak = async () => {
        if (isPlaying) {
            // Stop playback
            if (activeAudio) {
                activeAudio.pause()
                activeAudio = null
            }
            setIsPlaying(false)
            return
        }

        setIsPlaying(true)
        try {
            await speakText(text, language)
        } catch {
            // Ignore — user sees the button state reset
        } finally {
            setIsPlaying(false)
        }
    }

    return (
        <button
            type="button"
            onClick={handleSpeak}
            className={`rounded-lg border p-1.5 transition-colors ${isPlaying ? 'border-brand-primary/40 bg-brand-primary/10 text-brand-primary' : 'border-transparent hover:border-border hover:bg-surface-elevated hover:text-text-primary'} ${className}`}
            title={isPlaying ? 'Stop playback' : 'Listen to response'}
            aria-label={isPlaying ? 'Stop audio playback' : 'Listen to response aloud'}
        >
            <span className="material-symbols-outlined text-[17px]">
                {isPlaying ? 'stop' : 'volume_up'}
            </span>
        </button>
    )
}

// ---------------------------------------------------------------------------
// VoiceAssistantWidget — MediaRecorder → STT → transcribed text
// ---------------------------------------------------------------------------

type VoiceAssistantWidgetProps = {
    onTranscribed: (text: string) => void
    disabled?: boolean
    className?: string
}

export default function VoiceAssistantWidget({
    onTranscribed,
    disabled = false,
    className = '',
}: VoiceAssistantWidgetProps) {
    const [isRecording, setIsRecording] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const mediaRecorderRef = useRef<MediaRecorder | null>(null)
    const chunksRef = useRef<Blob[]>([])

    const stopRecording = useCallback(() => {
        const recorder = mediaRecorderRef.current
        if (recorder && recorder.state !== 'inactive') {
            recorder.stop()
        }
    }, [])

    const handleTranscribe = useCallback(async (audioBlob: Blob) => {
        setIsProcessing(true)
        setError(null)

        try {
            const formData = new FormData()
            formData.append('audio', audioBlob, 'recording.webm')

            const response = await fetch(`${API_BASE_URL}/api/voice/stt`, {
                method: 'POST',
                body: formData,
            })

            if (!response.ok) {
                throw new Error(`STT API Error: ${response.status}`)
            }

            const result = await response.json()
            if (result.text && result.text.trim()) {
                onTranscribed(result.text.trim())
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err))
            console.error('[STT] Transcription failed:', err)
        } finally {
            setIsProcessing(false)
        }
    }, [onTranscribed])

    const handleToggleRecording = useCallback(() => {
        if (isRecording) {
            stopRecording()
            return
        }

        if (!navigator.mediaDevices?.getUserMedia) {
            setError('Voice recording is not supported in this browser.')
            return
        }

        setError(null)
        chunksRef.current = []

        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' })
                mediaRecorderRef.current = recorder

                recorder.ondataavailable = (e: BlobEvent) => {
                    if (e.data && e.data.size > 0) {
                        chunksRef.current.push(e.data)
                    }
                }

                recorder.onstop = () => {
                    const mimeType = recorder.mimeType || 'audio/webm'
                    const audioBlob = new Blob(chunksRef.current, { type: mimeType })
                    stream.getTracks().forEach(track => track.stop())
                    setIsRecording(false)
                    if (audioBlob.size > 0) {
                        handleTranscribe(audioBlob)
                    }
                }

                recorder.onerror = () => {
                    stream.getTracks().forEach(track => track.stop())
                    setIsRecording(false)
                    setError('Recording failed. Please try again.')
                }

                recorder.start(1000) // 1s chunks
                setIsRecording(true)
            })
            .catch(() => {
                setError('Microphone access denied. Please allow microphone permission.')
            })
    }, [isRecording, stopRecording, handleTranscribe])

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
                mediaRecorderRef.current.stop()
            }
        }
    }, [])

    const buttonClass = isRecording
        ? 'text-red-400 bg-red-400/10 animate-pulse'
        : isProcessing
            ? 'text-brand-primary bg-brand-primary/10 animate-pulse'
            : 'text-text-muted hover:text-text-primary hover:bg-surface-hover'

    return (
        <div className="relative">
            <button
                type="button"
                onClick={handleToggleRecording}
                disabled={disabled || isProcessing}
                className={`p-2 rounded-xl transition-colors ${buttonClass} ${className}`}
                title={isRecording ? 'Stop recording' : isProcessing ? 'Transcribing…' : 'Voice input (Hindi / English)'}
                aria-label={isRecording ? 'Stop recording' : 'Start voice input'}
            >
                <span className="material-symbols-outlined text-[20px]">
                    {isRecording ? 'mic' : isProcessing ? 'hourglass_empty' : 'mic'}
                </span>
            </button>
            {error && (
                <div className="absolute bottom-full left-0 mb-1 z-50 max-w-[240px] rounded-lg bg-red-500/10 border border-red-500/30 px-2 py-1 text-[11px] text-red-400 whitespace-normal">
                    {error}
                </div>
            )}
        </div>
    )
}