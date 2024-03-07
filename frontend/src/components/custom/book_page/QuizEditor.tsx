import { useState } from 'react';
import QuestionCard from './QuestionCard';
import { SuccessIcon } from '@/assets/svg';
import QuizMenu from './QuizMenu';

const QuizEditor = () => {
  const [activePage, setActivePage] = useState('Uploads');
  const [questions, setQuestions] = useState([
    {
      id: '1',
      question: 'Represent in the context of the neural network?',
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
  ]);
  const [generating, setGenerating] = useState<boolean>(false);

  const handleBackendRequest = async (submissionData: any) => {
    setGenerating(true);

    console.log('Performing backend request with:', submissionData);

    const newQuestions = [
      {
        id: Math.random().toString(36).substr(2, 9),
        question: 'Represent in the context of the neural network?',
        answers: [
          { id: '1', text: "The input and output of the activation function" },
          { id: '2', text: "The input and output of the activation function The input and output of the activation function" },
          { id: '3', text: "The input and output of the activation function" },
          { id: '4', text: "The input and output of the activation function" }
        ],
        loading: true,
      },
      {
        id: Math.random().toString(36).substr(2, 9),
        question: 'Represent in the context of the neural network?',
        answers: [
          { id: '1', text: "The input and output of the activation function" },
          { id: '2', text: "The input and output of the activation function The input and output of the activation function" },
          { id: '3', text: "The input and output of the activation function" },
          { id: '4', text: "The input and output of the activation function" }
        ],
        loading: true,
      }
    ]

    setQuestions((prevQuestions) => [
      ...prevQuestions,
      ...newQuestions
    ]);
  
    setTimeout(() => {
      console.log('Backend request completed');
      // Update the loading state of the new questions
      setQuestions((prevQuestions) => {
        return prevQuestions.map((question) => {
          if (question.loading) {
            return {
              ...question,
              loading: false
            }
          }
          return question;
        });
      });
      setGenerating(false);
    }, 2000);
  };

  const handleSetActivePage = (page: string) => {
    setActivePage(page);
  };

  const handleDeleteQuestion = (questionId: string) => {
    setQuestions(questions.filter((question) => question.id !== questionId));
  };

  return (
    <div className="flex py-4">
      <div className='p-4 ml-4 bg-gray-50 shadow-md rounded-md hover:shadow-gray-300 transition duration-200 ease-in-out' style={{ width: '50%'}}>
        <QuizMenu
          activePage={activePage} 
          handleSetActivePage={handleSetActivePage}
          generating={generating} 
          onSubmit={handleBackendRequest}
        />
      </div>
      {/* Question Cards */}
      <div className='flex flex-col justify-center items-center mx-8 overflow-y-auto' style={{ width: "50%" }}>
        {questions.map((question, index) => (
          <QuestionCard 
            key={question.id}
            id={question.id}
            answers={question.answers} 
            question={question.question}
            question_number={index+1}
            loading={question.loading}
            handleDeleteQuestion={handleDeleteQuestion}
            solving={false}
          />
        ))}
        {/* Empty state */}
        {questions.length === 0 && (
          <div className="bg-white rounded-lg px-6 py-6 shadow-sm">
            <h1 className="font-semibold leading-7 text-lg">
                Get Started
            </h1>
            <div className="mt-6 grid grid-cols-12">
                <div className="col-span-2 sm:col-span-1">
                  <span className="p-1 inline-block">
                    <SuccessIcon />
                  </span>
                </div>
                <div className="col-span-10 sm:col-span-11  ">
                  <p className="font-semibold">
                      1. Create a quiz
                  </p>
                  <p className="mt-1">
                      Paste copied text, input a topic, provide a URL or YouTube video link, upload a file, or directly type in a question to get started.
                  </p>
                </div>
                <div className="col-span-2 sm:col-span-1 mt-4">
                  <span className="p-1 inline-block">
                    <SuccessIcon />
                  </span>
                </div>
                <div className="col-span-10 sm:col-span-11  mt-4">
                  <p className="font-semibold">
                      2. Play, assign and embed
                  </p>
                  <p className="mt-1">
                      Once your quiz is ready, you can play it, assign it with others, or embed it on your website.
                  </p>
                </div>
                <div className="col-span-2 sm:col-span-1 mt-4">
                  <span className="p-1 inline-block">
                    <SuccessIcon />
                  </span>
                </div>
                <div className="col-span-10 sm:col-span-11  mt-4">
                  <p className="font-semibold">
                      3. Analyze results
                  </p>
                  <p className="mt-1">
                      You can results for all assigned quizzes in Reports
                  </p>
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizEditor;