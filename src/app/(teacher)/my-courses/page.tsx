// app/teacher/my-courses/page.tsx
"use client";

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
import Link from "next/link";
import TeacherLayout from "@/components/client/layouts/TeacherLayout";

export default function TeacherCourses() {
  const [courses, setCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchCourses();
  }, [currentPage, search]);

  const fetchCourses = async () => {
    const res = await fetch(
      `/api/teacher/courses?page=${currentPage}&search=${search}`
    );
    const data = await res.json();
    console.log(`DATA: ${data}`);
    setCourses(data.courses);
    setTotalPages(data.totalPages);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <TeacherLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">My Courses</h1>
        <div className="mb-4">
          <Input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={handleSearch}
            className="w-full max-w-xs"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <Card key={course._id}>
              <CardHeader>
                <CardTitle>{course.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{course.description}</p>
              </CardContent>
              <CardFooter>
                <Link href={`/teacher/courses/${course._id}`}>
                  <Button>Manage Course</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="mt-4 flex justify-center">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              onClick={() => handlePageChange(page)}
              variant={currentPage === page ? "default" : "outline"}
              className="mx-1"
            >
              {page}
            </Button>
          ))}
        </div>
        <div className="mt-4">
          <Button onClick={() => router.push("/my-courses/new")}>
            Create New Course
          </Button>
        </div>
      </div>
    </TeacherLayout>
  );
}
