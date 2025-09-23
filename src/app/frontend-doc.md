# Front-End

## Villains Chat Game

A React/Next.js interactive chat game where the user battles a series of villains through a chat interface. The app has an intro, main gameplay with chat, soundtracks, animations, and an outro sequence.

This project was developed with **Next.js** and **TypeScript**.  
The choice of **Next.js** was motivated by the fact that it is a **full-stack framework**, providing a complete infrastructure for building modern and scalable web applications.  
**TypeScript** was adopted to have static typing, reduce development errors, and make the code more maintainable.  
Next.js also allows for **instant deployment on Vercel**, optimizing performance and distribution.

---

## App Flow

The app has **three main phases**:

### 1. Intro
- Displayed only if the user hasn’t completed the game before (`dontRestart` flag).
- Shows a loading screen (`Loader`) → welcome screen (`WelcomeScreen`) → scene player (`Intro` component).
- Automatically advances through phrases and background audio.
- Once finished, triggers `onFinish()` to start the main chat experience.

---

### 2. Main Chat Experience
- **Component:** `ChatBot`
- **State:**
  - `messages`: stores chat history.
  - `villainState`: tracks which villain is active and how many defeated.
  - `dontRestart`: tracks whether the intro should be skipped on reload.
- **Features:**
  - User types messages in `ChatInput`.
  - Villains respond via `useChat` custom hook.
  - Villain soundtrack plays based on the current villain.
  - **Spiderman animation** triggers briefly whenever a new villain appears.
  - The `Reset` button allows the user to restart the game from scratch.
- **Persistence:** All chat state and villain progression is saved in `localStorage`.

---

### 3. Outro
- Displayed when all villains are defeated (`villainState.defeatCounter === 6`).
- **Component:** `Outro`
- Shows a series of scenes with images, phrases, and audio.
- Plays automatically with timed phrases.
- Once finished, sets `dontRestart` to `true` to skip the intro on future visits.

---

## State & Persistence Overview

| State               | Purpose                                                                 | Storage         |
|--------------------|-------------------------------------------------------------------------|----------------|
| `messages`         | Chat history                                                           | localStorage   |
| `villainState`     | Tracks current villain and defeated count                               | localStorage   |
| `dontRestart`      | Determines if intro should be skipped                                   | localStorage   |
| `showAfterIntro`   | Shows main chat after intro is done                                      | in-memory      |
| `showOutro`        | Shows outro sequence after all villains defeated                         | in-memory      |

---

## Key Hooks

- `useChat`
  - Manages chat messages and villain state.
  - Persists state to `localStorage`.
  - Handles sending user messages and updating villain state.
- `useEffect` in `Home`
  - Restores state from `localStorage` on mount.
  - Controls whether to show intro, main chat, or outro.

---

## Gameplay Flow Summary

1. User opens the app → Intro plays (unless `dontRestart` is true).
2. Intro finishes → Main Chat experience starts.
3. User chats with villains → Villain responses are streamed via `useChat`.
4. Villain-specific soundtrack plays.
5. Spiderman animation shows on new villain.
6. When all villains are defeated → Outro sequence plays.
7. Outro completes → `dontRestart` set to true → Intro skipped next visit.
8. User can hit **Reset** to clear progress and start over.

---

## Audio & Animations

- **Villain Soundtracks:** Controlled by `soundtrackMap` in `ChatBot`, loops during villain encounter.
- **Spiderman Lottie:** Triggered when a new villain appears, lasts 2 seconds.
- **Intro & Outro:** Scene audio and timed phrases automatically advance using `setInterval` and `setTimeout`.

---

## Reset Functionality

- The **Reset** button clears:
  - Messages
  - Villain progression
  - `dontRestart` flag
  - LocalStorage keys: `messages`, `villainState`, `dontRestart`
- Resets the app to initial state, allowing the intro to play again.

---

## Tech Stack

- Next.js (React 18)
- TypeScript
- Tailwind CSS
- React Hot Toast (for notifications)
- Lottie (for Spiderman animation)
