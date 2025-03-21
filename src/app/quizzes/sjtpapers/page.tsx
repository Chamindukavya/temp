import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Clock, FileText } from "lucide-react";
import { getSJTQuizzes, getQuizById } from "@/lib/mongodb/services/QuizService";
import { SJTPaperWithId, SJTPaperDocument } from "@/lib/types/SJTPaper";
import SJTPaperCard from "@/components/paper/SJTPaperCard";

// Revalidate every 5 minutes to balance freshness and performance
export const revalidate = 300;

// This is a server component (not using 'use client')
export default async function SJTPapersPage() {
  // Use the QuizService to fetch SJT papers with optimized parameters
  const papers = await getSJTQuizzes({
    sort: 'createdAt',
    order: 'desc',
    limit: 20 // Limit to 20 papers per page for better performance
  });
  
  // Convert MongoDB documents to client-friendly format
  const sjtPapers: SJTPaperWithId[] = papers.map(paper => ({
    _id: String(paper._id),
    title: paper.title,
    paperDescription: paper.paperDescription,
    subject: paper.subject,
    questions: paper.questions,
    timeLimit: paper.timeLimit,
    createdAt: paper.createdAt
  }));
  
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 justify-center text-center">
        <div className="text-4xl font-bold mb-2 ">SJT Practice Papers</div>
        <p className="text-gray-800 text-xl">
          Practice with our situational judgement test papers to prepare for your medical recruitment assessment.
        </p>
      </div>

      {sjtPapers.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium mb-2">No SJT papers available yet</h2>
          <p className="text-gray-500 mb-4">Check back soon, we're adding new papers regularly.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-5">
          {sjtPapers.map((paper) => (
            <SJTPaperCard key={paper._id} paper={paper} />
          ))}
        </div>
      )}
    </div>
  );
}

// Generate metadata for the page
export function generateMetadata() {
  return {
    title: "SJT Practice Papers | MSRA Prep",
    description: "Practice with our situational judgement test papers to prepare for your medical recruitment assessment."
  };
}
