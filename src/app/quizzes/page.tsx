import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Clock, BookOpen, Users, Award, FileQuestion, Brain } from 'lucide-react';

export default function Page() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center">Medical Quiz Sections</h1>
      <div className="flex flex-col sm:flex-row max-w-6xl mx-auto space-y-4 sm:space-y-0 sm:space-x-4">
        {/* Clinical Section Card */}
        <Card className="w-full overflow-hidden shadow-lg border-2 border-blue-100 hover:shadow-xl transition-all duration-300">
          <CardHeader className="border-b">
            <div className="flex items-center mb-2">
              <BookOpen className="mr-2 text-blue-600" />
              <CardTitle className="text-2xl text-blue-800">Clinical Section</CardTitle>
            </div>
            <CardDescription className="text-lg text-blue-600">Enhance your clinical knowledge with comprehensive medical scenarios</CardDescription>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="space-y-4">
              <p className="text-gray-700">
                Dive into realistic clinical scenarios designed to test and improve your diagnostic reasoning and patient management skills.
              </p>
              <div className="grid grid-cols-2 gap-2 mt-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Brain className="mr-1 h-4 w-4" /> 
                  <span>Critical Thinking</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Award className="mr-1 h-4 w-4" /> 
                  <span>Exam-Style Format</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <FileQuestion className="mr-1 h-4 w-4" /> 
                  <span>Detailed Explanations</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50 pt-4 pb-4">
            <Button asChild className="w-full border-2 border-blue-500 bg-blue-50 hover:bg-blue-100 text-black">
              <Link href="/quizzes/clinicalPapers">Start Clinical Quizzes</Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Situational Judgment Section Card */}
        <Card className="w-full overflow-hidden shadow-lg border-2 border-emerald-100 hover:shadow-xl transition-all duration-300">
          <CardHeader className="border-b">
            <div className="flex items-center mb-2">
              <Users className="mr-2 text-blue-600" />
              <CardTitle className="text-2xl text-blue-800">Situational Judgment</CardTitle>
            </div>
            <CardDescription className="text-lg text-blue-600">Develop your professional decision-making skills for clinical practice</CardDescription>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="space-y-4">
              <p className="text-gray-700">
                Practice making ethical and professional decisions in complex workplace scenarios that reflect real medical practice environments.
              </p>
              <div className="grid grid-cols-2 gap-2 mt-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="mr-1 h-4 w-4" /> 
                  <span>Team Dynamics</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Brain className="mr-1 h-4 w-4" /> 
                  <span>Ethical Reasoning</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <FileQuestion className="mr-1 h-4 w-4" /> 
                  <span>Professional Guidance</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50 pt-4 pb-4">
            <Button asChild className="w-full border-2 border-blue-500 bg-blue-50 hover:bg-blue-100 text-black">
              <Link href="/quizzes/sjtpapers">Start SJT Quizzes</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}