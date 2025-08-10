/**
 * Test file for AI question generation training
 * Use this to test and validate the training system
 */

import { QuestionTrainingManager, QuestionGenerationConfig } from './training-config';
import { testQuestionGeneration } from '../flows/generate-exam-questions-enhanced';

// Test configurations for different scenarios
export const TEST_CONFIGS: QuestionGenerationConfig[] = [
  {
    subject: 'matematika',
    gradeLevel: 'smp',
    difficulty: 'mudah',
    questionCount: 2,
    topic: 'Aljabar Dasar'
  },
  {
    subject: 'fisika',
    gradeLevel: 'sma',
    difficulty: 'sedang',
    questionCount: 1,
    topic: 'Gerak Lurus'
  },
  {
    subject: 'bahasa-indonesia',
    gradeLevel: 'smp',
    difficulty: 'sedang',
    questionCount: 1,
    topic: 'Pemahaman Teks'
  }
];

/**
 * Test prompt generation
 */
export function testPromptGeneration() {
  console.log('=== TESTING PROMPT GENERATION ===\n');
  
  TEST_CONFIGS.forEach((config, index) => {
    console.log(`Test ${index + 1}: ${config.subject} - ${config.gradeLevel} - ${config.difficulty}`);
    console.log('Generated Prompt:');
    console.log('-'.repeat(50));
    
    const prompt = QuestionTrainingManager.buildPrompt(config);
    console.log(prompt.substring(0, 800) + '...\n');
    
    console.log('='.repeat(80) + '\n');
  });
}

/**
 * Test training examples retrieval
 */
export function testTrainingExamples() {
  console.log('=== TESTING TRAINING EXAMPLES ===\n');
  
  const subjects = ['matematika', 'fisika', 'bahasa-indonesia', 'biologi'];
  const gradeLevels = ['sd', 'smp', 'sma'];
  
  subjects.forEach(subject => {
    console.log(`Subject: ${subject}`);
    gradeLevels.forEach(gradeLevel => {
      const examples = QuestionTrainingManager.getRelevantExamples(subject, gradeLevel);
      console.log(`  ${gradeLevel}: ${examples.length} examples`);
      
      if (examples.length > 0) {
        console.log(`    Sample: ${examples[0].question.substring(0, 100)}...`);
      }
    });
    console.log();
  });
}

/**
 * Test question validation
 */
export function testQuestionValidation() {
  console.log('=== TESTING QUESTION VALIDATION ===\n');
  
  // Valid question example
  const validQuestion = {
    question: "Berapa hasil dari 2 + 3?",
    options: ["A. 4", "B. 5", "C. 6", "D. 7"],
    correct_answer: "B",
    explanation: "2 + 3 = 5",
    difficulty: "mudah",
    bloom_taxonomy: "menerapkan",
    subject: "matematika",
    grade_level: "sd"
  };
  
  // Invalid question examples
  const invalidQuestions = [
    {
      ...validQuestion,
      options: ["A. 4", "B. 5", "C. 6"] // Missing one option
    },
    {
      ...validQuestion,
      correct_answer: "E" // Invalid answer
    },
    {
      ...validQuestion,
      options: ["4", "5", "6", "7"] // Wrong format
    }
  ];
  
  console.log('Valid Question Test:');
  const validResult = QuestionTrainingManager.validateQuestion(validQuestion);
  console.log(`Valid: ${validResult.isValid}`);
  console.log(`Errors: ${validResult.errors.join(', ')}\n`);
  
  invalidQuestions.forEach((question, index) => {
    console.log(`Invalid Question Test ${index + 1}:`);
    const result = QuestionTrainingManager.validateQuestion(question);
    console.log(`Valid: ${result.isValid}`);
    console.log(`Errors: ${result.errors.join(', ')}\n`);
  });
}

/**
 * Test full AI generation (requires AI to be running)
 */
export async function testAIGeneration() {
  console.log('=== TESTING AI GENERATION ===\n');
  
  const testConfig = TEST_CONFIGS[0]; // Use first test config
  
  try {
    console.log('Testing AI generation with config:', testConfig);
    const result = await testQuestionGeneration(testConfig);
    
    console.log('\nGeneration Results:');
    console.log(`Total Generated: ${result.metadata.totalGenerated}`);
    console.log(`Quality Score: ${result.metadata.qualityScore}`);
    console.log(`Processing Time: ${result.metadata.processingTime}ms`);
    
    if (result.questions.length > 0) {
      console.log('\nSample Generated Question:');
      console.log(JSON.stringify(result.questions[0], null, 2));
    }
    
  } catch (error) {
    console.error('AI Generation Test Failed:', error);
  }
}

/**
 * Run all tests
 */
export async function runAllTests() {
  console.log('🧪 STARTING AI TRAINING TESTS\n');
  
  testPromptGeneration();
  testTrainingExamples();
  testQuestionValidation();
  
  // Uncomment to test AI generation (requires AI service to be running)
  // await testAIGeneration();
  
  console.log('✅ ALL TESTS COMPLETED');
}

// Export individual test functions for selective testing
export {
  testPromptGeneration,
  testTrainingExamples,
  testQuestionValidation,
  testAIGeneration
};

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests().catch(console.error);
}