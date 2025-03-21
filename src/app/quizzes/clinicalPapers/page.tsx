'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, FileText } from 'lucide-react';
import { getClinicalPapers } from '@/app/actions/clinicalPaperActions';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface ClinicalPaper {
  _id: string;
  title: string;
  paperDescription: string;
  timeLimit: string;
  questions: any[];
}

export default function ClinicalPapers() {
  const { data: session } = useSession();
  const router = useRouter();
  const [papers, setPapers] = useState<ClinicalPaper[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        const data = await getClinicalPapers();
        setPapers(data as unknown as ClinicalPaper[]);
      } catch (error) {
        console.error('Error fetching papers:', error);
        toast.error('Failed to load clinical papers');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPapers();
  }, []);

  const handlePaperClick = (paperId: string) => {
    if (!session?.user) {
      toast.error('Please log in to attempt quizzes');
      router.push('/login');
      return;
    }

    if (session.user.subscription.status !== 'active') {
      toast.error('You need an active subscription to attempt quizzes');
      router.push('/subscription');
      return;
    }

    router.push(`/quizzes/clinicalPapers/${paperId}`);
  };
 
  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">Loading papers...</div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 justify-center text-center">
        <div className="text-4xl font-bold mb-2">Clinical Practice Papers</div>
        <p className="text-gray-800 text-xl">
          Practice with our Clinical test papers to prepare for your medical recruitment assessment.
        </p>
      </div>

      {session?.user?.subscription.status !== 'active' && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                You need an active subscription to attempt clinical papers. 
                <Link href="/subscription" className="font-medium underline text-yellow-700 hover:text-yellow-600 ml-1">
                  View subscription plans
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
        {papers.map((paper) => (
          <Card key={paper._id} className="flex flex-col h-full border-3 border-blue-800 rounded-lg hover:bg-blue-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-center text-lg">{paper.title}</CardTitle>
            </CardHeader>
            <CardContent className="pb-2 flex-grow">
              <p className="text-sm mb-4">{paper.paperDescription}</p>
              <div className="flex items-center gap-2 text-sm">
                <Clock size={14} />
                <span>Time Limit: {paper.timeLimit}</span>
              </div>
              <div className="flex items-center gap-2 text-sm mt-2">
                <FileText size={14} />
                <span>Number of questions: {paper.questions.length}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => handlePaperClick(paper._id)}
                className="w-full bg-black text-white hover:bg-gray-800"
              >
                Start Paper
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
} 