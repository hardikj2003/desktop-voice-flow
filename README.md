VoiceFlow: Desktop Speech-to-Text
Building a faster, lighter way to capture ideas.
The "Why" behind the Project
Most voice-to-text tools are either buried in web browsers or are heavy, resource-hungry desktop apps. I built VoiceFlow to be a lightweight alternative that stays out of your way. Using Tauri, I was able to create a desktop experience that feels native but uses the modern web stack I'm comfortable with (React + TypeScript).

My Tech Stack
The Skeleton: Tauri — Chosen specifically because I wanted a tiny binary size. Electron apps can be 100MB+; this app stays around 10MB.

The Brains: Deepgram — I used their Nova-2 model because the latency is incredible. It feels like the app is typing as you speak.

The Face: React — For a snappy UI and easy state management.

Architectural Decisions (The "Human" Version)
1. Why Push-to-Talk (PTT)?
I decided on a "Hold-to-Speak" mechanism rather than a simple On/Off toggle.

The Reason: It’s more intentional. It prevents the app from accidentally transcribing background noise or private conversations. It also saves on API costs by only sending audio when the user specifically wants to record.

2. Keeping Audio in the Frontend
I had a choice: process audio in Rust or in JavaScript.

The Reason: I chose JavaScript's MediaRecorder. Passing high-speed audio data from the "web view" to the "Rust backend" can sometimes cause a tiny bit of lag. By connecting the frontend directly to Deepgram’s WebSocket, the transcription feels instant.

3. Respecting Privacy (Hardware Cleanup)
I noticed that sometimes when you stop recording, the little orange "Microphone in use" dot stays on in the taskbar.

The Reason: I added a specific "cleanup" step that manually kills the microphone tracks the moment you let go of the button. It’s a small detail, but it builds trust with the user.

Challenges & Lessons
The "Secure Context" Hurdle: I learned the hard way that modern computers won't let an app touch the microphone unless it's running in a "Secure Context" (like localhost or a signed app). This taught me a lot about desktop security permissions.

TypeScript Rigor: Managing the difference between a MediaStream and a MediaRecorder was a great exercise in understanding how the Web Audio API actually flows.

How I Tested It
I didn't just check if it worked; I tried to break it.

The "Mouse Slip": If I click the button but drag my mouse away and let go, does it keep recording? (Fixed: Added onMouseLeave as a safety net).

The "Silent Treatment": If I hold the button but don't say anything, does the app crash? (Result: It stays stable and waits).

The "Airplane Mode" Test: I cut the Wi-Fi mid-speech to ensure the app gives a clear error message instead of just freezing.
