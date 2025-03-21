import React from 'react';

interface ResultsSummaryProps {
  title: string;
  score: number;
  totalQuestions: number;
  percentageScore: number;
  timeTaken: number; // in seconds
  completedAt: string;
}

const ResultsSummary: React.FC<ResultsSummaryProps> = ({
  title,
  score,
  totalQuestions,
  percentageScore,
  timeTaken,
  completedAt,
}) => {
  // Format the time taken
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    let timeString = '';
    if (hours > 0) {
      timeString += `${hours} ${hours === 1 ? 'hour' : 'hours'} `;
    }
    if (minutes > 0 || hours > 0) {
      timeString += `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} `;
    }
    timeString += `${remainingSeconds} ${remainingSeconds === 1 ? 'second' : 'seconds'}`;
    
    return timeString;
  };

  // Determine background color based on score percentage
  const getScoreColor = () => {
    if (percentageScore >= 80) return 'bg-green-100 border-green-500 text-green-800';
    if (percentageScore >= 60) return 'bg-blue-100 border-blue-500 text-blue-800';
    if (percentageScore >= 40) return 'bg-yellow-100 border-yellow-500 text-yellow-800';
    return 'bg-red-100 border-red-500 text-red-800';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6">{title} - Results</h1>
      
      <div className="flex flex-col md:flex-row justify-between gap-6 mb-8">
        <div className="flex-1">
          <div className="mb-4">
            <h2 className="text-gray-600 text-sm font-semibold">QUIZ COMPLETED</h2>
            <p className="text-gray-800">{completedAt}</p>
          </div>
          
          <div>
            <h2 className="text-gray-600 text-sm font-semibold">TIME TAKEN</h2>
            <p className="text-gray-800">{formatTime(timeTaken)}</p>
          </div>
        </div>
        
        <div className={`flex-1 p-6 rounded-lg border-2 ${getScoreColor()}`}>
          <div className="text-center">
            <h2 className="font-bold text-3xl mb-2">{score} / {totalQuestions}</h2>
            <p className="text-2xl font-semibold">{percentageScore}%</p>
            <p className="mt-2 font-medium">
              {percentageScore >= 80 ? 'Excellent!' : 
               percentageScore >= 60 ? 'Good job!' : 
               percentageScore >= 40 ? 'Keep practicing!' : 
               'More study needed'}
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-gray-600 mb-4">
          Scroll down to review your answers and see detailed explanations for each question.
        </p>
      </div>
    </div>
  );
};

export default ResultsSummary; 