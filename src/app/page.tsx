'use client'
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ArrowRight, Brain, BookOpen, Users, Trophy, CheckCircle } from 'lucide-react';

const TypedHeading: React.FC<{ text: string; speed?: number }> = ({ text, speed = 100 }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);
  
  return (
    <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
      {displayText}
      <span className="animate-pulse">|</span>
    </h1>
  );
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-10">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <TypedHeading text="Master the MSRA Exam" speed={100} />
            <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
              Comprehensive preparation platform for the Multi-Specialty Recruitment Assessment. Practice with our extensive question bank, take mock exams, and join a community of medical professionals.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button size="lg" asChild>
                <Link href="/register">
                  Start Practicing <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className='border-2 border-black hover:border-blue-800'>
                <Link href="/pricing">View Plans</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="p-6 border-3 border-blue-800 shadow-2xl">
              <BookOpen className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Question Bank</h3>
              <p className="text-muted-foreground">
                Access thousands of practice questions categorized by topic and difficulty.
              </p>
            </Card>
            <Card className="p-6 border-3 border-blue-800 shadow-2xl">
              <Brain className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Mock Exams</h3>
              <p className="text-muted-foreground">
                Simulate the real exam environment with timed tests and detailed feedback.
              </p>
            </Card>
            <Card className="p-6 border-3 border-blue-800 shadow-2xl">
              <Users className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Community</h3>
              <p className="text-muted-foreground">
                Join discussions, share experiences, and learn from peers.
              </p>
            </Card>
            <Card className="p-6 border-3 border-blue-800 shadow-2xl">
              <Trophy className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Progress Tracking</h3>
              <p className="text-muted-foreground">
                Monitor your performance and identify areas for improvement.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-blue-800">Why Prepare With Us?</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Get the competitive edge you need to succeed in your MSRA examination
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-6 w-6 text-blue-800 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg">Realistic Exam Experience</h3>
                <p className="text-gray-600">Our mock tests simulate the exact format, timing, and pressure of the real MSRA exam, preparing you for what to expect on exam day.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-6 w-6 text-blue-800 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg">Comprehensive Coverage</h3>
                <p className="text-gray-600">Our question bank covers all domains of the MSRA syllabus, ensuring you're well-prepared for every topic that might appear.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-6 w-6 text-blue-800 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg">Detailed Performance Analytics</h3>
                <p className="text-gray-600">Receive personalized feedback on your performance, highlighting your strengths and areas for improvement.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-6 w-6 text-blue-800 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg">Expert-Verified Content</h3>
                <p className="text-gray-600">All our questions and explanations are created and reviewed by medical professionals who have excelled in the MSRA examination.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-6 w-6 text-blue-800 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg">Study at Your Own Pace</h3>
                <p className="text-gray-600">Access our platform 24/7 from any device, allowing you to prepare whenever and wherever suits you best.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-6 w-6 text-blue-800 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg">Peer Support Network</h3>
                <p className="text-gray-600">Connect with fellow candidates, share strategies, and learn from the experiences of those who have successfully passed the exam.</p>
              </div>
            </div>
          </div>
          
        </div>
      </section>

      {/*  */}
      <div className="text-center">
      <Button size="lg" asChild className='mt-10 mb-20'>
                <Link href="/register">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
      </div>
    </div>
  );
}