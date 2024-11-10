import * as tf from '@tensorflow/tfjs';

export class SummarizationModel {
  private model: tf.LayersModel | null = null;
  private readonly vocabSize = 10000;
  private readonly maxLength = 500;

  async initialize() {
    // Create a simple sequence model for text classification
    this.model = tf.sequential({
      layers: [
        tf.layers.embedding({
          inputDim: this.vocabSize,
          outputDim: 32,
          inputLength: this.maxLength,
        }),
        tf.layers.globalAveragePooling1d({}),
        tf.layers.dense({ units: 64, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.5 }),
        tf.layers.dense({ units: 1, activation: 'sigmoid' }),
      ],
    });

    this.model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'binaryCrossentropy',
      metrics: ['accuracy'],
    });
  }

  private preprocessText(text: string): number[] {
    // Simple preprocessing: convert to lowercase and split into words
    const words = text.toLowerCase().split(/\s+/);
    
    // Create a basic numerical encoding (hash-based)
    return words.map(word => 
      Math.abs(this.hashCode(word) % this.vocabSize)
    ).slice(0, this.maxLength);
  }

  private hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash;
  }

  private padSequence(sequence: number[]): number[] {
    if (sequence.length >= this.maxLength) {
      return sequence.slice(0, this.maxLength);
    }
    return [...sequence, ...new Array(this.maxLength - sequence.length).fill(0)];
  }

  async predictSentenceImportance(sentences: string[]): Promise<number[]> {
    if (!this.model) {
      await this.initialize();
    }

    const encodedSentences = sentences.map(sentence => {
      const encoded = this.preprocessText(sentence);
      return this.padSequence(encoded);
    });

    const tensorInput = tf.tensor2d(encodedSentences, [sentences.length, this.maxLength]);
    const predictions = await (this.model as tf.LayersModel).predict(tensorInput) as tf.Tensor;
    const scores = await predictions.data();
    
    tensorInput.dispose();
    predictions.dispose();

    return Array.from(scores);
  }
}