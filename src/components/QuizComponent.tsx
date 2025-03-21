'use client';
import { useState, useEffect } from "react";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

interface QuizProps {
  question: string;
  options: string[];
  type: "ranking" | "best_choice";
  currentQuestion: number;
  totalQuestions: number;
  onNext: () => void;
  onPrev: () => void;
  remainingTime: number;
  onQuestionSelect: (questionNumber: number) => void;
  currentAnswer: string | string[] | null;
  onAnswerUpdate: (answer: string | string[]) => void;
  isReviewMode: boolean;
  answers: boolean[];
  title?: string;
  userName?: string;
  flaggedQuestions?: number[];
  onToggleFlag?: (questionNumber: number) => void;
}

const QuizComponent: React.FC<QuizProps> = ({
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
  title = "MSRA Type Question",
  userName = "User",
  flaggedQuestions = [],
  onToggleFlag = () => {},
}) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const [rankedItems, setRankedItems] = useState<string[]>([]);
  const [availableItems, setAvailableItems] = useState<string[]>(options);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour in seconds
  const [isTimeUp, setIsTimeUp] = useState(false);

  useEffect(() => {
    if (type === "best_choice") {
      setSelected(currentAnswer as string | null);
    } else {
      setRankedItems(currentAnswer as string[] || []);
      setAvailableItems(options.filter(item => !(currentAnswer as string[] || []).includes(item)));
    }
  }, [currentAnswer, options, type]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsTimeUp(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleStartQuiz = () => {
    if (!session?.user) {
      toast.error('Please log in to attempt quizzes');
      router.push('/login');
      return;
    }

    if (session.user.subscription.status !== 'active') {
      toast.error('You need an active subscription to attempt quizzes');
      router.push('/pricing');
      return;
    }

    setSelected(null);
    setRankedItems([]);
    setAvailableItems(options);
    setIsSubmitting(false);
    setTimeLeft(3600);
    setIsTimeUp(false);
  };

  const formatTime = (seconds: number) => {
    if (seconds === 0) {
      return "No Timer";
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const isLastMinute = remainingTime <= 60;

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    // If dragging within the same column
    if (result.source.droppableId === result.destination.droppableId) {
      if (result.source.droppableId === 'ranked') {
        const newRankedItems = [...rankedItems];
        const [removed] = newRankedItems.splice(result.source.index, 1);
        newRankedItems.splice(result.destination.index, 0, removed);
        setRankedItems(newRankedItems);
        onAnswerUpdate(newRankedItems);
      } else {
        const newAvailableItems = [...availableItems];
        const [removed] = newAvailableItems.splice(result.source.index, 1);
        newAvailableItems.splice(result.destination.index, 0, removed);
        setAvailableItems(newAvailableItems);
      }
      return;
    }

    // If dragging between columns
    if (result.destination.droppableId === 'ranked') {
      const newAvailableItems = [...availableItems];
      const [itemToMove] = newAvailableItems.splice(result.source.index, 1);
      
      const newRankedItems = [...rankedItems];
      newRankedItems.splice(result.destination.index, 0, itemToMove);
      
      setRankedItems(newRankedItems);
      setAvailableItems(newAvailableItems);
      onAnswerUpdate(newRankedItems);
    } else {
      const newRankedItems = [...rankedItems];
      const [itemToMove] = newRankedItems.splice(result.source.index, 1);
      
      const newAvailableItems = [...availableItems];
      newAvailableItems.splice(result.destination.index, 0, itemToMove);
      
      setAvailableItems(newAvailableItems);
      setRankedItems(newRankedItems);
      onAnswerUpdate(newRankedItems);
    }
  };

  const handleOptionSelect = (option: string) => {
    if (selected === option) {
      setSelected(null);
      onAnswerUpdate("");
    } else {
      setSelected(option);
      onAnswerUpdate(option);
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting || isTimeUp) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/submitquiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paperId: "examplePaperId",
          paperType: "clinical",
          answers: rankedItems,
          timeSpent: 3600 - timeLeft,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit quiz');
      }

      toast.success('Quiz submitted successfully!');
      router.push('/dashboard');
    } catch (error) {
      toast.error('Failed to submit quiz');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-2 sm:p-4 md:p-6">
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
        {/* Main Quiz Box */}
        <div className="flex-1 bg-white shadow-lg rounded-xl p-4 sm:p-6 md:p-8 flex flex-col h-[calc(100vh+3rem)]">
          {/* Combined Header and Advice Box */}
          <div className="bg-gradient-to-r from-blue-50 to-white rounded-xl p-3 sm:p-4 md:p-5 mb-4 sm:mb-6 border-2 border-blue-600">
            <div className="text-center mb-2 sm:mb-3">
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-blue-900 tracking-wide">{title}</h1>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0 mb-2 sm:mb-3">
              <p className="text-sm sm:text-base text-blue-900 font-medium">Name: {userName}</p>
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6">
                <h2 className="text-sm sm:text-base md:text-lg font-semibold text-blue-900">
                  {isReviewMode ? "Review Mode - " : ""}
                  Question {currentQuestion} of {totalQuestions}
                </h2>
                <span className={`font-bold px-2 sm:px-3 py-1 rounded-full shadow-sm ${
                  remainingTime === 0 
                    ? 'text-black bg-gray-50' 
                    : isLastMinute 
                    ? 'text-red-600 bg-red-50' 
                    : 'text-black bg-gray-50'
                }`}>
                  {formatTime(remainingTime)}
                </span>
              </div>
            </div>
            <div className="border-t border-blue-100 pt-2 sm:pt-3">
              <p className="text-xs sm:text-sm md:text-base text-blue-900 font-medium">
                Advice: Following questions are not pass MSRA questions and bank does not hold responsibility
              </p>
            </div>
            
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto">
            <div>
              {/* Question Box */}
              <div className="p-3 sm:p-4 md:p-5 rounded-xl bg-white mb-4 sm:mb-6 min-h-[100px] sm:min-h-[120px] md:min-h-[150px] flex items-center relative">
                <p className="text-base sm:text-lg md:text-xl text-gray-900">{question}</p>
                <button
                  onClick={() => onToggleFlag(currentQuestion)}
                  className="absolute top-2 sm:top-4 right-2 sm:right-4 p-1 sm:p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 sm:h-6 sm:w-6 ${flaggedQuestions?.includes(currentQuestion) ? 'text-blue-500' : 'text-gray-400'}`}
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
                </button>
              </div>

              {type === "best_choice" ? (
                // Best Choice Question UI
                <div className="space-y-1.5 pb-4 max-w-3xl mx-auto">
                  {options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => !isReviewMode && handleOptionSelect(option)}
                      className={`w-full py-2.5 px-4 rounded-lg text-sm transition-all duration-200 ${
                        selected === option
                          ? "bg-black text-white shadow-lg hover:bg-gray-800"
                          : "bg-white hover:bg-gray-50 shadow-md hover:shadow-blue-400 border border-gray-200"
                      } ${isReviewMode ? 'cursor-default' : 'cursor-pointer'}`}
                      disabled={isReviewMode}
                    >
                      <div className="flex items-center gap-2">
                        <span className="mr-2">{String.fromCharCode(65 + index)}.</span>
                        {option}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                // Ranking Question UI
                <DragDropContext onDragEnd={handleDragEnd}>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    {/* Left Column - Ranked Items */}
                    <Droppable droppableId="ranked" isDropDisabled={isReviewMode}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className="rounded-xl p-3 sm:p-4 md:p-5 bg-white min-h-[300px] max-h-[500px] overflow-y-auto flex flex-col shadow-lg border-2 border-black"
                        >
                          <h4 className="font-semibold mb-2 sm:mb-3 flex-shrink-0 text-sm sm:text-base text-blue-900">Your Ranking</h4>
                          <div className="flex flex-col gap-1.5">
                            {rankedItems.map((item, index) => (
                              <Draggable
                                key={item}
                                draggableId={item}
                                index={index}
                                isDragDisabled={isReviewMode}
                              >
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="h-[40px] bg-white rounded-lg border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow flex items-center px-3 cursor-move"
                                  >
                                    <span className="text-sm text-gray-900 truncate">{item}</span>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {Array.from({ length: options.length - rankedItems.length }).map((_, index) => (
                              <div
                                key={`placeholder-${index}`}
                                className="h-[40px] bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center"
                              >
                                <span className="text-gray-400 text-sm">Drop answer here</span>
                              </div>
                            ))}
                            {provided.placeholder}
                          </div>
                        </div>
                      )}
                    </Droppable>

                    {/* Right Column - Available Items */}
                    <Droppable droppableId="available" isDropDisabled={isReviewMode}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className="rounded-xl p-3 sm:p-4 md:p-5 bg-white min-h-[300px] max-h-[500px] overflow-y-auto flex flex-col shadow-lg border-2 border-black"
                        >
                          <h4 className="font-semibold mb-2 sm:mb-3 flex-shrink-0 text-sm sm:text-base text-blue-900">Available Options</h4>
                          <div className="flex flex-col gap-1.5">
                            {availableItems.map((option, index) => (
                              <Draggable
                                key={option}
                                draggableId={option}
                                index={index}
                                isDragDisabled={isReviewMode}
                              >
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="h-[40px] bg-white rounded-lg border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow flex items-center px-3 cursor-move"
                                  >
                                    <span className="text-sm text-gray-900 truncate">{option}</span>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        </div>
                      )}
                    </Droppable>
                  </div>
                </DragDropContext>
              )}
            </div>
          </div>

          {/* Navigation Buttons - Fixed at bottom */}
          <div className="flex justify-between mt-4 sm:mt-6 md:mt-8 pt-4 border-t border-gray-200">
            <button
              onClick={onPrev}
              disabled={currentQuestion === 1}
              className="px-4 sm:px-6 md:px-8 py-2 sm:py-3 bg-white text-blue-900 rounded-lg text-sm sm:text-base font-medium transition-all duration-200 transform hover:scale-105 border-2 border-blue-300 hover:border-blue-600 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={onNext}
              className="px-4 sm:px-6 md:px-8 py-2 sm:py-3 bg-white text-blue-900 rounded-lg text-sm sm:text-base font-medium transition-all duration-200 transform hover:scale-105 border-2 border-blue-300 hover:border-blue-600 shadow-sm hover:shadow-md"
            >
              {currentQuestion === totalQuestions ? "Finish" : "Next"}
            </button>
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
                    className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg text-xs sm:text-sm transition-all duration-200 transform hover:scale-105 shadow-sm ${
                      currentQuestion === i + 1
                        ? "bg-black text-white shadow-md"
                        : answers[i]
                        ? "bg-blue-50 text-blue-900 hover:shadow-md"
                        : "bg-white text-gray-900 hover:shadow-md border border-gray-200"
                    }`}
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

      {currentQuestion === totalQuestions && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || isTimeUp}
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizComponent;
