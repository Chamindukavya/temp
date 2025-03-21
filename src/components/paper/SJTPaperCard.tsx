import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { SJTPaper } from '@/lib/types/Quiz';
import { Clock, FileText } from "lucide-react";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
interface QuizCardProps {
    paper: SJTPaper;
 
  }
  
export default function SJTPaperCard({ paper }: QuizCardProps) {
  return (
   <>
    <Card key={paper._id} className="h-full flex flex-col border-3 border-blue-800 shadow-xl hover:bg-blue-100">
              <CardHeader>
                <CardTitle className='text-center text-xl'>{paper.title}</CardTitle>
                <CardDescription>Subject: {paper.subject}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="line-clamp-3 text-sm text-gray-600 mb-4">
                  {paper.paperDescription}
                </p>
                <div className="flex items-center text-sm text-vlack">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>Time Limit: {paper.timeLimit} minutes</span>
                </div>
                <div className="flex items-center text-sm text-black mt-2">
                  <FileText className="h-4 w-4 mr-1" />
                  <span>Number of questions: {paper.questions.length} questions</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href={`/quizzes/sjtpapers/${paper._id}`}>
                    Start Paper
                  </Link>
                </Button>
              </CardFooter>
            </Card>
   </>
  )
}
