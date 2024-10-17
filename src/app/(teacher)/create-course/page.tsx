"use client";

import TeacherLayout from "@/components/client/layouts/TeacherLayout";
import React, { useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, Minus } from "lucide-react";

const MAX_FILE_SIZE = 5000000; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
const ACCEPTED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/ogg"];

const courseSchema = z.object({
  name: z.string().min(3, "Course name must be at least 3 characters long"),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters long"),
  thumbnail: z
    .instanceof(FileList)
    .refine((files) => files.length == 1, "Thumbnail is required.")
    .refine((files) => files[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files[0]?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ),
  promoVideo: z
    .instanceof(FileList)
    .refine((files) => files.length == 1, "Promo video is required.")
    .refine(
      (files) => files[0]?.size <= MAX_FILE_SIZE * 10,
      `Max file size is 50MB.`
    )
    .refine(
      (files) => ACCEPTED_VIDEO_TYPES.includes(files[0]?.type),
      "Only .mp4, .webm and .ogg formats are supported."
    ),
  price: z.number().min(0, "Price must be a positive number"),
  level: z.enum(["Beginner", "Intermediate", "Advanced"]),
  tags: z.array(z.string()).min(1, "Please add at least one tag"),
  prerequisites: z.array(z.string()),
  language: z.string().min(2, "Please specify the language"),
  certificate: z.boolean(),
});

type CourseFormData = z.infer<typeof courseSchema>;

export default function CreateCoursePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      tags: [""],
      prerequisites: [""],
      certificate: false,
    },
  });

  const {
    fields: tagFields,
    append: appendTag,
    remove: removeTag,
  } = useFieldArray({
    control,
    name: "tags",
  });

  const {
    fields: prerequisiteFields,
    append: appendPrerequisite,
    remove: removePrerequisite,
  } = useFieldArray({
    control,
    name: "prerequisites",
  });

  const onSubmit = async (data: CourseFormData) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("thumbnail", data.thumbnail[0]);
      formData.append("promoVideo", data.promoVideo[0]);
      formData.append("price", data.price.toString());
      formData.append("level", data.level);
      data.tags.forEach((tag) => formData.append("tags[]", tag));
      data.prerequisites.forEach((prerequisite) =>
        formData.append("prerequisites[]", prerequisite)
      );
      formData.append("language", data.language);
      formData.append("certificate", data.certificate.toString());

      const response = await axios.post("/api/courses", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Course created successfully!");
      router.push(`/courses/${response.data.slug}`);
    } catch (error) {
      toast.error("Failed to create course. Please try again.");
      console.error("Error creating course:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <TeacherLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Create a New Course</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Course Details</CardTitle>
              <CardDescription>
                Provide the main information about your course.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Course Name</Label>
                <Input id="name" {...register("name")} />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="description">Course Description</Label>
                <Textarea id="description" {...register("description")} />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="thumbnail">Thumbnail</Label>
                <Input
                  id="thumbnail"
                  type="file"
                  accept={ACCEPTED_IMAGE_TYPES.join(",")}
                  {...register("thumbnail")}
                />
                {errors.thumbnail && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.thumbnail.message as string}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="promoVideo">Promo Video</Label>
                <Input
                  id="promoVideo"
                  type="file"
                  accept={ACCEPTED_VIDEO_TYPES.join(",")}
                  {...register("promoVideo")}
                />
                {errors.promoVideo && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.promoVideo.message as string}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  {...register("price", { valueAsNumber: true })}
                />
                {errors.price && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.price.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="level">Level</Label>
                <Controller
                  name="level"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select course level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">
                          Intermediate
                        </SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.level && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.level.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="language">Language</Label>
                <Input id="language" {...register("language")} />
                {errors.language && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.language.message}
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="certificate" {...register("certificate")} />
                <Label htmlFor="certificate">Offer Certificate</Label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
              <CardDescription>
                Add tags to help students find your course.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {tagFields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex items-center space-x-2 mb-2"
                >
                  <Input {...register(`tags.${index}`)} />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeTag(index)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => appendTag("")}
              >
                <Plus className="h-4 w-4 mr-2" /> Add Tag
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Prerequisites</CardTitle>
              <CardDescription>
                List any prerequisites for your course.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {prerequisiteFields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex items-center space-x-2 mb-2"
                >
                  <Input {...register(`prerequisites.${index}`)} />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removePrerequisite(index)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => appendPrerequisite("")}
              >
                <Plus className="h-4 w-4 mr-2" /> Add Prerequisite
              </Button>
            </CardContent>
          </Card>

          <CardFooter>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creating Course..." : "Create Course"}
            </Button>
          </CardFooter>
        </form>
      </div>
    </TeacherLayout>
  );
}
