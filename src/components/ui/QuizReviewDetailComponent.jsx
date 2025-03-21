import React, { useState } from 'react';
import { CheckCircle, XCircle, Info, Flag } from 'lucide-react';

const QuizReviewDetailComponent = ({
  questions,
  userAnswers,
  correctAnswers,
  explanations,
  score,
  timeTaken,
  totalQuestions,
  title = "Quiz Review",
  userName = "User",
  completedAt,
  percentageScore,
  onNavigateBack
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prevIndex => prevIndex + 1);
    }
  };
  
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prevIndex => prevIndex - 1);
    }
  };
  
  const handleQuestionSelect = (questionNumber) => {
    setCurrentIndex(questionNumber - 1);
  };
  
  if (!questions || questions.length === 0) {
    return <div>No questions available for review</div>;
  }
  
  const currentQuestion = questions[currentIndex];
  const userAnswer = userAnswers[currentIndex];
  const correctAnswer = correctAnswers[currentIndex];
  const explanation = explanations[currentIndex];
  
  // Format time in minutes and seconds
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  // Use provided percentageScore or calculate it
  const displayPercentageScore = percentageScore !== undefined ? 
    percentageScore : Math.round((score / totalQuestions) * 100);
  
  return (
    <div className="max-w-7xl mx-auto p-2 sm:p-4 md:p-6">
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
        {/* Main Quiz Box */}
        <div className="flex-1 bg-white shadow-md rounded-xl p-4 sm:p-6 md:p-8 flex flex-col h-auto sm:h-[calc(100vh-2rem)]">
          {/* Header Box with Enhanced Summary Details */}
          <div className="bg-gradient-to-r from-blue-50 to-white rounded-xl p-3 sm:p-4 md:p-5 mb-4 border-2 border-blue-600">
            <div className="text-center mb-2 sm:mb-3">
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-blue-900 tracking-wide">{title}</h1>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <div className="space-y-1">
                <p className="text-sm sm:text-base text-blue-900 font-medium">Name: {userName}</p>
                <p className="text-sm sm:text-base text-blue-900 font-medium">
                  Score: <span className="font-bold text-green-700">{score}/{totalQuestions} ({displayPercentageScore}%)</span>
                </p>
                <p className="text-sm sm:text-base text-blue-900 font-medium">
                  Time Taken: <span className="font-semibold">{formatTime(timeTaken)}</span>
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm sm:text-base text-blue-900 font-medium">
                  Question: <span className="font-semibold">{currentIndex + 1} of {totalQuestions}</span>
                </p>
                {completedAt && (
                  <p className="text-sm sm:text-base text-blue-900 font-medium">
                    Completed: <span className="font-semibold">{completedAt}</span>
                  </p>
                )}
                <div className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  {displayPercentageScore >= 70 ? "Passed" : "Failed"}
                </div>
              </div>
            </div>
            
          
          </div>

          {/* Main Content Area - Restructured Layout */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 flex flex-col lg:flex-row gap-4 overflow-y-auto">
              {/* Left Column - Question and Explanation */}
              <div className="flex-1 flex flex-col">
                {/* Question */}
                <div className="bg-white rounded-xl p-4 mb-4">
                  <div className="p-4 sm:p-5 rounded-xl bg-white flex items-center relative border border-gray-200">
                    <p className="text-base sm:text-lg text-gray-900">{currentQuestion.question}</p>
                  </div>
                </div>
                
                {/* Explanation Section - Below Question with Cream Color Scheme */}
                <div className="p-5 bg-amber-50 rounded-lg shadow-sm">
                  <div className="flex items-start">
                    <Info className="h-6 w-6 text-amber-700 mt-1 mr-3 flex-shrink-0" />
                    <div className="w-full">
                      <h4 className="font-semibold text-amber-900 text-lg mb-2">Explanation</h4>
                      <div className="bg-amber-50 p-4 rounded-lg text-amber-900">
                        {explanation ? (
                          <p className="whitespace-pre-line">{explanation}</p>
                        ) : (
                          <p className="italic text-amber-700">No explanation provided for this question.</p>
                        )}
                      </div>
                      
                      {/* Visual indication of whether user got it right */}
                      <div className="mt-3 flex items-center">
                        {userAnswer === correctAnswer ? (
                          <div className="flex items-center text-green-700 bg-green-50 px-3 py-1.5 rounded-full">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            <span className="font-medium">You answered correctly</span>
                          </div>
                        ) : (
                          <div className="flex items-center text-red-700 bg-red-50 px-3 py-1.5 rounded-full">
                            <XCircle className="h-4 w-4 mr-2" />
                            <span className="font-medium">
                              {userAnswer ? 'Incorrect answer' : 'You did not answer this question'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Answers */}
              <div className="flex-1 bg-white rounded-xl p-4 flex items-center">
                <div className="space-y-1.5 w-full">
                  {currentQuestion.options.map((option) => (
                    <div
                      key={option.label}
                      className={`w-full py-2.5 px-4 rounded-lg text-sm transition-all duration-200 ${
                        option.label === correctAnswer
                          ? "bg-green-50 text-green-800 border border-green-500"
                          : option.label === userAnswer && option.label !== correctAnswer
                          ? "bg-red-50 text-red-800 border border-red-500"
                          : "bg-white text-gray-800 border border-gray-200"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="mr-2">{option.label}.</span>
                        <span>{option.text}</span>
                        {option.label === correctAnswer && (
                          <CheckCircle className="ml-auto text-green-600 h-5 w-5" />
                        )}
                        {option.label === userAnswer && option.label !== correctAnswer && (
                          <XCircle className="ml-auto text-red-600 h-5 w-5" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Navigation Buttons - Fixed at bottom */}
            <div className="flex justify-between mt-4 pt-4 border-t border-gray-200 bg-white sticky bottom-0">
              <button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="px-5 py-2.5 bg-white text-blue-900 rounded-lg text-sm font-medium transition-all duration-200 border-2 border-blue-300 hover:border-blue-600 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
            
              
              <button
                onClick={handleNext}
                disabled={currentIndex === questions.length - 1}
                className="px-5 py-2.5 bg-white text-blue-900 rounded-lg text-sm font-medium transition-all duration-200 border-2 border-blue-300 hover:border-blue-600 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Question Navigation Panel - Right Side */}
        <div className="w-full lg:w-64 lg:mt-7 flex-shrink-0">
          <div className="bg-white shadow-lg rounded-xl p-3 sm:p-4 md:p-5 lg:sticky lg:top-4 border-2 border-black">
            <h4 className="font-semibold mb-2 sm:mb-3 text-center text-sm sm:text-base text-blue-900">Questions</h4>
            <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-5 gap-0.5 sm:gap-1">
              {questions.map((_, i) => {
                const isCorrectAnswer = userAnswers[i] === correctAnswers[i];
                return (
                  <div key={i} className="relative">
                    <button
                      onClick={() => handleQuestionSelect(i + 1)}
                      className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg text-xs sm:text-sm transition-all duration-200 transform hover:scale-105 shadow-sm
                        ${currentIndex === i 
                          ? "bg-black text-white shadow-md" 
                          : isCorrectAnswer
                            ? "bg-green-100 text-green-900 border border-green-500"
                            : userAnswers[i]
                              ? "bg-red-100 text-red-900 border border-red-500"
                              : "bg-gray-100 text-gray-900 border border-gray-300"
                        }`}
                    >
                      {i + 1}
                    </button>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center mb-2">
                <div className="w-4 h-4 rounded-sm bg-green-100 border border-green-500 mr-2"></div>
                <span className="text-xs text-gray-800">Correct Answer</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-sm bg-red-100 border border-red-500 mr-2"></div>
                <span className="text-xs text-gray-800">Incorrect Answer</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizReviewDetailComponent; 