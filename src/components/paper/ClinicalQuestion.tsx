import React from 'react';
import { Check, X } from 'lucide-react';

interface Option {
  label: string;
  text: string;
}

interface ClinicalQuestionProps {
  question: string;
  questionType: string;
  options: Option[];
  selectedAnswer: string | null;
  correctOption?: string;
  explanation?: string;
  showExplanation: boolean;
  examCompleted: boolean;
  onSelectAnswer: (option: string) => void;
  questionNumber: number;
  totalQuestions: number;
}

const ClinicalQuestion: React.FC<ClinicalQuestionProps> = ({
  question,
  questionType,
  options,
  selectedAnswer,
  correctOption,
  explanation,
  showExplanation,
  examCompleted,
  onSelectAnswer,
  questionNumber,
  totalQuestions,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-gray-200">
      {/* Question Header */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
          Question {questionNumber} of {totalQuestions}
        </span>
        <span className={`text-sm font-medium px-3 py-1 rounded-full ${
          questionType === 'EMQ' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
        }`}>
          {questionType}
        </span>
      </div>
      
      {/* Question Text */}
      <h2 className="text-lg font-semibold mb-6 text-gray-800">{question}</h2>
      
      {/* Options */}
      <div className="space-y-3">
        {options.map((option) => (
          <div 
            key={option.label}
            onClick={() => !examCompleted && onSelectAnswer(option.label)}
            className={`p-4 rounded-lg cursor-pointer border transition-all ${
              selectedAnswer === option.label
                ? 'bg-gray-100 border-black shadow-sm'
                : 'border-gray-200 hover:bg-gray-50'
            } ${
              examCompleted && option.label === correctOption
                ? 'bg-green-50 border-green-500'
                : examCompleted && selectedAnswer === option.label && option.label !== correctOption
                ? 'bg-red-50 border-red-500'
                : ''
            }`}
          >
            <div className="flex items-center">
              <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center mr-3 ${
                selectedAnswer === option.label
                  ? 'bg-black text-white'
                  : examCompleted && option.label === correctOption
                  ? 'bg-green-500 text-white'
                  : examCompleted && selectedAnswer === option.label && option.label !== correctOption
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}>
                {option.label}
              </div>
              <div className="flex-1 text-gray-700">{option.text}</div>
              {examCompleted && option.label === correctOption && (
                <Check className="text-green-500 ml-2" size={20} />
              )}
              {examCompleted && 
                selectedAnswer === option.label && 
                option.label !== correctOption && (
                <X className="text-red-500 ml-2" size={20} />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Explanation */}
      {showExplanation && explanation && (
        <div className="mt-6 p-5 bg-gray-50 border border-gray-300 rounded-lg">
          <h3 className="font-semibold mb-2 text-gray-800">Explanation:</h3>
          <p className="text-gray-700">{explanation}</p>
        </div>
      )}
    </div>
  );
};

export default ClinicalQuestion;
