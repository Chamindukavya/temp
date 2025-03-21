'use client';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ClinicalQuizComponent from "@/components/ui/ClinicalQuizComponent";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { getClinicalPaperById, submitClinicalAnswers } from "@/app/actions/clinicalPaperActions";

type OptionLabel = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "NA";

interface ClinicalQuestion {
  _id: string;
  question: string;
  questionType: "EMQ" | "SBA";
  options: {
    label: OptionLabel;
    text: string;
  }[];
  correctOption: OptionLabel;
  explanation?: string;
}

interface ClinicalPaper {
  _id: string;
  title: string;
  paperDescription: string;
  timeLimit: number;
  questions: ClinicalQuestion[];
}

interface SaveClinicalAnswersParams {
  paper: string;
  answers: {
    questionId: string;
    selectedOption: OptionLabel;
    isCorrect: boolean;
  }[];
  score: number;
  maxScore: number;
  percentageScore: number;
  timeTaken: number;
}

export default function ClinicalPaperDetail({ paperID }: { paperID: string }) {
  const router = useRouter();
  const [paper, setPaper] = useState<ClinicalPaper | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: OptionLabel }>({});
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [examCompleted, setExamCompleted] = useState(false);
  const [resultsSubmitted, setResultsSubmitted] = useState(false);
  const [isTimerWarning, setIsTimerWarning] = useState(false);
  const [flaggedQuestions, setFlaggedQuestions] = useState<number[]>([]);
  const [isStarted, setIsStarted] = useState(false);
  const [showStartConfirmation, setShowStartConfirmation] = useState(false);
  const [quizState, setQuizState] = useState('intro');
  const [showTimeUpMessage, setShowTimeUpMessage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchPaper = async () => {
      try {
        const paperData = await getClinicalPaperById(paperID);
        if (paperData && 'title' in paperData && 'questions' in paperData && 'timeLimit' in paperData) {
          setPaper(paperData as unknown as ClinicalPaper);
          setTimeRemaining((paperData as { timeLimit: number }).timeLimit * 60);
        }
      } catch (err) {
        setError("Failed to load paper. Please try again.");
      }
    };

    fetchPaper();
  }, [paperID]);

  useEffect(() => {
    if (!timeRemaining || timeRemaining <= 0 || examCompleted || !isStarted) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev: number | null) => {
        if (prev && prev <= 1) {
          clearInterval(timer);
          setShowTimeUpMessage(true);
          setTimeout(() => {
            setShowTimeUpMessage(false);
            handleSubmit();
          }, 3000);
          return 0;
        }
        return prev ? prev - 1 : 0;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, examCompleted, isStarted]);

  useEffect(() => {
    if (timeRemaining && timeRemaining <= 300 && !isTimerWarning) {
      setIsTimerWarning(true);
    }
  }, [timeRemaining]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (questionIndex: number, option: OptionLabel) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: option
    }));
  };

  const handleNextQuestion = () => {
    if (!paper) return;
    
    if (activeQuestionIndex === paper.questions.length - 1) {
      setShowConfirmSubmit(true);
    } else {
      setActiveQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (!paper) return;
    if (selectedAnswers[paper.questions.length - 1] !== undefined) {
      setActiveQuestionIndex(prev => prev - 1);
    }
  };

  const handleQuestionSelect = (questionNumber: number) => {
    if (!paper) return;
    if (selectedAnswers[paper.questions.length - 1] !== undefined) {
      setActiveQuestionIndex(questionNumber - 1);
    }
  };

  const handleSubmitConfirmation = () => {
    setShowConfirmSubmit(true);
  };

  const handleCancelSubmit = () => {
    setShowConfirmSubmit(false);
  };

  const handleSubmit = async () => {
    try {
      if (!paper) return;
      setIsSubmitting(true);
      const { score, total, percentage } = calculateScore();
      const params: SaveClinicalAnswersParams = {
        paper: paperID,
        answers: Object.entries(selectedAnswers).map(([index, answer]) => ({
          questionId: paper.questions[parseInt(index)]._id,
          selectedOption: answer as OptionLabel,
          isCorrect: answer === paper.questions[parseInt(index)].correctOption
        })),
        score,
        maxScore: total,
        percentageScore: percentage,
        timeTaken: paper.timeLimit * 60 - (timeRemaining || 0)
      };
      
      const result = await submitClinicalAnswers(params);
      
      if (result.success) {
        setResultsSubmitted(true);
        setExamCompleted(true);
        setShowConfirmSubmit(false);
      } else {
        console.error('Failed to submit answers:', result.error);
      }
    } catch (err) {
      console.error('Failed to submit answers:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShowResults = () => {
    router.push(`/progress/${paperID}`);
  };

  const handleBackToQuizzes = () => {
    router.push('/quizzes/clinicalPapers');
  };

  const handleNavigateToProgress = () => {
    router.push('/dashboard');
  };

  const calculateScore = () => {
    if (!paper || !paper.questions) return { score: 0, total: 0, percentage: 0 };
    
    let correctAnswers = 0;
    const totalQuestions = paper.questions.length;
    
    paper.questions.forEach((question, index) => {
      const selectedAnswer = selectedAnswers[index];
      if (selectedAnswer && selectedAnswer === question.correctOption) {
        correctAnswers++;
      }
    });
    
    const score = correctAnswers;
    const percentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
    
    return {
      score,
      total: totalQuestions,
      percentage
    };
  };

  const getCompletionPercentage = () => {
    if (!paper) return 0;
    return Object.values(selectedAnswers).filter(Boolean).length / paper.questions.length * 100;
  };

  const handleStartWithTimer = () => {
    setIsStarted(true);
  };

  const handleStartWithoutTimer = () => {
    setIsStarted(true);
    setTimeRemaining(0); // Set to 0 to indicate no timer
    setIsTimerWarning(false); // Reset timer warning
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-300">
          <p className="text-gray-800 text-xl">Error: {error}</p>
          <button 
            className="mt-4 px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
            onClick={() => router.back()}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!paper) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  const currentQuestion = paper.questions[activeQuestionIndex];

  return (
    <div className="max-w-6xl mx-auto p-2 sm:p-4 md:p-6">
      {examCompleted && resultsSubmitted ? (
        <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-lg border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Quiz Completed!</h2>
          <p className="text-gray-600 mb-6">Your answers have been submitted successfully.</p>
          
          {/* Display score information */}
          <div className="w-full max-w-md mb-8 p-6 bg-blue-50 rounded-xl border border-blue-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-blue-900">Your Score</h3>
              <div className="text-2xl font-bold text-blue-700">
                {calculateScore().percentage}%
              </div>
            </div>
            
            <div className="flex justify-between text-sm text-blue-800 mb-4">
              <span>Correct Answers:</span>
              <span>{calculateScore().score} / {calculateScore().total}</span>
            </div>
            
            <div className="w-full bg-blue-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${calculateScore().percentage}%` }}
              ></div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={handleShowResults}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              View Detailed Results
            </button>
            <button
              onClick={handleBackToQuizzes}
              className="px-6 py-3 bg-white text-black border-2 border-black rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              Back to Quizzes
            </button>
          </div>
        </div>
      ) : (
        <>
          <ClinicalQuizComponent
            question={currentQuestion.question}
            options={currentQuestion.options}
            type={currentQuestion.questionType}
            currentQuestion={activeQuestionIndex + 1}
            totalQuestions={paper.questions.length}
            onNext={handleNextQuestion}
            onPrev={handlePrevQuestion}
            remainingTime={timeRemaining || 0}
            onQuestionSelect={handleQuestionSelect}
            currentAnswer={selectedAnswers[activeQuestionIndex]}
            onAnswerUpdate={(answer: string | null) => handleAnswerSelect(activeQuestionIndex, answer as OptionLabel)}
            isReviewMode={false}
            answers={Object.values(selectedAnswers).map(answer => answer !== null)}
            title={paper.title}
            userName="User"
            flaggedQuestions={flaggedQuestions}
            onToggleFlag={(questionNumber: number) => {
              setFlaggedQuestions(prev => 
                prev.includes(questionNumber) 
                  ? prev.filter(q => q !== questionNumber)
                  : [...prev, questionNumber]
              );
            }}
            onStartWithTimer={handleStartWithTimer}
            onStartWithoutTimer={handleStartWithoutTimer}
            isStarted={isStarted}
            paperDescription={paper.paperDescription}
            timeLimit={paper.timeLimit}
            onNavigateToProgress={handleNavigateToProgress}
          />

          <ConfirmationDialog
            isOpen={showConfirmSubmit}
            message="Are you sure you want to submit your answers? This action cannot be undone."
            onConfirm={handleSubmit}
            onCancel={handleCancelSubmit}
            showCancelButton={true}
            confirmText="Submit Quiz"
          />

          <ConfirmationDialog
            isOpen={showTimeUpMessage}
            message="Time's up! Your answers will be submitted automatically in 3 seconds..."
            onConfirm={handleSubmit}
            onCancel={() => setShowTimeUpMessage(false)}
            showCancelButton={false}
            confirmText="Submit Now"
          />

          {/* Loading Spinner Overlay */}
          {isSubmitting && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
                <p className="text-lg font-medium text-gray-700">Submitting your quiz...</p>
                <p className="text-sm text-gray-500 mt-2">Please don't close this window</p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
} 