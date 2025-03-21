import { getQuizById } from "@/lib/mongodb/services/QuizService";
import QuizClientWrapper from "./QuizClientWrapper";

export default async function QuizPage({params}: {params: Promise<{ slug: string }>}) {
  // Server-side fetch
  const slug = (await params).slug;
  let quiz = null;
  let error = '';

  try {
    // Fetch quiz and convert to plain JavaScript object
    const fetchedQuiz = await getQuizById(slug);
    
    // Handle circular references by JSON stringify/parse
    if (fetchedQuiz) {
      // This removes any circular references and Mongoose-specific properties
      const plainData = JSON.parse(JSON.stringify(fetchedQuiz));
      quiz = plainData;
    }
  } catch (err) {
    console.error('Error fetching quiz:', err);
    error = 'Quiz not found or an error occurred.';
  }

  // Handle error state
  if (error) {
    return (
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
  }

  // Handle loading state (should rarely happen with server components)
  if (!quiz) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading quiz...</p>
      </div>
    );
  }

  // Pass the sanitized quiz data to the client component
  return <QuizClientWrapper initialQuizData={quiz} slug={slug} />;
} 