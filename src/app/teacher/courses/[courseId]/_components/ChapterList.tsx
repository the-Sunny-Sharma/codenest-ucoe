import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Plus, Trash } from "lucide-react";
import { toast } from "sonner";

interface Chapter {
  _id: string;
  title: string;
  description: string;
  duration: number;
  order: number;
}

interface ChapterListProps {
  courseId: string;
  chapters: Chapter[];
  isEditing: boolean;
}

export default function ChapterList({
  courseId,
  chapters: initialChapters,
  isEditing,
}: ChapterListProps) {
  const [chapters, setChapters] = useState<Chapter[]>(initialChapters);

  const handleAddChapter = () => {
    const newChapter: Chapter = {
      _id: Date.now().toString(), // Temporary ID
      title: "New Chapter",
      description: "",
      duration: 0,
      order: chapters.length + 1,
    };
    setChapters([...chapters, newChapter]);
  };

  const handleUpdateChapter = (
    index: number,
    field: keyof Chapter,
    value: string | number
  ) => {
    const updatedChapters = [...chapters];
    updatedChapters[index] = { ...updatedChapters[index], [field]: value };
    setChapters(updatedChapters);
  };

  const handleDeleteChapter = (index: number) => {
    const updatedChapters = chapters.filter((_, i) => i !== index);
    setChapters(updatedChapters);
  };

  const handleSaveChapters = async () => {
    try {
      const response = await fetch(`/api/courses/${courseId}/chapters`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chapters }),
      });

      if (!response.ok) {
        throw new Error("Failed to update chapters");
      }

      toast.success("Chapters updated successfully");
    } catch (error) {
      toast.error("Failed to update chapters");
      console.error("Error updating chapters:", error);
    }
  };

  return (
    <div className="space-y-4">
      <Accordion type="single" collapsible className="w-full">
        {chapters.map((chapter, index) => (
          <AccordionItem key={chapter._id} value={chapter._id}>
            <AccordionTrigger>
              <div className="flex items-center justify-between w-full">
                <span>{chapter.title}</span>
                {isEditing && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteChapter(index);
                    }}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Card>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor={`chapter-title-${index}`}>Title</Label>
                    <Input
                      id={`chapter-title-${index}`}
                      value={chapter.title}
                      onChange={(e) =>
                        handleUpdateChapter(index, "title", e.target.value)
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`chapter-description-${index}`}>
                      Description
                    </Label>
                    <Textarea
                      id={`chapter-description-${index}`}
                      value={chapter.description}
                      onChange={(e) =>
                        handleUpdateChapter(
                          index,
                          "description",
                          e.target.value
                        )
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`chapter-duration-${index}`}>
                      Duration (minutes)
                    </Label>
                    <Input
                      id={`chapter-duration-${index}`}
                      type="number"
                      value={chapter.duration}
                      onChange={(e) =>
                        handleUpdateChapter(
                          index,
                          "duration",
                          Number.parseInt(e.target.value)
                        )
                      }
                      disabled={!isEditing}
                    />
                  </div>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      {isEditing && (
        <div className="flex justify-between">
          <Button onClick={handleAddChapter}>
            <Plus className="mr-2 h-4 w-4" /> Add Chapter
          </Button>
          <Button onClick={handleSaveChapters}>Save Chapters</Button>
        </div>
      )}
    </div>
  );
}
