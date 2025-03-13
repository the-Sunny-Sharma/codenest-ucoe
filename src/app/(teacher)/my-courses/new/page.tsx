"use client";

// import { CourseFormData } from "@/types";
import { uploadToCloudinary } from "@/utils/cloudinary";
import React, { useState, useEffect } from "react";
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
import { Plus, Minus, Upload, X } from "lucide-react";
import TeacherLayout from "@/components/client/layouts/TeacherLayout";
import { Progress } from "@/components/ui/progress";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Image from "next/image";

const MAX_FILE_SIZE = 10000000; // 10MB
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
    .any()
    .refine((files) => files?.length == 1, "Thumbnail is required.")
    .refine(
      (files) => files[0]?.size <= MAX_FILE_SIZE,
      `Max file size is 10MB.`
    )
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files[0]?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ),
  promoVideo: z
    .any()
    .refine((files) => files?.length == 1, "Promo video is required.")
    .refine(
      (files) => files[0]?.size <= MAX_FILE_SIZE * 10,
      `Max file size is 100MB.`
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
  category: z.string().min(2, "Please specify the category"),
});

type CourseFormData = z.infer<typeof courseSchema>;

export default function CreateCoursePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState({
    thumbnail: 0,
    promoVideo: 0,
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      tags: [""],
      prerequisites: [""],
      certificate: false,
    },
  });

  const watchThumbnail = watch("thumbnail");
  const watchPromoVideo = watch("promoVideo");

  useEffect(() => {
    if (watchThumbnail && watchThumbnail[0]) {
      const file = watchThumbnail[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setThumbnailPreview(null);
    }
  }, [watchThumbnail]);

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
      const thumbnailUrl = await uploadToCloudinary(
        data.thumbnail[0],
        "image",
        setUploadProgress
      );
      const promoVideoUrl = await uploadToCloudinary(
        data.promoVideo[0],
        "video",
        setUploadProgress
      );

      const courseData = {
        ...data,
        thumbnail: thumbnailUrl,
        promoVideo: promoVideoUrl,
      };

      const response = await axios.post("/api/create-new", courseData);

      // console.log("RESPONSE: ", response);
      if (response.data.success) {
        toast.success("Course created successfully!");
        // console.log(response);
        router.push(`/courses/${response.data.courseId}/${response.data.slug}`);
      } else {
        throw new Error(response.data.error || "Failed to create course");
      }
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
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/my-courses">Courses</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Create New Course</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

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
                <Label htmlFor="category">Category</Label>
                <Input id="category" {...register("category")} />
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.category.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="thumbnail">Thumbnail</Label>
                <div className="flex items-center space-x-4">
                  <Input
                    id="thumbnail"
                    type="file"
                    accept={ACCEPTED_IMAGE_TYPES.join(",")}
                    {...register("thumbnail")}
                    className="hidden"
                  />
                  <Label
                    htmlFor="thumbnail"
                    className="cursor-pointer flex items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg"
                  >
                    {thumbnailPreview ? (
                      <img
                        src={thumbnailPreview || "/placeholder.svg"}
                        alt="Thumbnail preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <Upload className="w-8 h-8 text-gray-400" />
                    )}
                  </Label>
                  {watchThumbnail && watchThumbnail[0] && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        (
                          document.getElementById(
                            "thumbnail"
                          ) as HTMLInputElement
                        ).value = "";
                        setThumbnailPreview(null);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                {errors.thumbnail && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.thumbnail.message as string}
                  </p>
                )}
                {uploadProgress.thumbnail > 0 &&
                  uploadProgress.thumbnail < 100 && (
                    <Progress
                      value={uploadProgress.thumbnail}
                      className="w-full mt-2"
                    />
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
                {uploadProgress.promoVideo > 0 &&
                  uploadProgress.promoVideo < 100 && (
                    <Progress
                      value={uploadProgress.promoVideo}
                      className="w-full mt-2"
                    />
                  )}
              </div>
              <div>
                <Label htmlFor="price">Price (INR)</Label>
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
