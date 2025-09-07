# LLMs: a deep dive

[source](https://youtu.be/7xTGNNLPyMI?si=r_RjJPyv6WOnt_dA)

---

## PRETRAINING
### Preprocessing the Internet

To train a model, you first need high-quality data. One way to obtain it (e.g., via **FineWeb**) is:

* Crawl the web, removing malware, marketing, and adult content sites → keep HTML pages
* Extract the **content** of those pages
* Filter by language (e.g., keep pages with ≥ 65% English)
* Filter out info you don't want or need i.e. sensitive data

**Result:** a dataset of usable text.
---
### Tokenizazion and chunking
Raw text is just a wall of words. To make sense of it, you use pattern recognition.

1. Convert text to bits (e.g., UTF-8), grouped into bytes → 256 unique symbols
2. Find frequently occurring consecutive bytes and merge them into new symbols
3. Repeat until you have a compact representation

Modern models like GPT-4o use about **100,000 tokens**, each representing a common sequence of text.

[Convert text to tokens here](https://tiktokenizer.vercel.app/)
---
## TRAINING
Training involves more pattern recognition.

* You slide a **window** of consecutive symbols over the tokens (from size 0 to a max, limited by computational complexity)
* The model learns to **predict the next token**, adjusting probabilities with each iteration
* Initially random, the model improves by adjusting predictions to better match the dataset

Eventually, you get a **base model** — essentially an internet text simulator.

🔗 [Fun to look at: Karpathy’s GPT-2 reproduction](https://github.com/karpathy/llm.c/discussions/677)

## POST-TRANING: SUPERVISED FINETUNING
Now, train the base model on **conversations** — simulating the desired behavior of a helpful, truthful, and harmless assistant.

* Experts guide the process by **correcting** base model answers
---
### Hallucinations
Models often **make things up** when uncertain, mimicking patterns without knowledge.
**How is it mitigated?**

1. **"I don’t know" answers:**

   * Train on Q\&A from articles
   * When the model gives incorrect answers, train it to say “I don’t know”
   * It learns to respond cautiously in similar uncertain cases

2. **Tool use:**

   * **Web search:** look things up, pull context into memory, and combine with training knowledge
   * **Code interpreter:** convert input to code (e.g., Python) and compute the answer — useful for math, logic, spelling, etc.

**Result:** a Supervised Fine-Tuned model.

---

## POST-TRAINING: REINFORCEMENT LEARNING
You give the SFT model **problems with known answers** and train it on **the best solutions** — ones that are both correct and high-quality (e.g., concise).

This is harder: the model has to **develop its own reasoning**, different from mimicking humans.

**Analogy:**

* **Base model:** learns from textbooks
* **SFT model:** learns from worked examples
* **RL model:** solves problems with only answers (no steps)

This phase is still **experimental**. Its complexity kept it under wraps — until **DeepSeek** brought it into the open.

## POST-TRAINING: REINFORCEMENT LEARNING FROM HUMAN FEEDBACK

What about open-ended tasks like *"Write me a funny pelican joke"*?
* Ideally, humans would **rank all responses** — but that doesn’t scale
* Instead:

  * Humans score a **small subset** of outputs
  * A new model learns to **simulate** this human scoring
  * That scorer then ranks the rest of the outputs
You **can’t iterate indefinitely** — adversarial examples emerge: meaningless inputs that trick the scorer into giving high marks.

Manually fixing them doesn’t scale, either — they’re too many.

---
