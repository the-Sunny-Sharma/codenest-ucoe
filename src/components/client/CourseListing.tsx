import React from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Course {
  id: number;
  title: string;
  instructor: string;
  image: string;
}

interface CourseListingProps {
  courses: Course[];
}

export function CourseListing({ courses }: CourseListingProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <Card key={course.id}>
          <CardHeader>
            <Image
              src={course.image}
              alt={course.title}
              width={250}
              height={150}
              className="rounded-t-lg w-full"
            />
          </CardHeader>
          <CardContent>
            <CardTitle>{course.title}</CardTitle>
            <CardDescription>{course.instructor}</CardDescription>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Learn More
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
