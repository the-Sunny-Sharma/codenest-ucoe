"use client";

import React, { useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
// import { cn } from "@/lib/utils";
import { CalendarIcon, Plus, Minus } from "lucide-react";
// import { format } from "date-fns";
// import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TeacherPreview } from "@/components/client/TeacherPreview";

const commonTitles = ["Dr.", "Prof.", "Mr.", "Mrs.", "Ms.", "Sir"];

const qualificationSchema = z.object({
  degree: z.string().min(2, "Degree must be at least 2 characters"),
  institution: z.string().min(2, "Institution must be at least 2 characters"),
  year: z.number().min(1900).max(new Date().getFullYear()),
});

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  name: z.string().min(2, "Name is required"),
  qualifications: z
    .array(qualificationSchema)
    .min(1, "At least one qualification is required"),
  expertise: z
    .array(z.string().min(1, "Expertise cannot be empty"))
    .min(1, "At least one area of expertise is required"),
  bio: z.string().max(500, "Bio cannot be more than 500 characters"),
});

export function TeacherRegistrationForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      name: "",
      qualifications: [
        { degree: "", institution: "", year: new Date().getFullYear() },
      ],
      expertise: [""],
      bio: "",
    },
  });

  const {
    fields: qualificationFields,
    append: appendQualification,
    remove: removeQualification,
  } = useFieldArray({
    control: form.control,
    name: "qualifications",
  });

  const {
    fields: expertiseFields,
    append: appendExpertise,
    remove: removeExpertise,
  } = useFieldArray({
    control: form.control,
    name: "expertise",
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    setError(null);
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const response = await axios.post("/api/teacher/register", values);
      toast({
        title: "Registration Successful",
        description: "You have successfully registered as a teacher.",
      });
      router.push("/dashboard");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || "An unknown error occurred";
        setError(errorMessage);
        toast({
          title: "Registration Failed",
          description: errorMessage,
          variant: "destructive",
        });
      } else {
        setError("An unexpected error occurred. Please try again.");
        toast({
          title: "Registration Failed",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 flex-1"
        >
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full">
                      {field.value || "Select or enter a title"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-2 w-64">
                    <div className="space-y-2">
                      {commonTitles.map((title) => (
                        <Button
                          key={title}
                          variant="ghost"
                          className="w-full text-left"
                          onClick={() => field.onChange(title)}
                        >
                          {title}
                        </Button>
                      ))}
                      <Input
                        placeholder="Custom title..."
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </div>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Your full name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <FormLabel>Qualifications</FormLabel>
            {qualificationFields.map((field, index) => (
              <div key={field.id} className="flex space-x-2 mb-2">
                <FormField
                  control={form.control}
                  name={`qualifications.${index}.degree`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input {...field} placeholder="Degree" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`qualifications.${index}.institution`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input {...field} placeholder="Institution" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* <FormField
                  control={form.control}
                  name={`qualifications.${index}.year`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? format(new Date(field.value, 0, 1), "yyyy")
                                : "Select year"}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            captionLayout="dropdown-buttons"
                            selected={
                              field.value
                                ? new Date(field.value, 0, 1)
                                : undefined
                            }
                            onSelect={(date) =>
                              field.onChange(
                                date ? date.getFullYear() : undefined
                              )
                            }
                            fromYear={1900}
                            toYear={new Date().getFullYear()}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}
                <FormField
                  control={form.control}
                  name={`qualifications.${index}.year`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <select
                          className="border border-gray-300 rounded-md p-2 w-full"
                          value={field.value}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        >
                          {Array.from(
                            { length: new Date().getFullYear() - 1899 },
                            (_, i) => new Date().getFullYear() - i
                          ).map((year) => (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => removeQualification(index)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                appendQualification({
                  degree: "",
                  institution: "",
                  year: new Date().getFullYear(),
                })
              }
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Qualification
            </Button>
          </div>

          <div>
            <FormLabel>Areas of Expertise</FormLabel>
            {expertiseFields.map((field, index) => (
              <div key={field.id} className="flex space-x-2 mb-2">
                <FormField
                  control={form.control}
                  name={`expertise.${index}`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input {...field} placeholder="Area of Expertise" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => removeExpertise(index)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => appendExpertise("")}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Expertise
            </Button>
          </div>

          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us about yourself and your teaching experience"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Your bio should not exceed 500 characters.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Register as Teacher"}
          </Button>
        </form>
      </Form>
      <div className="flex-1">
        <h2 className="text-2xl font-bold mb-4">Preview</h2>
        <TeacherPreview {...form.watch()} />
      </div>
    </div>
  );
}
