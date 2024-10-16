"use client";

import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const qualificationSchema = z.object({
  degree: z.string().min(2, "Degree must be at least 2 characters"),
  institution: z.string().min(2, "Institution must be at least 2 characters"),
  year: z.number().min(1900).max(new Date().getFullYear()),
});

const formSchema = z.object({
  title: z.enum(["Dr.", "Prof.", "Mr.", "Mrs.", "Ms.", "Sir"]),
  qualifications: z
    .array(qualificationSchema)
    .min(1, "At least one qualification is required"),
  expertise: z
    .array(z.string())
    .min(1, "At least one area of expertise is required"),
  bio: z.string().max(500, "Bio cannot be more than 500 characters"),
});

export function TeacherRegistrationForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "Mr.",
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
    try {
      const response = await axios.post("/api/teacher/register", values);
      toast({
        title: "Registration Successful",
        description: "You have successfully registered as a teacher.",
      });
      router.push("/dashboard");
    } catch (error) {
      toast({
        title: "Registration Failed",
        description:
          "There was an error registering you as a teacher. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a title" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Dr.">Dr.</SelectItem>
                  <SelectItem value="Prof.">Prof.</SelectItem>
                  <SelectItem value="Mr.">Mr.</SelectItem>
                  <SelectItem value="Mrs.">Mrs.</SelectItem>
                  <SelectItem value="Ms.">Ms.</SelectItem>
                  <SelectItem value="Sir">Sir</SelectItem>
                </SelectContent>
              </Select>
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
              <FormField
                control={form.control}
                name={`qualifications.${index}.year`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input {...field} type="number" placeholder="Year" />
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
                Remove
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
                Remove
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() => appendExpertise("")}
          >
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
  );
}
