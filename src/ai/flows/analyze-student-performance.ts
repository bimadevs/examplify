'use server';

/**
 * @fileOverview AI-powered student performance analysis flow.
 *
 * - analyzeStudentPerformance - Analyzes student exam data to identify weaknesses and suggest improvements.
 * - AnalyzeStudentPerformanceInput - The input type for the analyzeStudentPerformance function.
 * - AnalyzeStudentPerformanceOutput - The return type for the analyzeStudentPerformance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeStudentPerformanceInputSchema = z.object({
  studentAnswers: z
    .record(z.string(), z.string())
    .describe('A map of question IDs to student answers.'),
  correctAnswers: z
    .record(z.string(), z.string())
    .describe('A map of question IDs to correct answers.'),
  examQuestions: z.array(z.string()).describe('List of questions on the exam.'),
  studentId: z.string().describe('The ID of the student being analyzed.'),
  teacherInstructions: z.string().optional().describe('Optional instructions from the teacher to guide the analysis.'),
});
export type AnalyzeStudentPerformanceInput = z.infer<typeof AnalyzeStudentPerformanceInputSchema>;

const AnalyzeStudentPerformanceOutputSchema = z.object({
  commonMistakes: z.array(z.string()).describe('Common mistakes made by the student.'),
  areasOfWeakness: z.array(z.string()).describe('Areas where the student needs improvement.'),
  suggestionsForImprovement: z.array(z.string()).describe('Suggestions for how the student can improve.'),
  overallFeedback: z.string().describe('Overall feedback on the student performance.'),
});
export type AnalyzeStudentPerformanceOutput = z.infer<typeof AnalyzeStudentPerformanceOutputSchema>;

export async function analyzeStudentPerformance(
  input: AnalyzeStudentPerformanceInput
): Promise<AnalyzeStudentPerformanceOutput> {
  return analyzeStudentPerformanceFlow(input);
}

const analyzeStudentPerformancePrompt = ai.definePrompt({
  name: 'analyzeStudentPerformancePrompt',
  input: {schema: AnalyzeStudentPerformanceInputSchema},
  output: {schema: AnalyzeStudentPerformanceOutputSchema},
  prompt: `You are an AI assistant that analyzes student exam performance and provides insights to teachers.

  Analyze the student's performance based on their answers and the correct answers provided.
  Identify common mistakes, areas of weakness, and suggestions for improvement.

  Student ID: {{{studentId}}}
  Exam Questions: {{examQuestions}}
  Student Answers: {{studentAnswers}}
  Correct Answers: {{correctAnswers}}
  Teacher Instructions: {{{teacherInstructions}}}

  Here are some things to consider when analyzing student performance:
  - Identify patterns in incorrect answers.
  - Determine which topics the student struggles with the most.
  - Provide actionable suggestions for improvement.

  Output format must follow the following schema descriptions:
  ${AnalyzeStudentPerformanceOutputSchema.description}
  `,
});

const analyzeStudentPerformanceFlow = ai.defineFlow(
  {
    name: 'analyzeStudentPerformanceFlow',
    inputSchema: AnalyzeStudentPerformanceInputSchema,
    outputSchema: AnalyzeStudentPerformanceOutputSchema,
  },
  async input => {
    const {output} = await analyzeStudentPerformancePrompt(input);
    return output!;
  }
);
