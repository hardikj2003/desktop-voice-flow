import { useState, useRef } from "react";
import { createClient, LiveTranscriptionEvents } from "@deepgram/sdk";

export const useTranscription = (apiKey: string) => {
  const [transcription, setTranscription] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const socketRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startRecording = async () => {
    console.log("Checking mediaDevices...", navigator.mediaDevices);
    if (!navigator.mediaDevices) {
      setError(
        "MediaDevices is undefined. This usually means the app is not in a secure context or permissions are missing."
      );
      return;
    }
    setError(null);

    try {
      if (!apiKey) {
        throw new Error(
          "API Key not found. Did you forget to set VITE_DEEPGRAM_API_KEY in your .env file?"
        );
      }

      const stream = await navigator.mediaDevices
        .getUserMedia({ audio: true })
        .catch((err) => {
          if (err.name === "NotAllowedError")
            throw new Error("Microphone access denied.");
          if (err.name === "NotFoundError")
            throw new Error("No microphone found.");
          throw new Error("Could not access microphone.");
        });

      streamRef.current = stream;
      setIsRecording(true);

      const deepgram = createClient(apiKey);
      const connection = deepgram.listen.live({
        model: "nova-2",
        interim_results: true,
        smart_format: true,
      });

      connection.on(LiveTranscriptionEvents.Error, (err) => {
        setError("Transcription error: " + err.message);
        stopRecording();
      });

      connection.on(LiveTranscriptionEvents.Transcript, (data) => {
        const result = data.channel.alternatives[0].transcript;
        if (result) setTranscription((prev) => prev + " " + result);
      });

      socketRef.current = connection;

      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0 && socketRef.current) {
          socketRef.current.send(event.data);
        }
      };

      recorder.start(250);
      mediaRecorderRef.current = recorder;
    } catch (err: any) {
      setError(err.message);
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;

    mediaRecorderRef.current?.stop();
    socketRef.current?.finish();
  };

  return { transcription, isRecording, error, startRecording, stopRecording };
};
