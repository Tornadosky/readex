import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import QuestionCard from './QuestionCard';
import axios from 'axios';

interface Answer {
  id: string;
  text: string;
}

interface Question {
  id: string;
  question: string;
  answers: Answer[];
  loading: boolean;
  correct: string;
}

interface QuizInfo {
  testName: string;
  numberOfQuestions: number;
  difficulty: string;
  lastEdited: string;
}

interface ShuffleHelper {
  value: Answer;
  sort: number;
}

const QuizSolver: React.FC = () => {
  const { testId } = useParams();
  const [isFinished, setIsFinished] = useState(false);
  const [quizInfo, setQuizInfo] = useState<QuizInfo>({
    testName: '',
    numberOfQuestions: 0,
    difficulty: '',
    lastEdited: '',
  });
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<{[key: string]: string}>({});
  const [result, setResult] = useState<string | null>(null);

  const handleSelectAnswer = (questionId: string, answerId: string) => {
    setSelectedAnswers(prev => ({...prev, [questionId]: answerId}));
  };

  const handleFinishTest = async () => {
    setIsFinished(true);
    let correctCount = questions.reduce((count, question) => {
      if (selectedAnswers[question.id] === question.correct) {
        return count + 1;
      }
      return count;
    }, 0);
    const resultPercentage = ((correctCount / questions.length) * 100).toFixed(0);
    setResult(resultPercentage);

    const mutation = `
    mutation UpdateTestLastResult($id: ID!, $lastResult: Int!) {
        setTest(id: $id, lastResult: $lastResult) {
          id
          lastResult
        }
      }
    `;

    try {
      const response = await axios.post('http://localhost:3000/graphql', {
        query: mutation,
        variables: {
          id: parseInt(testId!),
          lastResult: parseInt(resultPercentage),
        },
      }, {
        headers: { 'Content-Type': 'application/json' },
      });

      console.log(response.data.data.setTest)
      if (response.data.data.setTest) {
        console.log('Test lastResult updated successfully');
      } else {
        console.error('Failed to update test lastResult:', response.data.errors);
      }
    } catch (error) {
      console.error('Failed to update test lastResult:', error);
    }
  };

 useEffect(() => {
  const fetchQuestions = async () => {
    const query = `
      query GetTestAndQuestions($testId: Int!, $userId: Int!) {
        Tests(id: $testId, user: $userId) {
          id
          title
          prompt
          language
          difficulty
          questions {
            id
            questionText
            answers
            correct
            explanation
          }
        }
      }
    `;

    try {
      const response = await axios.post('http://localhost:3000/graphql', {
        query,
        variables: { testId: parseInt(testId!), userId: 1},
      }, {
        headers: { 'Content-Type': 'application/json' },
      });

      console.log('response:', response.data.data.Tests)

      if (response.data.data.Tests) {
        const test = response.data.data.Tests[0];
        const formattedQuestions = test.questions.map((q: any) => ({
          id: q.id,
          question: q.questionText, // Rename questionText to question
          answers: JSON.parse(q.answers).map((answer: string, index: number) => ({
            id: String(index + 1), // Generate IDs for answers if not provided
            text: answer,
          })).map((value: Answer): ShuffleHelper => ({ value, sort: Math.random() }))
            .sort((a: ShuffleHelper, b: ShuffleHelper): number => a.sort - b.sort)
            .map(({ value }: ShuffleHelper): Answer => value),
          correct: q.correct,
          loading: false,
        }));

        setQuestions(formattedQuestions);

        setQuizInfo({
          testName: test.title,
          numberOfQuestions: formattedQuestions.length,
          difficulty: test.difficulty,
          lastEdited: new Date().toLocaleString(),
        });
      }
    } catch (error) {
      console.error('Failed to fetch test and questions:', error);
    }
  };

  if (testId) {
    fetchQuestions();
  }
}, [testId]);

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
                <div className="text-lg bg-slate-400 rounded-md px-2 text-black">{result}%</div>
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
                            loading={false}
                            solving={true}
                            isFinished={isFinished}
                            correctAnswerId={question.correct}
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
