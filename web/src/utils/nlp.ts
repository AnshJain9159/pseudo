import { SummarizationModel } from './mlModel';

interface SentenceScore {
  sentence: string;
  score: number;
}

const model = new SummarizationModel();

export async function summarizeText(text: string): Promise<string> {
  // Split text into sentences
  const sentences = text.split(/[.!?]+/).filter(Boolean);
  
  // Get importance scores from ML model
  const scores = await model.predictSentenceImportance(sentences);
  
  // Combine sentences with their scores
  const scoredSentences: SentenceScore[] = sentences.map((sentence, index) => ({
    sentence,
    score: scores[index]
  }));

  // Select top sentences (30% of original text or at least 3 sentences)
  const topSentences = scoredSentences
    .sort((a, b) => b.score - a.score)
    .slice(0, Math.max(3, Math.ceil(sentences.length * 0.3)))
    .sort((a, b) => sentences.indexOf(a.sentence) - sentences.indexOf(b.sentence));

  return topSentences.map(item => item.sentence.trim()).join('. ') + '.';
}