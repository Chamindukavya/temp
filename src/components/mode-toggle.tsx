"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ModeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="p-1.5 rounded-lg hover:bg-gray-100 hover:scale-105 hover:text-blue-800 hover:border hover:border-blue-600 transition-all duration-200 dark:hover:bg-gray-800/50 dark:hover:text-blue-400 dark:hover:border-blue-500">
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="rounded-lg">
        <DropdownMenuItem 
          onClick={() => setTheme("light")}
          className="px-3 py-2 rounded-lg hover:bg-gray-100 hover:text-blue-800 hover:border hover:border-blue-600 transition-all duration-200 dark:hover:bg-gray-800/50 dark:hover:text-blue-400 dark:hover:border-blue-500"
        >
          Light
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("dark")}
          className="px-3 py-2 rounded-lg hover:bg-gray-100 hover:text-blue-800 hover:border hover:border-blue-600 transition-all duration-200 dark:hover:bg-gray-800/50 dark:hover:text-blue-400 dark:hover:border-blue-500"
        >
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("system")}
          className="px-3 py-2 rounded-lg hover:bg-gray-100 hover:text-blue-800 hover:border hover:border-blue-600 transition-all duration-200 dark:hover:bg-gray-800/50 dark:hover:text-blue-400 dark:hover:border-blue-500"
        >
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}