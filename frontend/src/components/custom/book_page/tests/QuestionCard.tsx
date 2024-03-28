import React, { useState } from 'react';
import { Skeleton } from 'antd';
import { DislikeIcon, LikeIcon, PencilIcon, TrashIcon, SuccessIcon } from '@/assets/svg';
import { CloseOutlined } from '@ant-design/icons';

interface Answer {
  id: string;
  text: string;
}

interface QuestionCardProps {
  id: string;
  answers: Answer[];
  question: string;
  question_number: number;
  loading: boolean;
  solving: boolean;
  handleDeleteQuestion?: (id: string) => void;
  correctAnswerId?: string;
  isFinished?: boolean;
  onSelectAnswer: (questionId: string, answerId: string) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ 
  id,
  answers, 
  question, 
  question_number, 
  loading, 
  solving, 
  handleDeleteQuestion,
  correctAnswerId,
  isFinished = false,
  onSelectAnswer,
 }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const handleSelectAnswer = (answerId: string) => {
    if (!isFinished) { 
      onSelectAnswer(id, answerId);
      setSelectedAnswer(answerId);
    }
  };

  const isCorrect = isFinished && selectedAnswer && selectedAnswer === correctAnswerId;
  const isIncorrect = isFinished && selectedAnswer !== correctAnswerId;

  return (
    <div className={`bg-white border mt-4 ${isCorrect ? 'border-2 border-green-200' : isIncorrect ? 'border-2 border-red-200' : ''} rounded-xl w-full`}>
      <div className='p-4'>
        <Skeleton loading={loading} className='mt-2 ml-1 mb-6' paragraph={{ rows: 4 }}>
          {/* Question Header */}
          <div className="flex flex-wrap items-center justify-between -mt-4 -ml-4 sm:flex-nowrap">
            <div className="mt-4 ml-4">
              <div className="flex items-center">
                <h3 className="text-lg font-bold text-gray-700">
                  <span>{question_number}</span>. 
                  <span> {question}</span>
                </h3>
              </div>
            </div>
          </div>
          {/* Question Options */}
          <div className="mt-4 mb-2">
            {answers.map((answer, index) => {
              const isCorrectAnswer = answer.id === correctAnswerId;
              const isSelected = selectedAnswer === answer.id;

              return (
                <div key={answer.id} className='relative flex items-start mt-1 px-2'>
                  <div className="flex items-center mt-1">
                    {isFinished && isSelected && (
                      isCorrectAnswer ? 
                      <SuccessIcon className='absolute -left-3 text-green-600 w-5' /> :
                      <CloseOutlined className='absolute -left-3 text-red-600' />
                    )}
                    <input
                      type="radio"
                      name={`quiz-input-${question_number}`}
                      className="w-4 h-4 text-indigo-600 border-gray-300 cursor-pointer focus:ring-indigo-500"
                      checked={selectedAnswer === answer.id}
                      onChange={() => handleSelectAnswer(answer.id)}
                      disabled={isFinished}
                    />
                  </div>
                  <div className={`ml-3 cursor-pointer text-md rtl:mr-3 px-2 ${isFinished && isCorrectAnswer ? "rounded-md border-2 border-green-500" : ""}`}>
                    <label className="font-medium text-gray-700">{String.fromCharCode(65 + index)}) </label>
                    <span className="text-gray-600 quiz-markdown">
                      {answer.text}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          {/* Bottom Icons */}
          {!solving && handleDeleteQuestion && (
            <div className='flex justify-start space-x-1 text-gray-500 border-t border-gray-200'>
              <div className="flex space-x-2 grow px-4 pt-3 rtl:space-x-reverse">
                <span className="text-gray-500 hover:text-gray-800 cursor-pointer">
                  <LikeIcon />
                </span>
                <span className="text-gray-500 hover:text-gray-800 cursor-pointer">
                  <DislikeIcon />
                </span>
              </div>
              <div className="flex justify-end px-4 pt-3 space-x-2 rtl:space-x-reverse grow">
                <div>
                  <span className="text-gray-500 hover:text-gray-800 cursor-pointer inline mb-0.5">
                    <PencilIcon />
                  </span>
                </div>
                <div className="text-gray-500 hover:text-red-600 cursor-pointer inline mb-0.5">
                  <span onClick={() => handleDeleteQuestion(id)}>
                    <TrashIcon />
                  </span>
                </div>
              </div>
            </div>
          )}
        </Skeleton>
      </div>
    </div>
  );
};

export default QuestionCard;