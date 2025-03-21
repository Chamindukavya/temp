'use client';

import React, { useState } from 'react';
import { CheckCircle, XCircle, ChevronRight, ChevronLeft, Info } from 'lucide-react';
import QuizReviewDetailComponent from '@/components/ui/QuizReviewDetailComponent';
import { useSession } from 'next-auth/react';

const QuizReviewComponent = ({ 
  questions, 
  userAnswers, 
  correctAnswers,
  explanations,
  timeTaken,
  completedAt,
  percentageScore,
  quizTitle,
  onNavigateToProgress
}) => {
  const { data: session } = useSession();
  const userName = session?.user?.name || "User";

  if (!questions || questions.length === 0) {
    return <div>No questions available for review</div>;
  }
  
  // Calculate score
  const score = Object.keys(userAnswers).reduce((count, index) => {
    return userAnswers[index] === correctAnswers[index] ? count + 1 : count;
  }, 0);
  
  return (
    <div className="max-w-6xl mx-auto p-2 sm:p-4 md:p-6">
      <QuizReviewDetailComponent
        questions={questions}
        userAnswers={userAnswers}
        correctAnswers={correctAnswers}
        explanations={explanations}
        score={score}
        timeTaken={timeTaken || 3600} // Use provided time or default
        totalQuestions={questions.length}
        title={quizTitle || "Quiz Review"}
        userName={userName}
        completedAt={completedAt}
        percentageScore={percentageScore}
        onNavigateBack={onNavigateToProgress}
      />
    </div>
  );
};

export default QuizReviewComponent; 