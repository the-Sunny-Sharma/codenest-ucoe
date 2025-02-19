"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart,
  Clock,
  DollarSign,
  Plus,
  Search,
  SortAsc,
  SortDesc,
  Users,
} from "lucide-react";
import Link from "next/link";
import TeacherLayout from "@/components/client/layouts/TeacherLayout";
import { toast } from "sonner";
import Image from "next/image";

interface CourseStats {
  enrolledCount: number;
  revenue: number;
  completionRate: number;
  averageRating: number;
}

interface Course {
  _id: string;
  name: string;
  slug: string;
  description: string;
  thumbnail: string;
  price: number;
  totalHours: number;
  status: "draft" | "published" | "archived";
  createdAt: string;
  stats: CourseStats;
}

export default function TeacherCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const router = useRouter();

  useEffect(() => {
    fetchCourses();
  }, [currentPage, search, status, sortBy, sortOrder]); //Corrected useEffect dependency array

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/teacher/courses?page=${currentPage}&search=${search}&status=${status}&sortBy=${sortBy}&sortOrder=${sortOrder}`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch courses");
      }

      const data = await res.json();
      setCourses(data.courses);
      setTotalPages(data.totalPages);
    } catch (error) {
      toast.error("Failed to load courses");
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    setCurrentPage(1);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "published":
        return "success";
      case "draft":
        return "secondary";
      case "archived":
        return "destructive";
      default:
        return "default";
    }
  };

  if (loading) {
    return (
      <TeacherLayout>
        <div className="container mx-auto p-4 space-y-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-10 w-40" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((n) => (
              <Card key={n} className="animate-pulse">
                <CardHeader>
                  <Skeleton className="h-4 w-2/3" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-24 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </TeacherLayout>
    );
  }

  return (
    <TeacherLayout>
      <div className="container mx-auto p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">My Courses</h1>
            <p className="text-muted-foreground">
              Manage and track your course performance
            </p>
          </div>
          <Button onClick={() => router.push("/teacher/courses/new")}>
            <Plus className="mr-2 h-4 w-4" /> Create New Course
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search courses..."
              value={search}
              onChange={handleSearch}
              className="pl-10"
            />
          </div>

          <Select value={status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt">Created Date</SelectItem>
              <SelectItem value="name">Course Name</SelectItem>
              <SelectItem value="enrolledStudents">Enrollment</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon" onClick={toggleSortOrder}>
            {sortOrder === "asc" ? (
              <SortAsc className="h-4 w-4" />
            ) : (
              <SortDesc className="h-4 w-4" />
            )}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course._id} className="flex flex-col">
              <div className="relative aspect-video">
                <Image
                  src={course.thumbnail || "/placeholder.svg"}
                  alt={course.name}
                  fill
                  className="object-cover rounded-t-lg"
                />
                <Badge
                  variant={getStatusBadgeVariant(course.status)}
                  className="absolute top-2 right-2"
                >
                  {course.status}
                </Badge>
              </div>
              <CardHeader>
                <CardTitle className="line-clamp-2">{course.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {course.description}
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {course.stats.enrolledCount} enrolled
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{course.totalHours}h</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">₹{course.stats.revenue}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BarChart className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {course.stats.completionRate}% completed
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button variant="outline" className="flex-1" asChild>
                  <Link href={`/teacher/courses/${course._id}`}>Manage</Link>
                </Button>
                <Button variant="default" className="flex-1" asChild>
                  <Link href={`/courses/${course.slug}`}>Preview</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {courses.length === 0 && !loading && (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-2">No courses found</h2>
            <p className="text-muted-foreground mb-4">
              {search
                ? "Try adjusting your search criteria"
                : "Start by creating your first course"}
            </p>
            <Button onClick={() => router.push("/teacher/courses/new")}>
              <Plus className="mr-2 h-4 w-4" /> Create New Course
            </Button>
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-6 flex justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                onClick={() => setCurrentPage(page)}
                variant={currentPage === page ? "default" : "outline"}
              >
                {page}
              </Button>
            ))}
          </div>
        )}
      </div>
    </TeacherLayout>
  );
}
