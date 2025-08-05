// Implemented the GenerateExamQuestions flow to generate exam questions based on a specified topic.

'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating exam questions based on a specific topic or learning objective.
 *
 * generateExamQuestions - A function that takes a topic and number of questions as input and returns a set of exam questions.
 * GenerateExamQuestionsInput - The input type for the generateExamQuestions function, including topic and number of questions.
 * GenerateExamQuestionsOutput - The output type for the generateExamQuestions function, which is an array of questions.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateExamQuestionsInputSchema = z.object({
  topic: z.string().describe('The topic or learning objective for the exam questions.'),
  numQuestions: z
    .number()
    .int()
    .min(1)
    .max(20)
    .default(5)
    .describe('The number of exam questions to generate. Must be between 1 and 20.'),
});
export type GenerateExamQuestionsInput = z.infer<typeof GenerateExamQuestionsInputSchema>;

const GenerateExamQuestionsOutputSchema = z.array(
  z.object({
    question: z.string().describe('The text of the exam question.'),
    options: z.array(z.string()).describe('The possible answer options for the question.'),
    correctAnswerIndex: z
      .number()
      .int()
      .min(0)
      .describe('The index of the correct answer in the options array.'),
  })
);
export type GenerateExamQuestionsOutput = z.infer<typeof GenerateExamQuestionsOutputSchema>;

export async function generateExamQuestions(input: GenerateExamQuestionsInput): Promise<GenerateExamQuestionsOutput> {
  return generateExamQuestionsFlow(input);
}

const generateExamQuestionsPrompt = ai.definePrompt({
  name: 'generateExamQuestionsPrompt',
  input: {schema: GenerateExamQuestionsInputSchema},
  output: {schema: GenerateExamQuestionsOutputSchema},
  prompt: `You are an expert teacher creating an exam on the topic of {{{topic}}}.

  Create {{{numQuestions}}} multiple-choice questions for this exam. Each question should have 4 answer options, one of which is correct.  Indicate the index of the correct answer in the options array, which starts at 0.

  Your response should be a JSON array of question objects structured as follows:
  [
    {
      "question": "The text of the question",
      "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
      "correctAnswerIndex": 0
    }
  ]
  `,
});

const generateExamQuestionsFlow = ai.defineFlow(
  {
    name: 'generateExamQuestionsFlow',
    inputSchema: GenerateExamQuestionsInputSchema,
    outputSchema: GenerateExamQuestionsOutputSchema,
  },
  async input => {
    const {output} = await generateExamQuestionsPrompt(input);
    return output!;
  }
);
