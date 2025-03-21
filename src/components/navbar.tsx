"use client"

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { BookOpen, Brain, Users, BarChart, Menu, X, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [isVisible, setIsVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY === 0) {
        setIsVisible(true);
      } else if (!isHovered) {
        setIsVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', controlNavbar);
    return () => window.removeEventListener('scroll', controlNavbar);
  }, [isHovered]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (window.scrollY > 0) {
      setIsVisible(false);
    }
  };

  const navigation = [
    { name: 'Question Bank', href: '/quizzes', icon: BookOpen },
    { name: 'Mock Exams', href: '/quizzes', icon: Brain },
    { name: 'Community', href: '/community', icon: Users },
    { name: 'Progress', href: '/progress', icon: BarChart },
  ];

  // Define the callback URL for after logout
  const handleLogout = () => {
    signOut({ callbackUrl: `${window.location.origin}/` });
  };

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 border-b rounded-4xl shadow-[0_0px_10px_rgba(0,0,0,0.3)] mx-2 sm:mx-8 md:mx-16 lg:mx-32 mt-1 transition-all duration-300 ${
          isMobileMenuOpen 
            ? 'md:translate-y-0 -translate-y-full bg-white dark:bg-gray-900' 
            : !isVisible 
              ? 'md:-translate-y-full bg-white/20 dark:bg-gray-900/20 backdrop-blur-sm' 
              : 'translate-y-0 bg-white dark:bg-gray-900'
        }`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="w-full px-4">
          <div className="grid grid-cols-3 md:flex items-center h-14 sm:h-16">
            {/* Logo */}
            <div className="flex justify-start items-center pl-6 md:pl-12">
              <Link href="/" className="flex items-center">
                <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent">MSRA Prep</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex flex-1 justify-center">
              <div className="flex space-x-4 lg:space-x-10">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        'inline-flex items-center text-sm font-medium transition-colors duration-200 whitespace-nowrap hover:scale-105',
                        pathname === item.href
                          ? 'border-b-2 border-blue-600 text-blue-800 dark:text-blue-400'
                          : 'text-gray-700 hover:text-blue-800 dark:text-gray-300 dark:hover:text-blue-400'
                      )}
                    >
                      <Icon className="w-3.5 h-3.5 mr-1" />
                      <span className="hidden lg:inline">{item.name}</span>
                      <span className="lg:hidden">{item.name.split(' ')[0]}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Mobile Center - Empty Space */}
            <div className="md:hidden"></div>

            {/* Buttons */}
            <div className="flex justify-end items-center gap-3 md:gap-2 lg:gap-4 pr-6 md:pr-12">
              <div className="md:block">
                <ModeToggle />
              </div>
              <Button 
                variant="ghost" 
                className="md:hidden p-1.5 rounded-lg hover:bg-gray-100 hover:scale-105 hover:text-blue-800 hover:border hover:border-blue-600 transition-all duration-200 dark:hover:bg-gray-800/50 dark:hover:text-blue-400 dark:hover:border-blue-500"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
              </Button>
              <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
                {status === 'authenticated' ? (
                  <Button 
                    variant="outline" 
                    onClick={handleLogout}
                    className='border-2 border-black bg-white text-black hover:scale-105 hover:border-red-600 transition-all duration-200 dark:border-white dark:text-white dark:bg-transparent dark:hover:border-red-500 flex items-center gap-2'
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" asChild className='border-2 border-black bg-white text-black hover:scale-105 hover:border-blue-600 transition-all duration-200 dark:border-white dark:text-white dark:bg-transparent dark:hover:border-blue-500'>
                      <Link href="/login">Login</Link>
                    </Button>
                    <Button variant="outline" asChild className='border-2 border-black bg-white text-black hover:scale-105 hover:border-blue-600 transition-all duration-200 dark:border-white dark:text-white dark:bg-transparent dark:hover:border-blue-500'>
                      <Link href="/register">Sign Up</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      <div 
        className={`fixed inset-0 z-50 md:hidden ${isMobileMenuOpen ? 'visible opacity-100' : 'invisible opacity-0'} transition-all duration-300`}
      >
        <div 
          className={`fixed inset-0 bg-black transition-opacity duration-300 hover:bg-black/30 ${isMobileMenuOpen ? 'opacity-25' : 'opacity-0'}`} 
          onClick={() => setIsMobileMenuOpen(false)} 
        />
        <div 
          className={`fixed right-0 top-0 h-full w-[280px] bg-white dark:bg-gray-900 shadow-xl transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className="flex flex-col h-full">
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-800">
              <Link href="/" className="flex items-center" onClick={() => setIsMobileMenuOpen(false)}>
                <span className="text-lg font-bold bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent">MSRA Prep</span>
              </Link>
              <div className="flex items-center space-x-3">
                <ModeToggle />
                <Button 
                  variant="ghost" 
                  className="p-1.5 rounded-lg hover:bg-gray-100 hover:scale-105 hover:text-blue-800 hover:border hover:border-blue-600 transition-all duration-200 dark:hover:bg-gray-800/50 dark:hover:text-blue-400 dark:hover:border-blue-500"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X className="h-5 w-5 sm:h-6 sm:w-6" />
                </Button>
              </div>
            </div>

            {/* Navigation Items */}
            <div className="flex flex-col space-y-4 p-4">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 hover:scale-105',
                      pathname === item.href
                        ? 'bg-blue-50 text-blue-800 dark:bg-blue-900/50 dark:text-blue-400'
                        : 'text-gray-700 hover:text-blue-800 dark:text-gray-300 dark:hover:text-blue-400'
                    )}
                  >
                    <Icon className="w-4 h-4 mr-3" />
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {/* Mobile Menu Footer */}
            <div className="mt-auto border-t dark:border-gray-800 p-4 space-y-2">
              {status === 'authenticated' ? (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className='w-full border-2 border-black bg-white text-black hover:scale-105 hover:border-red-600 transition-all duration-200 dark:border-white dark:text-white dark:bg-transparent dark:hover:border-red-500 hover:bg-gray-50 dark:hover:bg-gray-800/50 flex items-center justify-center gap-2'
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              ) : (
                <>
                  <Button variant="outline" asChild className='w-full border-2 border-black bg-white text-black hover:scale-105 hover:border-blue-600 transition-all duration-200 dark:border-white dark:text-white dark:bg-transparent dark:hover:border-blue-500 hover:bg-gray-50 dark:hover:bg-gray-800/50'>
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button variant="outline" asChild className='w-full border-2 border-black bg-white text-black hover:scale-105 hover:border-blue-600 transition-all duration-200 dark:border-white dark:text-white dark:bg-transparent dark:hover:border-blue-500 hover:bg-gray-50 dark:hover:bg-gray-800/50'>
                    <Link href="/register">Sign Up</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}