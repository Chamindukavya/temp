'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUserQuizResult, getClinicalPaperById } from '@/app/actions/clinicalPaperActions';
import QuizReviewComponent from '@/components/ui/QuizReviewComponent';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useSession } from 'next-auth/react';

export default function QuizResultDetailPage({ params }) {
  const { paperID } = params;
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/login?callbackUrl=/progress/results');
    },
  });
  
  const [quizResult, setQuizResult] = useState(null);
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (status !== 'authenticated' || !session?.user?.id) return;
      
      try {
        setLoading(true);
        // Get the quiz result using the logged-in user's ID
        const resultData = await getUserQuizResult(session.user.id, paperID);
        if (!resultData.success) {
          setError(resultData.error || 'Failed to load quiz result');
          return;
        }
        
        // Get the quiz paper details
        const paperData = await getClinicalPaperById(paperID);
        if (!paperData) {
          setError('Failed to load quiz details');
          return;
        }
        
        setQuizResult(resultData.data);
        setQuizData(paperData);
      } catch (err) {
        console.error('Error fetching quiz result:', err);
        setError('Something went wrong. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session, status, paperID]);

  const handleNavigateToProgress = () => {
    router.push('/progress/results');
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 max-w-md w-full">
          <p className="font-medium">Error</p>
          <p>{error}</p>
        </div>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!quizResult || !quizData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4">Quiz Result Not Found</h1>
          <p className="text-gray-600 mb-6">
            We couldn't find the quiz result you're looking for.
          </p>
          <button
            onClick={() => router.push('/progress/results')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to Results
          </button>
        </div>
      </div>
    );
  }

  // Prepare data for the review component
  const userAnswerMap = {};
  quizResult.answers.forEach(answer => {
    userAnswerMap[answer.questionId] = answer.selectedOption;
  });

  const questions = quizData.questions;
  const userAnswers = questions.map(q => userAnswerMap[q._id] || null);
  const correctAnswers = questions.map(q => q.correctOption);
  const explanations = questions.map(q => q.explanation || "No explanation available for this question.");
  
  // Debug logs to check explanation data
  console.log("All questions:", questions);
  console.log("Explanations array:", explanations);
  console.log("Sample explanation:", explanations[0]);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <button
          onClick={handleNavigateToProgress}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to All Results
        </button>
      </div>
      
      <QuizReviewComponent
        questions={questions}
        userAnswers={userAnswers}
        correctAnswers={correctAnswers}
        explanations={explanations}
        timeTaken={quizResult.timeTaken}
        completedAt={new Date(quizResult.completedAt).toLocaleString()}
        percentageScore={quizResult.percentageScore}
        quizTitle={quizData.title}
        onNavigateToProgress={handleNavigateToProgress}
      />
    </div>
  );
} 