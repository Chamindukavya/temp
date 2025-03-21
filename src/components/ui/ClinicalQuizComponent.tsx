'use client';
import React, { useState, useEffect } from "react";
import { Flag } from 'lucide-react';

interface ClinicalQuizProps {
  question: string;
  options: {
    label: string;
    text: string;
  }[];
  type: "EMQ" | "SBA";
  currentQuestion: number;
  totalQuestions: number;
  onNext: () => void;
  onPrev: () => void;
  remainingTime: number;
  onQuestionSelect: (questionNumber: number) => void;
  currentAnswer: string | null;
  onAnswerUpdate: (answer: string | null) => void;
  isReviewMode: boolean;
  answers: boolean[];
  title?: string;
  userName?: string;
  flaggedQuestions?: number[];
  onToggleFlag?: (questionNumber: number) => void;
  onStartWithTimer?: () => void;
  onStartWithoutTimer?: () => void;
  isStarted?: boolean;
  paperDescription?: string;
  timeLimit?: number;
  onNavigateToProgress: () => void;
}

const StartMessage: React.FC<{
  title: string;
  totalQuestions: number;
  onStartWithTimer: () => void;
  onStartWithoutTimer: () => void;
  paperDescription?: string;
  timeLimit?: number;
}> = ({ title, totalQuestions, onStartWithTimer, onStartWithoutTimer, paperDescription = "", timeLimit = 3 }) => (
  <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden border-2 border-black">
      <div className="flex flex-col">
        <div className="bg-gray-700 p-6 text-white">
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="mt-2 text-blue-100">{paperDescription}</p>
        </div>
        
        <div className="p-6">
          <div className="flex flex-col sm:flex-row justify-between mb-8">
            <div className="flex items-center mb-4 sm:mb-0">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-800">Time Limit</p>
                <p className="text-sm text-gray-600">{timeLimit} minutes</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-800">Questions</p>
                <p className="text-sm text-gray-600">{totalQuestions} total</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h3 className="font-medium text-blue-800 mb-2">Choose Quiz Mode</h3>
              <p className="text-sm text-gray-700 mb-2">• With Timer: {timeLimit} minute limit, answers shown at the end.</p>
              <p className="text-sm text-gray-700">• Without Timer: No time limit, answers shown after each question.</p>
            </div>
            
            <div className="flex flex-col items-center justify-center gap-5">
              <button
                onClick={onStartWithTimer}
                className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                Start With Timer
              </button>
              <button
                onClick={onStartWithoutTimer}
                className="p-3 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
                Start Without Timer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ClinicalQuizComponent: React.FC<ClinicalQuizProps> = ({
  question,
  options,
  type,
  currentQuestion,
  totalQuestions,
  onNext,
  onPrev,
  remainingTime,
  onQuestionSelect,
  currentAnswer,
  onAnswerUpdate,
  isReviewMode,
  answers,
  title = "Clinical Quiz",
  userName = "User",
  flaggedQuestions = [],
  onToggleFlag = () => {},
  onStartWithTimer,
  onStartWithoutTimer,
  isStarted = false,
  paperDescription = "",
  timeLimit = 3,
  onNavigateToProgress,
}) => {
  const [isLastMinute, setIsLastMinute] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    setIsLastMinute(remainingTime <= 60);
  }, [remainingTime]);

  const formatTime = (seconds: number) => {
    if (seconds === 0 && isStarted) {
      return "No Timer";
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!isStarted) {
    return (
      <StartMessage
        title={title}
        totalQuestions={totalQuestions}
        onStartWithTimer={onStartWithTimer || (() => {})}
        onStartWithoutTimer={onStartWithoutTimer || (() => {})}
        paperDescription={paperDescription}
        timeLimit={timeLimit}
      />
    );
  }

 

  return (
    <div className="max-w-7xl mx-auto p-2 sm:p-4 md:p-6">
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
        {/* Main Quiz Box */}
        <div className="flex-1 bg-white shadow-md rounded-xl p-4 sm:p-6 md:p-8 flex flex-col h-[calc(100vh-2rem)]">
          {/* Header Box */}
          <div className="bg-gradient-to-r from-blue-50 to-white rounded-xl p-3 sm:p-4 md:p-5 mb-4 border-2 border-blue-600">
            <div className="text-center mb-2 sm:mb-3">
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-blue-900 tracking-wide">MSRA Type Question</h1>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0 mb-2 sm:mb-3">
              <p className="text-sm sm:text-base text-blue-900 font-medium">Name: {userName}</p>
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6">
                <h2 className="text-sm sm:text-base md:text-lg font-semibold text-blue-900">
                  Question {currentQuestion} of {totalQuestions}
                </h2>
                <span className={`font-bold px-2 sm:px-3 py-1 rounded-full shadow-sm ${
                  remainingTime === 0 && isStarted 
                    ? 'text-gray-600 bg-gray-100' 
                    : isLastMinute 
                    ? 'text-red-600 bg-red-50' 
                    : 'text-black bg-gray-50'
                }`}>
                  {formatTime(remainingTime)}
                </span>
              </div>
            </div>
            <div className="border-t border-blue-100 pt-2 sm:pt-3">
              <p className="text-xs sm:text-sm md:text-base text-blue-900 font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                Advice: Following questions are not pass MSRA questions and bank does not hold responsibility
              </p>
            </div>
          </div>

          {/* Main Content Area - Two Columns Layout */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 flex flex-col lg:flex-row gap-4 overflow-y-auto">
              {/* Left Column - Question */}
              <div className="flex-1 bg-white rounded-xl p-4">
                <div className="p-4 sm:p-5 rounded-xl bg-white mb-4 flex items-center relative">
                  <p className="text-base sm:text-lg text-gray-900">{question}</p>
                  <button
                    onClick={() => onToggleFlag(currentQuestion)}
                    className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <Flag 
                      className={`h-5 w-5 ${flaggedQuestions.includes(currentQuestion) ? 'text-blue-500' : 'text-gray-400'}`}
                    />
                  </button>
                </div>
              </div>

              {/* Right Column - Answers */}
              <div className="flex-1 bg-white rounded-xl p-4 flex items-center">
                <div className="space-y-1.5 w-full">
                  {options.map((option, index) => (
                    <button
                      key={option.label}
                      onClick={() => !isReviewMode && onAnswerUpdate(currentAnswer === option.label ? null : option.label)}
                      className={`w-full py-2.5 px-4 rounded-lg text-sm transition-all duration-200 ${
                        isReviewMode 
                          ? option.label === currentAnswer 
                            ? option.label === options.find(o => o.label === currentAnswer)?.label 
                              ? "bg-green-600 text-white shadow-lg" // Correct answer in review mode
                              : "bg-red-600 text-white shadow-lg" // Incorrect answer in review mode
                            : "bg-white hover:bg-gray-50 shadow-md border border-gray-200"
                          : currentAnswer === option.label
                            ? "bg-black text-white shadow-lg hover:bg-gray-800" 
                            : "bg-white hover:bg-gray-50 shadow-md hover:shadow-blue-400 border border-gray-200"
                      }`}
                      disabled={isReviewMode}
                    >
                      <div className="flex items-center gap-2">
                        <span className="mr-2">{String.fromCharCode(65 + index)}.</span>
                        {option.text}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Navigation Buttons - Fixed at bottom */}
            <div className="flex justify-between mt-4 pt-4 border-t border-gray-200 bg-white sticky bottom-0">
              <button
                onClick={onPrev}
                disabled={(currentQuestion === 1 || !answers[totalQuestions - 1]) && !isReviewMode}
                className="px-5 py-2.5 bg-white text-blue-900 rounded-lg text-sm font-medium transition-all duration-200 border-2 border-blue-300 hover:border-blue-600 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => {
                  if (currentQuestion === totalQuestions) {
                    // Instead of showing results internally, always call onNext
                    // which will show confirmation dialog on the last question
                    onNext();
                  } else {
                    onNext();
                  }
                }}
                disabled={false}
                className={`px-5 py-2.5 ${currentQuestion === totalQuestions ? 'bg-blue-600 text-white' : 'bg-white text-blue-900'} rounded-lg text-sm font-medium transition-all duration-200 border-2 ${currentQuestion === totalQuestions ? 'border-blue-700' : 'border-blue-300'} hover:border-blue-600 shadow-sm hover:shadow-md`}
              >
                {isReviewMode 
                  ? currentQuestion === totalQuestions 
                    ? "Back to Results" 
                    : "Next" 
                  : currentQuestion === totalQuestions 
                    ? "Finish" 
                    : "Next"
                }
              </button>
            </div>
          </div>
        </div>

        {/* Question Navigation Panel - Right Side */}
        <div className="w-full lg:w-64 lg:mt-7 flex-shrink-0">
          <div className="bg-white shadow-lg rounded-xl p-3 sm:p-4 md:p-5 lg:sticky lg:top-4 border-2 border-black">
            <h4 className="font-semibold mb-2 sm:mb-3 text-center text-sm sm:text-base text-blue-900">Questions</h4>
            <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-5 gap-0.5 sm:gap-1">
              {Array.from({ length: totalQuestions }, (_, i) => (
                <div key={i} className="relative">
                  <button
                    onClick={() => onQuestionSelect(i + 1)}
                    disabled={!answers[totalQuestions - 1] && i + 1 > currentQuestion}
                    className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg text-xs sm:text-sm transition-all duration-200 transform hover:scale-105 shadow-sm ${
                      currentQuestion === i + 1
                        ? "bg-black text-white shadow-md"
                        : answers[i]
                        ? "bg-blue-50 text-blue-900 hover:shadow-md"
                        : "bg-white text-gray-900 hover:shadow-md border border-gray-200"
                    } ${(!answers[totalQuestions - 1] && i + 1 > currentQuestion) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {i + 1}
                  </button>
                  {flaggedQuestions?.includes(i + 1) && (
                    <div className="absolute -top-1 -right-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicalQuizComponent;