# VoiceFlow: Desktop Speech-to-Text  
**Building a faster, lighter way to capture ideas**

---

## The “Why” Behind the Project

Most voice-to-text tools are either:
- Buried inside web browsers, or  
- Heavy, resource-hungry desktop applications  

I built **VoiceFlow** as a lightweight alternative that stays out of your way.

By using **Tauri**, I was able to create a desktop experience that feels native while still relying on the modern web stack I’m most productive with (**React + TypeScript**).

---

## Tech Stack

### The Skeleton — **Tauri**
Chosen for its tiny binary size.

- Electron apps: **100MB+**
- VoiceFlow: **~10MB**

This keeps the app fast, portable, and memory-efficient.

### The Brains — **Deepgram**
- Model used: **Nova-2**
- Reason: **Ultra-low latency**

It feels like the app is typing **as you speak**, not after.

### The Face — **React**
- Snappy UI
- Simple state management
- Rapid iteration

---

## Architectural Decisions (The “Human” Version)

### 1. Why Push-to-Talk (PTT)?

Instead of a simple On/Off toggle, I went with a **Hold-to-Speak** mechanism.

**Reasoning:**
- More intentional usage
- Prevents accidental transcription
- Avoids background or private conversations
- Reduces API costs by sending audio only when needed

---

### 2. Keeping Audio in the Frontend

I had two options:
- Process audio in **Rust**
- Process audio in **JavaScript**

I chose **JavaScript’s MediaRecorder**.

**Reasoning:**
- Passing high-frequency audio data from WebView → Rust can introduce small delays
- Connecting the frontend directly to Deepgram’s **WebSocket** makes transcription feel instant

---

### 3. Respecting Privacy (Hardware Cleanup)

Sometimes, after stopping recording, the system still shows:
> “Microphone in use”

**Solution:**
- Added a manual cleanup step
- Explicitly stop and kill microphone tracks when the button is released

**Why it matters:**
- Builds user trust
- Makes app behavior transparent
- Respects privacy expectations

---

## Challenges & Lessons Learned

### The “Secure Context” Hurdle
Modern systems won’t allow microphone access unless the app runs in a **secure context**:
- `localhost`
- HTTPS
- Signed desktop application

This was a valuable lesson in desktop security and permission models.

---

### TypeScript Rigor
Handling the difference between:
- `MediaStream`
- `MediaRecorder`

forced a deeper understanding of:
- Web Audio API flow
- Strong typing
- Real-time audio lifecycle

---

## How I Tested It

I didn’t just test if it worked — I tried to **break it**.

### The “Mouse Slip” Test
**Scenario:**  
Click the button, drag the mouse away, release.

**Fix:**  
- Added `onMouseLeave` as a safety net  
- Recording stops reliably

---

### The “Silent Treatment”
**Scenario:**  
Hold the button but don’t speak.

**Result:**  
- App stays stable
- Waits patiently
- No crashes

---

### The “Airplane Mode” Test
**Scenario:**  
Turn off Wi-Fi mid-speech.

**Result:**  
- Clear error message
- No freezing
- Graceful failure

---

## Final Thoughts

VoiceFlow is intentionally simple:## Setup & Installation

Follow these steps to run VoiceFlow locally.

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/voiceflow.git
cd voiceflow
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set Up Environment Variables
```bash
VITE_DEEPGRAM_API_KEY=your_key_here
```
### 4. Run in Development Mode
```bash
npm run tauri dev
```

###THANK YOU


