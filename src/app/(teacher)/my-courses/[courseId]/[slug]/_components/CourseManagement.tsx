"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  BarChart,
  Clock,
  DollarSign,
  Users,
  Video,
  Pencil,
  Trash,
  Share2,
} from "lucide-react";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import SectionList from "./SectionList";
import type { ICourse } from "@/app/types";

interface CourseManagementProps {
  initialCourse: ICourse;
}

export default function CourseManagement({
  initialCourse,
}: CourseManagementProps) {
  const [course, setCourse] = useState<ICourse>(initialCourse);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCourse((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setCourse((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setCourse((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSave = async () => {
    try {
      // Convert _id to valid ObjectId format (ensure it's 24-char hex)
      const formattedCourse = {
        ...course,
        sections: course.sections.map((section) => ({
          ...section,
          _id:
            typeof section._id === "string" && section._id.length === 24
              ? section._id
              : undefined,
          chapters: section.chapters.map((chapter) => ({
            ...chapter,

            _id:
              typeof chapter._id === "string" && chapter._id.length === 24
                ? chapter._id
                : undefined,
          })),
        })),
      };

      // console.log("Saving course:", formattedCourse); // Debug log

      const response = await fetch(`/api/courses/${course._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedCourse),
      });

      if (!response.ok) {
        throw new Error("Failed to update course");
      }

      toast.success("Course updated successfully");
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      toast.error("Failed to update course");
      console.error("Error updating course:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/courses/${course._id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete course");
      }

      toast.success("Course deleted successfully");
      router.push("/teacher/courses");
    } catch (error) {
      toast.error("Failed to delete course");
      console.error("Error deleting course:", error);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSectionReorder = async (result: any) => {
    if (!result.destination) return;

    const sections = Array.from(course.sections);
    const [reorderedSection] = sections.splice(result.source.index, 1);
    sections.splice(result.destination.index, 0, reorderedSection);

    // Update order numbers
    const updatedSections = sections.map((section, index) => ({
      ...section,
      order: index + 1,
    }));

    setCourse((prev) => ({ ...prev, sections: updatedSections }));

    try {
      await fetch(`/api/courses/${course._id}/sections/reorder`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sections: updatedSections }),
      });
    } catch (error) {
      console.error("Error reordering sections:", error);
      toast.error("Failed to save section order");
    }
  };

  const getShareableLink = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/courses/${course.slug}/enroll?code=${course.classCode}`;
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{course.name}</h1>
        <div className="space-x-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Share2 className="mr-2 h-4 w-4" /> Share Class Code
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Share Course</DialogTitle>
                <DialogDescription>
                  Share this link with students to give them instant access to
                  the course.
                </DialogDescription>
              </DialogHeader>
              <div className="flex items-center gap-2">
                <Input
                  readOnly
                  value={getShareableLink()}
                  onClick={(e) => e.currentTarget.select()}
                />
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(getShareableLink());
                    toast.success("Link copied to clipboard");
                  }}
                >
                  Copy
                </Button>
              </div>
              <div className="mt-2">
                <p className="text-sm text-muted-foreground">
                  Class Code: {course.classCode}
                </p>
              </div>
            </DialogContent>
          </Dialog>

          {!isEditing && (
            <Button onClick={() => setIsEditing(true)}>
              <Pencil className="mr-2 h-4 w-4" /> Edit Course
            </Button>
          )}
          {isEditing && (
            <>
              <Button onClick={handleSave} variant="default">
                Save Changes
              </Button>
              <Button onClick={() => setIsEditing(false)} variant="outline">
                Cancel
              </Button>
            </>
          )}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash className="mr-2 h-4 w-4" /> Delete Course
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you sure you want to delete this course?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  course and remove all data associated with it.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Course Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Course Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={course.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={course.description}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={course.price}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="level">Level</Label>
                    <Select
                      name="level"
                      value={course.level}
                      onValueChange={(value) =>
                        handleSelectChange("level", value)
                      }
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">
                          Intermediate
                        </SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select
                      name="category"
                      value={course.category}
                      onValueChange={(value) =>
                        handleSelectChange("category", value)
                      }
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Web Development">
                          Web Development
                        </SelectItem>
                        <SelectItem value="Mobile Development">
                          Mobile Development
                        </SelectItem>
                        <SelectItem value="Data Science">
                          Data Science
                        </SelectItem>
                        <SelectItem value="Machine Learning">
                          Machine Learning
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    name="tags"
                    value={course.tags.join(", ")}
                    onChange={(e) =>
                      handleInputChange({
                        target: {
                          name: "tags",
                          value: e.target.value
                            .split(",")
                            .map((tag) => tag.trim()),
                        },
                      } as unknown as React.ChangeEvent<HTMLInputElement>)
                    }
                    disabled={!isEditing}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="certificate"
                    name="certificate"
                    checked={course.certificate}
                    onCheckedChange={(checked) =>
                      handleSwitchChange("certificate", checked)
                    }
                    disabled={!isEditing}
                  />
                  <Label htmlFor="certificate">Offer Certificate</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Course Content</CardTitle>
            </CardHeader>
            <CardContent>
              <DragDropContext onDragEnd={handleSectionReorder}>
                <Droppable droppableId="sections">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      <SectionList
                        courseId={
                          typeof course._id === "string"
                            ? course._id
                            : course._id.toString()
                        }
                        sections={course.sections}
                        isEditing={isEditing}
                        onUpdate={(updatedSections) => {
                          setCourse((prev) => ({
                            ...prev,
                            sections: updatedSections,
                          }));
                        }}
                      />

                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Course Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>Enrolled Students</span>
                  </div>
                  <Badge>{course.enrolledStudents.length}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>Total Hours</span>
                  </div>
                  <Badge>{course.totalHours}h</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>Total Revenue</span>
                  </div>
                  <Badge>
                    ₹
                    {(course.enrolledStudents.length * course.price).toFixed(2)}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button className="w-full" asChild>
                  <a
                    href={`/courses/${course.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Video className="mr-2 h-4 w-4" /> Preview Course
                  </a>
                </Button>
                <Button className="w-full" variant="outline" asChild>
                  <a href={`/teacher/courses/${course._id}/analytics`}>
                    <BarChart className="mr-2 h-4 w-4" /> View Analytics
                  </a>
                </Button>
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() =>
                    router.push(`/teacher/courses/${course._id}/students`)
                  }
                >
                  <Users className="mr-2 h-4 w-4" /> Manage Students
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
