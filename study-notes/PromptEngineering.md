# Prompt Engineering: some notes

[source](https://youtu.be/SWP3k-24jT4?si=AIfeR1V820vLyEsO)

---

## Introduction

* **Question + Knowledge Base:**
  The LLM (Large Language Model) answers based on a knowledge base.

* **Token Limitations:**
  Tokens limit the resources used in processing:

  * Longer prompts = more tokens
  * Querying the knowledge base = more tokens
  * Complex responses = more tokens

* **Solution - Chunking:**

  * **Chunking** breaks the knowledge base into smaller parts.
  * Retrieve relevant chunks, create a new prompt with the user question and relevant context.

* **Relevance of Chunks:**

  * Each info has a **vector**.
  * Retrieves information from **numerically close vectors** (embeddings).

---

## Prompting Components and Techniques
A good prompt is made of several Component. Each component can provide better result when a suitable prompting technique is used
### 1. **ROLE &rarr; Role Prompting**

* Assign a specific role to the AI. Not just the job title, but also a description of their abilities
* Increases accuracy up to **+25%**.
* Example:
  *“You are a highly qualified beauty store consultant, specializing in selecting the right products for each client’s skin type.”*

### 2. **TASK &rarr; Chain of Thought Prompting**

* Direct the AI with clear, concise, step-by-step instructions.
* Increases accuracy up to **+90%** for complex tasks.

### 3. **SPECIFICS &rarr; Emotion Prompting**

* List the most important notes on HOW to do the task above
* Add emotional stimuli to your prompts for higher accuracy (+115%).
* Example:
  *“Check the database for product availability. If not found, encourage the client to search on their own. Your role is vital and appreciated by the team.”*

### 4. **CONTEXT &rarr; Role + Emotional Prompting**

* Explain the AI's role in the business context with emotional appeal.
* Encourages engagement and higher performance.

### 5. **EXAMPLES &rarr; Few Shot Prompting**

* Provide **4-5 examples** of input-output pairs.
* Too many examples are costly in terms of tokens.

### 6. **NOTES &rarr; Lost in the Middle Effect + Emotional Prompting**

* LLMs perform best with key info at the **start or end** of the prompt.
* Encourage the AI to say **“I don’t know”** to avoid hallucinations.
clist the most important notes on HOW to do the task above
* Be encouraging

---

## Final Considerations

* **Minimize Cost:**

  * Keep prompts as short and concise as possible.
  * Try smaller: start with GPT-3.5, compare with GPT-4o result, and use GPT-4o outputs as examples for the finale GPT-3.5 prompt
* **Temperature Setting:**

  * Keep temperature at **0** for factual answers.
  * Increase temperature for **creative outputs** (higher temperature explores broader contexts).

---