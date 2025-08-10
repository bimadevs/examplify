/**
 * Enhanced AI flow for generating exam questions using training data
 */

import { defineFlow, runFlow } from '@genkit-ai/flow';
import { gemini20Flash } from '@genkit-ai/googleai';
import { z } from 'zod';
import { 
  QuestionGenerationConfig, 
  GeneratedQuestion, 
  QuestionTrainingManager,
  DEFAULT_TRAINING_CONFIG 
} from '../training/training-config';

// Input schema for question generation
const QuestionGenerationInput = z.object({
  subject: z.string().describe('Mata pelajaran (matematika, fisika, dll)'),
  gradeLevel: z.enum(['sd', 'smp', 'sma']).describe('Tingkat pendidikan'),
  difficulty: z.enum(['mudah', 'sedang', 'sulit']).describe('Tingkat kesulitan'),
  questionCount: z.number().min(1).max(20).describe('Jumlah soal yang akan dibuat'),
  topic: z.string().optional().describe('Topik spesifik (opsional)'),
  bloomTaxonomy: z.array(z.string()).optional().describe('Level taksonomi Bloom yang diinginkan')
});

// Output schema for generated questions
const GeneratedQuestionSchema = z.object({
  question: z.string().describe('Pertanyaan lengkap'),
  options: z.array(z.string()).length(4).describe('4 pilihan jawaban (A, B, C, D)'),
  correct_answer: z.enum(['A', 'B', 'C', 'D']).describe('Jawaban yang benar'),
  explanation: z.string().describe('Penjelasan mengapa jawaban tersebut benar'),
  difficulty: z.enum(['mudah', 'sedang', 'sulit']).describe('Tingkat kesulitan soal'),
  bloom_taxonomy: z.string().describe('Level taksonomi Bloom'),
  subject: z.string().describe('Mata pelajaran'),
  grade_level: z.string().describe('Tingkat kelas'),
  topic: z.string().optional().describe('Topik soal')
});

const QuestionGenerationOutput = z.object({
  questions: z.array(GeneratedQuestionSchema).describe('Array soal yang dihasilkan'),
  metadata: z.object({
    totalGenerated: z.number().describe('Total soal yang berhasil dibuat'),
    qualityScore: z.number().describe('Skor kualitas rata-rata'),
    processingTime: z.number().describe('Waktu pemrosesan dalam ms'),
    config: z.any().describe('Konfigurasi yang digunakan')
  })
});

export const generateExamQuestionsEnhanced = defineFlow(
  {
    name: 'generateExamQuestionsEnhanced',
    inputSchema: QuestionGenerationInput,
    outputSchema: QuestionGenerationOutput,
  },
  async (input) => {
    const startTime = Date.now();
    
    try {
      // Build configuration
      const config: QuestionGenerationConfig = {
        subject: input.subject,
        gradeLevel: input.gradeLevel,
        difficulty: input.difficulty,
        questionCount: input.questionCount,
        topic: input.topic,
        bloomTaxonomy: input.bloomTaxonomy
      };
      
      // Generate custom prompt using training data
      const customPrompt = QuestionTrainingManager.buildPrompt(config);
      
      console.log('Generated prompt for AI:', customPrompt.substring(0, 500) + '...');
      
      // Generate questions using AI
      const response = await gemini20Flash.generate({
        prompt: customPrompt,
        config: {
          temperature: DEFAULT_TRAINING_CONFIG.temperature,
          topP: DEFAULT_TRAINING_CONFIG.topP,
          maxOutputTokens: 4000,
        },
      });
      
      let generatedQuestions: GeneratedQuestion[] = [];
      let qualityScores: number[] = [];
      
      try {
        // Parse AI response
        const aiResponse = response.text();
        console.log('AI Response:', aiResponse);
        
        // Try to extract JSON from response
        let questionsData;
        if (aiResponse.includes('[') && aiResponse.includes(']')) {
          // Response contains array
          const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);
          if (jsonMatch) {
            questionsData = JSON.parse(jsonMatch[0]);
          }
        } else if (aiResponse.includes('{')) {
          // Single question or object response
          const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            questionsData = Array.isArray(parsed) ? parsed : [parsed];
          }
        }
        
        if (!questionsData) {
          throw new Error('Could not parse AI response as JSON');
        }
        
        // Process and validate each question
        for (const questionData of questionsData) {
          const question: GeneratedQuestion = {
            question: questionData.question || '',
            options: questionData.options || [],
            correct_answer: questionData.correct_answer || 'A',
            explanation: questionData.explanation || '',
            difficulty: questionData.difficulty || input.difficulty,
            bloom_taxonomy: questionData.bloom_taxonomy || 'memahami',
            subject: input.subject,
            grade_level: input.gradeLevel,
            topic: input.topic
          };
          
          // Validate question quality
          const validation = QuestionTrainingManager.validateQuestion(question);
          
          if (validation.isValid) {
            generatedQuestions.push(question);
            qualityScores.push(1.0); // Perfect score for valid questions
          } else {
            console.warn('Question validation failed:', validation.errors);
            // Try to fix common issues automatically
            const fixedQuestion = await attemptQuestionFix(question, validation.errors);
            if (fixedQuestion) {
              generatedQuestions.push(fixedQuestion);
              qualityScores.push(0.8); // Lower score for fixed questions
            }
          }
        }
        
      } catch (parseError) {
        console.error('Error parsing AI response:', parseError);
        
        // Fallback: try to generate questions with a simpler approach
        const fallbackQuestions = await generateFallbackQuestions(config);
        generatedQuestions = fallbackQuestions;
        qualityScores = fallbackQuestions.map(() => 0.6); // Lower quality score for fallback
      }
      
      // Calculate metrics
      const processingTime = Date.now() - startTime;
      const averageQualityScore = qualityScores.length > 0 
        ? qualityScores.reduce((a, b) => a + b, 0) / qualityScores.length 
        : 0;
      
      return {
        questions: generatedQuestions,
        metadata: {
          totalGenerated: generatedQuestions.length,
          qualityScore: averageQualityScore,
          processingTime,
          config
        }
      };
      
    } catch (error) {
      console.error('Error in generateExamQuestionsEnhanced:', error);
      
      // Return empty result with error info
      return {
        questions: [],
        metadata: {
          totalGenerated: 0,
          qualityScore: 0,
          processingTime: Date.now() - startTime,
          config: input
        }
      };
    }
  }
);

/**
 * Attempt to fix common question issues automatically
 */
async function attemptQuestionFix(
  question: GeneratedQuestion, 
  errors: string[]
): Promise<GeneratedQuestion | null> {
  let fixedQuestion = { ...question };
  
  // Fix option formatting
  if (errors.some(e => e.includes('harus dimulai dengan'))) {
    fixedQuestion.options = fixedQuestion.options.map((option, index) => {
      const prefix = ['A. ', 'B. ', 'C. ', 'D. '][index];
      const text = option.replace(/^[A-D]\.\s*/, '');
      return prefix + text;
    });
  }
  
  // Ensure correct answer is valid
  if (!['A', 'B', 'C', 'D'].includes(fixedQuestion.correct_answer)) {
    fixedQuestion.correct_answer = 'A'; // Default to A
  }
  
  // Validate the fixed question
  const validation = QuestionTrainingManager.validateQuestion(fixedQuestion);
  return validation.isValid ? fixedQuestion : null;
}

/**
 * Generate fallback questions when AI parsing fails
 */
async function generateFallbackQuestions(
  config: QuestionGenerationConfig
): Promise<GeneratedQuestion[]> {
  // Get relevant examples from training data
  const examples = QuestionTrainingManager.getRelevantExamples(
    config.subject, 
    config.gradeLevel
  );
  
  if (examples.length === 0) {
    return [];
  }
  
  // Return modified examples as fallback
  return examples.slice(0, Math.min(config.questionCount, examples.length)).map(example => ({
    ...example,
    subject: config.subject,
    grade_level: config.gradeLevel,
    topic: config.topic
  }));
}

// Export helper function for testing
export async function testQuestionGeneration(config: QuestionGenerationConfig) {
  return await runFlow(generateExamQuestionsEnhanced, config);
}