export function getRagPrompt(
  contextString,
  question,
) {
  return `You are a helpful assistant. Answer the user's question based ONLY on the provided context. If the context doesn't contain the answer, inform the user.

Context:
---
${contextString}
---

Question: ${question}
Answer:`;
}


export function combineDocuments(docs) {
  return docs.map((doc) => doc.content).join('\n\n---\n\n');
}