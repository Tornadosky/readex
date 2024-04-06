import React, { useState } from 'react';
import { Skeleton } from 'antd';
import { DislikeIcon, LikeIcon, PencilIcon, TrashIcon, SuccessIcon } from '@/assets/svg';
import { CloseOutlined } from '@ant-design/icons';
import axios from 'axios';

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
  onSelectAnswer?: (questionId: string, answerId: string) => void;
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
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editedQuestion, setEditedQuestion] = useState<string>(question);
  const [editedAnswers, setEditedAnswers] = useState<Answer[]>(answers);

  const handleSelectAnswer = (answerId: string) => {
    if (!isFinished && onSelectAnswer) { 
      onSelectAnswer(id, answerId);
      setSelectedAnswer(answerId);
    }
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, questionId?: string) => {
    if (e.key === 'Enter' && editMode) {
      e.preventDefault();
      toggleEditMode();
      handleEditBackend();
    }
  };

  const handleEditBackend = async () => {
    const mutation = `
      mutation EditQuestion($id: ID!, $questionText: String!, $answers: String!) {
        setQuestion(id: $id, questionText: $questionText, answers: $answers) {
          id
          questionText
          answers
        }
      }
    `;
    
    const answerTexts = editedAnswers.map(answer => answer.text);
  
    try {
      const response = await axios.post('http://localhost:3000/graphql', {
        query: mutation,
        variables: {
          id: parseInt(id),
          questionText: editedQuestion,
          answers: JSON.stringify(answerTexts)
        },
      }, {
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (!response.data.errors) {
        console.log('Question updated:', response.data.data.setQuestion);
        setEditedQuestion(response.data.data.setQuestion.questionText);
        console.log(response.data.data.setQuestion.answers);
        setEditedAnswers(JSON.parse(response.data.data.setQuestion.answers).map((answer: string, index: number) => ({ id: index.toString(), text: answer })));
      } else {
        console.error('Failed to update question:', response.data.errors);
      }
    } catch (error) {
      console.error('Error updating question:', error);
    }
  };


  const handleEditQuestion = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedQuestion(e.target.value);
  };

  const handleEditAnswer = (answerId: string, newText: string) => {
    const updatedAnswers = editedAnswers.map((answer) =>
      answer.id === answerId ? { ...answer, text: newText } : answer
    );
    setEditedAnswers(updatedAnswers);
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
                  {editMode ? (
                    <input
                      type="text"
                      value={editedQuestion}
                      onChange={handleEditQuestion}
                      onKeyDown={(e) => handleKeyPress(e)}
                      className="ml-4 text-md font-medium rounded text-gray-400 outline-slate-400 px-1 focus:ring-0 focus:border-0"
                      style={{ border: '1px solid #ccc' }}
                    />
                  ) : (
                    <span> {editedQuestion}</span>
                  )}
                </h3>
              </div>
            </div>
          </div>
          {/* Question Options */}
          <div className="mt-4 mb-2">
            {editedAnswers.map((answer, index) => {
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
                      className="w-4 h-4 text-indigo-600 border-gray-300 cursor-pointer focus:ring-0 focus:border-0"
                      checked={selectedAnswer === answer.id}
                      onChange={() => handleSelectAnswer(answer.id)}
                      disabled={isFinished}
                    />
                  </div>
                  <div className={`ml-3 cursor-pointer text-md rtl:mr-3 px-2 ${isFinished && isCorrectAnswer ? "rounded-md border-2 border-green-500" : ""}`}>
                    <label className="font-medium text-gray-700">{String.fromCharCode(65 + index)}) </label>
                    {editMode ? (
                      <input
                        type="text"
                        value={editedAnswers[index].text}
                        onKeyDown={(e) => handleKeyPress(e, answer.id)}
                        onChange={(e) => handleEditAnswer(answer.id, e.target.value)}
                        className="text-md font-medium rounded text-gray-400 outline-slate-400 px-1 focus:ring-0 focus:border-0"
                        style={{ border: '1px solid #ccc' }}
                      />
                    ) : (
                      <span className="text-gray-600 quiz-markdown">{answer.text}</span>
                    )}
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
                  <span className="text-gray-500 hover:text-gray-800 cursor-pointer inline mb-0.5" onClick={toggleEditMode}>
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