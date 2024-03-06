import React from 'react';
import { Skeleton } from 'antd';
import { DislikeIcon, LikeIcon, PencilIcon, TrashIcon } from '@/assets/svg';

interface Answer {
  id: string;
  text: string;
}

interface QuestionCardProps {
  answers: Answer[];
  question: string;
  question_number: number;
  loading: boolean;
  solving: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ answers, question, question_number, loading, solving }) => {
  return (
    <div className='bg-white border mt-4 border-gray-200 rounded-xl w-full'>      
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
            {answers.map((answer, index) => (
              <div key={answer.id} className="relative flex items-start mt-1">
                <div className="flex items-center mt-1">
                  <input type="radio" name={`quiz-input-${question_number}`} className="w-4 h-4 text-indigo-600 border-gray-300 cursor-pointer focus:ring-indigo-500" />
                </div>
                <div className="ml-3 cursor-pointer text-md rtl:mr-3">
                  <label className="font-medium text-gray-700">{String.fromCharCode(65 + index)}) </label>
                  <span className="text-gray-600 quiz-markdown">{answer.text}</span>
                </div>
              </div>
            ))}
          </div>
          {/* Bottom Icons */}
          {!solving && (
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
                  <span>
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