"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

// Mock data for suggestions and courses
const suggestions = ["java", "javascript", "python", "react", "node.js"];
const mockCourses = [
  { id: 1, title: "Java Fundamentals", instructor: "John Doe" },
  { id: 2, title: "Advanced JavaScript", instructor: "Jane Smith" },
  { id: 3, title: "Python for Beginners", instructor: "Bob Johnson" },
];

export function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<typeof mockCourses>(
    []
  );
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = suggestions.filter((suggestion) =>
        suggestion.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSuggestions(filtered);

      const filteredCourses = mockCourses.filter((course) =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCourses(filteredCourses);

      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    router.push(`/search?q=${encodeURIComponent(suggestion)}`);
    setShowSuggestions(false);
  };

  const handleCourseClick = (courseId: number) => {
    router.push(`/course/${courseId}`);
    setShowSuggestions(false);
  };

  return (
    <div ref={searchRef} className="relative w-full">
      <form onSubmit={handleSearch}>
        <div className="relative">
          <Input
            type="search"
            placeholder="Search for anything"
            className="w-full pr-10 rounded-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
          />
          <Button
            type="submit"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </form>
      {showSuggestions && (searchQuery || filteredCourses.length > 0) && (
        <div className="absolute z-10 w-full bg-background border rounded-md shadow-lg mt-1">
          {filteredSuggestions.length > 0 && (
            <div className="p-2">
              <h3 className="text-sm font-semibold mb-1">Suggestions</h3>
              {filteredSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="cursor-pointer hover:bg-muted p-1 rounded"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
          {filteredCourses.length > 0 && (
            <div className="p-2 border-t">
              <h3 className="text-sm font-semibold mb-1">Courses</h3>
              {filteredCourses.map((course) => (
                <div
                  key={course.id}
                  className="cursor-pointer hover:bg-muted p-1 rounded"
                  onClick={() => handleCourseClick(course.id)}
                >
                  <div>{course.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {course.instructor}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
