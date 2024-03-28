import React, { useState } from 'react';
import QuestionCard from './QuestionCard';

interface Answer {
  id: string;
  text: string;
}

interface Question {
  id: string;
  question: string;
  answers: Answer[];
  loading: boolean;
}

interface QuizInfo {
  testName: string;
  numberOfQuestions: number;
  difficulty: string;
  lastEdited: string;
}

const QuizSolver: React.FC = () => {
  const [isFinished, setIsFinished] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<{[key: string]: string}>({});
  const [result, setResult] = useState<string | null>(null);

  const handleSelectAnswer = (questionId: string, answerId: string) => {
    setSelectedAnswers(prev => ({...prev, [questionId]: answerId}));
  };

  const handleFinishTest = () => {
    setIsFinished(true);
    let correctCount = questions.reduce((count, question) => {
      if (selectedAnswers[question.id] === question.answers[0].id) {
        return count + 1;
      }
      return count;
    }, 0);
    setResult(`${correctCount} correct out of ${questions.length}`);
  };

  const questions: Question[] = [
    {
      id: '1',
      question: 'What do (z_1)² and (z_2)² represent in the context of the neural network?',
      answers: [
        { id: '1', text: "The input and output of the activation function" },
        { id: '2', text: "The input and output of the activation function The input and output of the activation function" },
        { id: '3', text: "The input and output of the activation function" },
        { id: '4', text: "The input and output of the activation function" }
      ],
      loading: false,
    },
    {
      id: '2',
      question: 'What do (z_1)² and (z_2)² represent in the context of the neural network?',
      answers: [
        { id: '1', text: "The input and output of the activation function" },
        { id: '2', text: "The input and output of the activation function The input and output of the activation function" },
        { id: '3', text: "The input and output of the activation function" },
        { id: '4', text: "The input and output of the activation function" }
      ],
      loading: false,
    },
    {
      id: '3',
      question: 'What do (z_1)² and (z_2)² represent in the context of the neural network?',
      answers: [
        { id: '1', text: "The input and output of the activation function" },
        { id: '2', text: "The input and output of the activation function The input and output of the activation function" },
        { id: '3', text: "The input and output of the activation function" },
        { id: '4', text: "The input and output of the activation function" }
      ],
      loading: false,
    },
    {
      id: '4',
      question: 'What do (z_1)² and (z_2)² represent in the context of the neural network?',
      answers: [
        { id: '1', text: "The input and output of the activation function" },
        { id: '2', text: "The input and output of the activation function The input and output of the activation function" },
        { id: '3', text: "The input and output of the activation function" },
        { id: '4', text: "The input and output of the activation function" }
      ],
      loading: false,
    },
    {
      id: '5',
      question: 'What do (z_1)² and (z_2)² represent in the context of the neural network?',
      answers: [
        { id: '1', text: "The input and output of the activation function" },
        { id: '2', text: "The input and output of the activation function The input and output of the activation function" },
        { id: '3', text: "The input and output of the activation function" },
        { id: '4', text: "The input and output of the activation function" }
      ],
      loading: false,
    },
    {
      id: '6',
      question: 'What do (z_1)² and (z_2)² represent in the context of the neural network?',
      answers: [
        { id: '1', text: "The input and output of the activation function" },
        { id: '2', text: "The input and output of the activation function The input and output of the activation function" },
        { id: '3', text: "The input and output of the activation function" },
        { id: '4', text: "The input and output of the activation function" }
      ],
      loading: false,
    },
    {
      id: '7',
      question: 'What do (z_1)² and (z_2)² represent in the context of the neural network?',
      answers: [
        { id: '1', text: "The input and output of the activation function" },
        { id: '2', text: "The input and output of the activation function The input and output of the activation function" },
        { id: '3', text: "The input and output of the activation function" },
        { id: '4', text: "The input and output of the activation function" }
      ],
      loading: false,
    }
  ];

  // Example quiz info
  const quizInfo: QuizInfo = {
    testName: 'Neural Network Basics',
    numberOfQuestions: questions.length,
    difficulty: 'Intermediate',
    lastEdited: 'Mar 5, 2024, 10:29:29 AM',
  };

  return (
    <>
        {/* Top Bar */}
        <div className='bg-gray-100 p-4 text-center flex justify-between items-center' style={{ width: "100%", height: "57px", borderBottom: "1px solid #e8e8e8"}}>
          <div className='flex flex-row justify-start items-center'>
              <h2 className='text-xl font-bold flex-shrink-0'>
                  {quizInfo.testName}
              </h2>
              <div className="text-[12px] text-gray-600 ml-3 underline flex items-center whitespace-nowrap mt-1">
                  <span className="mr-2">Updated</span><span>{quizInfo.lastEdited}</span>
              </div>
          </div>
          <div className='flex items-center'>
            <p className='flex-shrink-0 mr-9'>{quizInfo.numberOfQuestions} Questions | Difficulty: {quizInfo.difficulty}</p>
            <div>
              {result && (
                <div className="text-lg bg-slate-400 rounded-md px-2 text-black">{result}</div>
              )}
              {!isFinished && (
                <button 
                  type="button" 
                  className="mr-3 inline-flex items-center px-3 border shadow-sm leading-4 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 h-[42px] sm:h-[38px] text-sm border-transparent bg-green-600 hover:bg-green-700 text-white"
                  onClick={handleFinishTest}
                >
                  <span className="max-w-full overflow-hidden">Finish test</span>
                </button>
              )}
            </div>
          </div>
        </div>
        <div style={{ overflowY: 'auto', flex: 1 }}>
            {/* Questions */}
            <div className='flex justify-center items-center my-8' >
                <div className='w-3/5'>
                    {questions.map((question, index) => (
                        <QuestionCard 
                            key={question.id}
                            id={question.id}
                            answers={question.answers} 
                            question={question.question}
                            question_number={index+1}
                            loading={question.loading}
                            solving={true}
                            isFinished={isFinished}
                            correctAnswerId="1"
                            onSelectAnswer={handleSelectAnswer}
                        />
                    ))}
                </div>
            </div>
        </div>
    </>
  );
};

export default QuizSolver;
