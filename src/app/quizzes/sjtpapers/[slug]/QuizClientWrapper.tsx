"use client";

import { useState, useEffect } from "react";
import { SJTPaperDocument } from "@/lib/types/SJTPaper";
import QuizComponent from "@/components/QuizComponent";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { useRouter } from "next/navigation";

type Props = {
  initialQuizData: SJTPaperDocument;
  slug: string;
};

export default function QuizClientWrapper({ initialQuizData, slug }: Props) {
  const router = useRouter();
  const [quiz] = useState<SJTPaperDocument>(initialQuizData);
  const [error, setError] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [remainingTime, setRemainingTime] = useState(3600); 
  const [answers, setAnswers] = useState<(string | string[] | null)[]>(() => {
    return new Array(initialQuizData.questions.length).fill(null);
  });
  const [isStarted, setIsStarted] = useState(false);
  const [showStartConfirmation, setShowStartConfirmation] = useState(false);
  const [showSubmitConfirmation, setShowSubmitConfirmation] = useState(false);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [flaggedQuestions, setFlaggedQuestions] = useState<number[]>([]);
  const [quizState, setState] = useState('intro');
  const [showTimerOptions, setShowTimerOptions] = useState(false);

  useEffect(() => {
    if (isStarted && remainingTime > 0) {
      const timer = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isStarted, remainingTime]);

  const handleStartQuiz = () => {
    setShowStartConfirmation(true);
  };

  const handleConfirmStart = () => {
    setIsStarted(true);
    setShowStartConfirmation(false);
    
    if (quiz) {
      setRemainingTime(quiz.timeLimit * 60);
    }
  };

  const handleStartWithoutTimer = () => {
    setIsStarted(true);
    setShowStartConfirmation(false);
    setRemainingTime(0); // Set to 0 to indicate no timer
  };

  const handleTimeUp = () => {
    setShowSubmitConfirmation(true);
    
    setTimeout(() => {
      setShowSubmitConfirmation(false);
      handleSubmitQuiz();
    }, 3000);
  };

  const handleSubmitQuiz = async () => {
    if (!quiz) return;

    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quizId: slug,
          answers: answers,
          timeSpent: quiz.timeLimit * 60 - remainingTime,
        }),
      });

      if (response.ok) {
        router.push(`/results/${slug}`);
      } else {
        throw new Error('Failed to submit quiz');
      }
    } catch (error) {
      setError("Failed to submit quiz. Please try again.");
    }
  };

  const handleNext = () => {
    if (currentQuestion === quiz?.questions.length) {
      setShowConfirmDialog(true);
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrev = () => {
    if (answers[quiz!.questions.length - 1] !== null || currentQuestion === quiz?.questions.length) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleQuestionSelect = (questionNumber: number) => {
    if (answers[quiz!.questions.length - 1] !== null || currentQuestion === quiz?.questions.length) {
      setCurrentQuestion(questionNumber);
    }
  };

  const handleAnswerUpdate = (answer: string | string[]) => {
    setAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[currentQuestion - 1] = answer;
      return newAnswers;
    });
  };

  const handleToggleFlag = (questionNumber: number) => {
    setFlaggedQuestions(prev => {
      if (prev.includes(questionNumber)) {
        return prev.filter(q => q !== questionNumber);
      } else {
        return [...prev, questionNumber];
      }
    });
  };

  if (error) return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden p-6 text-center">
        <div className="text-red-500 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <h2 className="text-xl font-medium mb-2">{error}</h2>
        <p className="text-gray-600 mb-4">Please try again or contact support if the problem persists.</p>
      </div>
    </div>
  );

  if (!isStarted) {
    return (
      <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
        <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden border-2 border-black">
          {quizState === 'intro' && (
            <div className="flex flex-col">
              <div className="bg-gray-700 p-6 text-white">
                <h1 className="text-2xl font-bold">{quiz.title}</h1>
                <p className="mt-2 text-blue-100">{quiz.paperDescription}</p>
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
                      <p className="text-sm text-gray-600">{quiz.timeLimit} minutes</p>
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
                      <p className="text-sm text-gray-600">{quiz.questions.length} total</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <h3 className="font-medium text-blue-800 mb-2">Choose Quiz Mode</h3>
                    <p className="text-sm text-gray-700 mb-2">• With Timer: {quiz.timeLimit} minute limit, answers shown at the end.</p>
                    <p className="text-sm text-gray-700">• Without Timer: No time limit, answers shown after each question.</p>
                  </div>
                  
                  <div className="flex flex-col items-center justify-center gap-5">
                    <button
                      onClick={handleConfirmStart}
                      className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      Start With Timer
                    </button>
                    <button
                      onClick={handleStartWithoutTimer}
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
          )}
        </div>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion - 1];

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8">
      <QuizComponent
        question={question.question}
        options={question.choices}
        type={question.type}
        currentQuestion={currentQuestion}
        totalQuestions={quiz.questions.length}
        onNext={handleNext}
        onPrev={handlePrev}
        remainingTime={remainingTime}
        onQuestionSelect={handleQuestionSelect}
        currentAnswer={answers[currentQuestion - 1]}
        onAnswerUpdate={handleAnswerUpdate}
        isReviewMode={isReviewMode}
        answers={answers.map(answer => answer !== null && answer !== "" && (Array.isArray(answer) ? answer.length > 0 : true))}
        flaggedQuestions={flaggedQuestions}
        onToggleFlag={handleToggleFlag}
      />

      <ConfirmationDialog
        isOpen={showConfirmDialog}
        message="Are you sure you want to submit your answers? This action cannot be undone."
        onConfirm={handleSubmitQuiz}
        onCancel={() => setShowConfirmDialog(false)}
        showCancelButton={true}
        confirmText="Submit Quiz"
      />

      <ConfirmationDialog
        isOpen={showSubmitConfirmation}
        message="Time's up! Your answers will be submitted automatically in 3 seconds..."
        onConfirm={handleSubmitQuiz}
        onCancel={() => setShowSubmitConfirmation(false)}
        showCancelButton={false}
        confirmText="Submit Now"
      />
    </div>
  );
} 