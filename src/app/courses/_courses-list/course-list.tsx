"use client";

import type React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clock, DollarSign, Search, Star, Users } from "lucide-react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";
import debounce from "lodash/debounce";
import { useInView } from "react-intersection-observer";

interface Course {
  _id: string;
  name: string;
  slug: string;
  description: string;
  thumbnail: string;
  price: number;
  totalHours: number;
  level: string;
  rating: number;
  numberOfReviews: number;
  category: string;
  tags: string[];
  enrolledStudents: string[];
  relevanceScore?: number;
}

export default function CoursesList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isPending, startTransition] = useTransition();

  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );

  const { ref, inView } = useInView();

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((term: string) => {
      startTransition(() => {
        router.push(`/courses?search=${encodeURIComponent(term)}`);
        setCourses([]);
        setPage(1);
        setHasMore(true);
      });
    }, 500),
    [] // Removed unnecessary dependency: [router]
  );

  const fetchCourses = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/courses?page=${page}&limit=12&search=${searchTerm}&category=${selectedCategory}&level=${selectedLevel}`
      );
      const data = await response.json();

      if (page === 1) {
        setCourses(data.courses);
      } else {
        setCourses((prev) => [...prev, ...data.courses]);
      }

      setHasMore(data.currentPage < data.totalPages);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching courses:", error);
      setLoading(false);
    }
  }, [page, searchTerm, selectedCategory, selectedLevel]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  useEffect(() => {
    if (inView && hasMore && !loading) {
      setPage((prev) => prev + 1);
    }
  }, [inView, hasMore, loading]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    debouncedSearch(term);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setCourses([]);
    setPage(1);
    setHasMore(true);
  };

  const handleLevelChange = (value: string) => {
    setSelectedLevel(value);
    setCourses([]);
    setPage(1);
    setHasMore(true);
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Browse Courses</h1>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search courses..."
              value={searchTerm}
              onChange={handleSearch}
              className="pl-10"
            />
          </div>

          <Select value={selectedCategory} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Web Development">Web Development</SelectItem>
              <SelectItem value="Mobile Development">
                Mobile Development
              </SelectItem>
              <SelectItem value="Data Science">Data Science</SelectItem>
              <SelectItem value="Machine Learning">Machine Learning</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedLevel} onValueChange={handleLevelChange}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="Beginner">Beginner</SelectItem>
              <SelectItem value="Intermediate">Intermediate</SelectItem>
              <SelectItem value="Advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {courses.map((course) => (
          <Card key={course._id} className="flex flex-col">
            <div className="relative aspect-video">
              <Image
                src={course.thumbnail || "/placeholder.svg"}
                alt={course.name}
                fill
                className="object-cover rounded-t-lg"
              />
              {course.relevanceScore && course.relevanceScore > 2 && (
                <Badge className="absolute top-2 right-2 bg-primary">
                  Best Match
                </Badge>
              )}
            </div>
            <CardHeader>
              <CardTitle className="line-clamp-2">{course.name}</CardTitle>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{course.category}</Badge>
                <Badge variant="outline">{course.level}</Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                {course.description}
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{course.totalHours}h</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{course.enrolledStudents.length}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4" />
                  <span>{course.rating.toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  <span>{course.price}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={() =>
                  router.push(`/courses/${course._id}/${course.slug}`)
                }
              >
                View Course
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-muted rounded-t-lg" />
              <CardHeader>
                <div className="h-6 bg-muted rounded w-3/4" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-full" />
                  <div className="h-4 bg-muted rounded w-5/6" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && courses.length === 0 && (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-2">No courses found</h2>
          <p className="text-muted-foreground">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}

      {hasMore && (
        <div ref={ref} className="flex justify-center mt-8">
          <Button
            onClick={() => setPage((prev) => prev + 1)}
            variant="outline"
            disabled={loading || isPending}
          >
            {loading ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </div>
  );
}
