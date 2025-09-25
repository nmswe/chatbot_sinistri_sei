# Back-End

## Villains Chat Game

The backend powers the villain chat game by managing villain logic and handling chat interactions through a Next.js API route. It integrates AI for dynamic villain responses and tracks game state server-side.

Note: The backend is stateless — it does not persist chat history or villain state between calls. All state must be supplied by the client.

This project uses **Next.js API routes** and **TypeScript** for type safety and maintainability. 

Villain data and defeat logic are modularized in `lib/`, while the chat API endpoint orchestrates AI-driven conversations and game progression.

---

## API Flow

The backend consists of two main parts:

### 1. Villain Logic (`lib/`)

- **Files:** `Villain.ts`, `VillainService.ts`
- **Purpose:**  
  Encapsulates all villain-related data and logic, making it easy to manage villain states and interactions.

#### a. `Villain.ts`
- Defines the villain model: name, traits and prompt generation.
- Provides methods to format villain data for use in AI prompts (e.g., `toPromptString()`).

#### b. `VillainService.ts`
- Centralizes villain-related operations:
  - `getCurrentVillain(villainState)`: Returns the active villain based on game state.
  - `defeatVillainTool(villainState)`: Supplies logic for villain switching after defeat, used as a tool in AI interactions.

---

### 2. Chat API (`src/app/api/chat/route.ts`)

- **Endpoint:** `/api/chat`
- **Method:** `POST`
- **Purpose:** Handles chat requests, generates villain responses using AI, and manages villain defeat logic.

Because the backend is stateless, each call to /api/chat must include the full messages history and current villainState. The server does not cache or recall earlier conversation state.
#### Workflow

1. **Receive Request:**  
   Accepts a JSON payload with:
   - `messages`: Array of chat messages (user and assistant).
   - `villainState`: Current villain game state.

2. **Determine Villain:**  
   Uses `getCurrentVillain` to select the active villain and generate the system prompt.

3. **Check Defeat Conditions:**  
   Analyzes message history to see if the villain can be defeated (user must reply after villain speaks).

4. **Generate AI Response:**  
   Calls `generateText` (Google Gemini model) with:
   - Villain prompt
   - Conversation history
   - Optional `defeatVillainTool` if defeat conditions are met

5. **Respond:**  
   Returns a JSON object with:
   - New assistant message (if generated)
   - Updated villain state

---

## State & Persistence Overview

| State         | Purpose                                   | Storage      |
|---------------|-------------------------------------------|--------------|
| `messages`    | Chat history                              | Client-side (passed to backend each time) |
| `villainState`| Tracks current villain and defeat status  | Client-side  |

---

## Tech Stack

- Next.js API Routes
- TypeScript
- Google Gemini (via AI SDK)

# Prompt Engineering Choices

## Overview

Prompt engineering is central to the villain chat game’s backend, shaping how AI models respond and interact with users. The design leverages structured villain prompts, example-driven context, and dynamic instructions to guide the Gemini model’s behavior.

---

## Villain-Centric System Prompts

- Each villain is defined in `Villain.ts` with:
  - **Name, description, and instructions**: These are concatenated to form a detailed system prompt via `toPromptString()`.
  - **Examples**: Realistic message exchanges are provided for each villain, illustrating expected dialogue and defeat logic.
  - **Defeat State**: If a villain is marked as defeated, the prompt is dynamically altered to instruct the model to respond in an annoyed manner.

**Example (from `Villain.ts`):**
```typescript
toPromptString(): string {
  return `Il tuo nome è ${this.name} ... ${this.description}. ... ${this.instructions}. Ecco alcuni esempi ... ${this.defeated ? "Sei stato sconfitto in precedenza, quindi ora devi rispondere in modo scocciato" : ""}`;
}
```

---

## Stepwise Instructions

- Each villain’s instructions are broken into clear steps, enforcing:
  - Introduction and persona
  - Multi-turn conversation before posing a challenge
  - Thematic references (e.g., Spider-Man battles)
  - Specific question types (math, zoology, chemistry, etc.)
  - Conditional logic for defeat or continued challenge

This stepwise approach ensures the model maintains game structure and narrative consistency.

---

## Example-Driven Context

- The `examples` array for each villain provides the model with concrete samples of expected user and assistant exchanges.
- These examples help the model understand:
  - Tone and brevity requirements (e.g., <200 characters)
  - How to escalate or resolve a challenge
  - When and how to invoke the defeat tool

---

## Dynamic Tool Integration

- The backend (`src/api/chat/route.ts`) conditionally provides the `defeatVillainTool` to the model only when the user has replied after the villain’s challenge. 
This choice was deliberate because:

    - Allowing for tool calling right from the beginning of the interaction was prone to hallucinations: the model called the tool too early because it felt defeated
    - Giving a stricter condition, like checking for a specific string like, "ti passo al collega" felt too limiting for an LLM user interaction.
- This tool is referenced in villain instructions and examples, teaching the model when to “call” it.

---

## Study Notes Reference

- The approach is inspired by best practices and experiments documented in [`study-notes`](https://github.com/nmswe/chatbot_sinistri_sei/tree/backend/study-notes):
  - **Prompt clarity**: System prompts are explicit about persona, context, and expected behavior.
  - **Few-shot learning**: Examples are used to guide the model’s output style and logic.
  - **Stateful prompts**: The prompt adapts based on game progression (e.g., defeated villains).
  - **Tool use**: Instructions and examples teach the model to use custom tools at the right moment.

---