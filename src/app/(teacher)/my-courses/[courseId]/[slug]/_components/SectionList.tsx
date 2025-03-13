"use client";

import { useState, useCallback } from "react";
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
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { GripVertical, Plus, Trash, X } from "lucide-react";
import ChapterList from "./ChapterList";

import type { ISection, IChapter } from "@/app/types";

import { FileUpload } from "@/components/client/FileUpload";

interface SectionListProps {
  courseId: string;
  sections: ISection[];
  isEditing: boolean;
  onUpdate: (updatedSections: ISection[]) => void;
}

export default function SectionList({
  courseId,
  sections: initialSections,
  isEditing,
  onUpdate,
}: SectionListProps) {
  const [sections, setSections] = useState<ISection[]>(initialSections);

  const handleAddSection = useCallback(() => {
    const newSection: ISection = {
      _id: Date.now().toString(),
      title: "New Section",
      description: "",
      order: sections.length + 1,
      whatYoullLearn: [],
      prerequisites: [],
      totalChapters: 0,
      totalDuration: 0,
      coverPhoto: "/placeholder.svg",
      chapters: [],
    };
    const updatedSections = [...sections, newSection];
    setSections(updatedSections);
    onUpdate(updatedSections);
  }, [sections, onUpdate]);

  const handleUpdateSection = useCallback(
    (index: number, field: keyof ISection, value: any) => {
      const updatedSections = sections.map((section, i) =>
        i === index ? { ...section, [field]: value } : section
      );
      setSections(updatedSections);
      onUpdate(updatedSections);
      console.log("Updated sections:", updatedSections); // Debug log
    },
    [sections, onUpdate]
  );

  const handleDeleteSection = useCallback(
    (index: number) => {
      const updatedSections = sections.filter((_, i) => i !== index);
      setSections(updatedSections);
      onUpdate(updatedSections);
    },
    [sections, onUpdate]
  );

  const handleChapterReorder = useCallback(
    (sectionIndex: number) => (result: any) => {
      if (!result.destination) return;

      const updatedSections = [...sections];
      const section = { ...updatedSections[sectionIndex] };
      const chapters = Array.from(section.chapters);
      const [reorderedChapter] = chapters.splice(result.source.index, 1);
      chapters.splice(result.destination.index, 0, reorderedChapter);

      // Update order numbers
      const updatedChapters = chapters.map((chapter, index) => ({
        ...chapter,
        order: index + 1,
      }));

      section.chapters = updatedChapters;
      updatedSections[sectionIndex] = section;
      setSections(updatedSections);
      onUpdate(updatedSections);
    },
    [sections, onUpdate]
  );

  const handleUpdateChapters = useCallback(
    (sectionIndex: number, updatedChapters: IChapter[]) => {
      const updatedSections = sections.map((section, index) =>
        index === sectionIndex
          ? {
              ...section,
              chapters: updatedChapters,
              totalChapters: updatedChapters.length,
              totalDuration: updatedChapters.reduce(
                (total, chapter) => total + chapter.duration,
                0
              ),
            }
          : section
      );
      setSections(updatedSections);
      onUpdate(updatedSections);
      console.log("Updated sections after chapter update:", updatedSections); // Debug log
    },
    [sections, onUpdate]
  );

  console.log("Course ID", courseId);
  console.log("sections", sections);
  return (
    <div className="space-y-4">
      <Droppable droppableId="sections">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            <Accordion type="single" collapsible className="w-full">
              {sections.map((section, index) => (
                <Draggable
                  key={
                    typeof section._id === "string"
                      ? section._id
                      : section._id.toString()
                  }
                  draggableId={
                    typeof section._id === "string"
                      ? section._id
                      : section._id.toString()
                  }
                  index={index}
                >
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.draggableProps}>
                      <AccordionItem
                        value={
                          typeof section._id === "string"
                            ? section._id
                            : section._id.toString()
                        }
                        className="border rounded-lg mb-4"
                      >
                        <div className="flex items-center">
                          <div
                            {...provided.dragHandleProps}
                            className="p-2 hover:bg-accent rounded-l-lg cursor-grab"
                          >
                            <GripVertical className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <AccordionTrigger className="flex-1 hover:no-underline">
                            <div className="flex items-center justify-between w-full">
                              <span className="text-left font-medium">
                                {section.order}. {section.title}
                              </span>
                              {isEditing && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteSection(index);
                                  }}
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </AccordionTrigger>
                        </div>
                        <AccordionContent>
                          <Card>
                            <CardContent className="space-y-4">
                              <div>
                                <Label htmlFor={`section-title-${index}`}>
                                  Title
                                </Label>
                                <Input
                                  id={`section-title-${index}`}
                                  value={section.title}
                                  onChange={(e) =>
                                    handleUpdateSection(
                                      index,
                                      "title",
                                      e.target.value
                                    )
                                  }
                                  disabled={!isEditing}
                                />
                              </div>
                              <div>
                                <Label htmlFor={`section-description-${index}`}>
                                  Description
                                </Label>
                                <Textarea
                                  id={`section-description-${index}`}
                                  value={section.description}
                                  onChange={(e) =>
                                    handleUpdateSection(
                                      index,
                                      "description",
                                      e.target.value
                                    )
                                  }
                                  disabled={!isEditing}
                                />
                              </div>
                              <div>
                                <Label
                                  htmlFor={`section-whatYoullLearn-${index}`}
                                >
                                  What You&apos;ll Learn (comma-separated)
                                </Label>
                                <Input
                                  id={`section-whatYoullLearn-${index}`}
                                  value={section.whatYoullLearn.join(", ")}
                                  onChange={(e) =>
                                    handleUpdateSection(
                                      index,
                                      "whatYoullLearn",
                                      e.target.value
                                        .split(",")
                                        .map((item) => item.trim())
                                    )
                                  }
                                  disabled={!isEditing}
                                />
                              </div>
                              <div>
                                <Label
                                  htmlFor={`section-prerequisites-${index}`}
                                >
                                  Prerequisites (comma-separated)
                                </Label>
                                <Input
                                  id={`section-prerequisites-${index}`}
                                  value={section.prerequisites.join(", ")}
                                  onChange={(e) =>
                                    handleUpdateSection(
                                      index,
                                      "prerequisites",
                                      e.target.value
                                        .split(",")
                                        .map((item) => item.trim())
                                    )
                                  }
                                  disabled={!isEditing}
                                />
                              </div>
                              <div>
                                <Label htmlFor={`section-coverPhoto-${index}`}>
                                  Cover Photo
                                </Label>
                                <div className="flex items-center space-x-4">
                                  {section.coverPhoto &&
                                  section.coverPhoto !== "/placeholder.svg" ? (
                                    <>
                                      <img
                                        src={section.coverPhoto}
                                        alt="Section cover"
                                        className="mt-2 rounded-lg h-32 w-32 object-cover"
                                      />
                                      {isEditing && (
                                        <Button
                                          type="button"
                                          variant="outline"
                                          size="icon"
                                          onClick={() =>
                                            handleUpdateSection(
                                              index,
                                              "coverPhoto",
                                              "/placeholder.svg"
                                            )
                                          }
                                        >
                                          <X className="h-4 w-4" />
                                        </Button>
                                      )}
                                    </>
                                  ) : (
                                    <FileUpload
                                      // type="image"
                                      accept="image/*"
                                      maxSize={5242880} // 5MB
                                      onUploadComplete={(url) =>
                                        handleUpdateSection(
                                          index,
                                          "coverPhoto",
                                          url
                                        )
                                      }
                                    />
                                  )}
                                </div>
                              </div>

                              <DragDropContext
                                onDragEnd={handleChapterReorder(index)}
                              >
                                {/* <ChapterList
                                  sectionId={
                                    typeof section._id === "string"
                                      ? section._id
                                      : section._id.toString()
                                  }
                                  // sectionId={section._id}
                                  chapters={section.chapters}
                                  isEditing={isEditing}
                                  onUpdate={(updatedChapters) => {
                                    handleUpdateSection(
                                      index,
                                      "chapters",
                                      updatedChapters
                                    );
                                    console.log(
                                      "Updated chapters for section:",
                                      section.title,
                                      updatedChapters
                                    ); // Debug log
                                    handleUpdateSection(
                                      index,
                                      "totalChapters",
                                      updatedChapters.length
                                    );
                                    handleUpdateSection(
                                      index,
                                      "totalDuration",
                                      updatedChapters.reduce(
                                        (total, chapter) =>
                                          total + chapter.duration,
                                        0
                                      )
                                    );
                                  }}
                                /> */}
                                <ChapterList
                                  sectionId={
                                    typeof section._id === "string"
                                      ? section._id
                                      : section._id.toString()
                                  }
                                  chapters={section.chapters}
                                  isEditing={isEditing}
                                  onUpdate={(updatedChapters) =>
                                    handleUpdateChapters(index, updatedChapters)
                                  }
                                />
                              </DragDropContext>
                            </CardContent>
                          </Card>
                        </AccordionContent>
                      </AccordionItem>
                    </div>
                  )}
                </Draggable>
              ))}
            </Accordion>
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      {isEditing && (
        <Button onClick={handleAddSection}>
          <Plus className="mr-2 h-4 w-4" /> Add Section
        </Button>
      )}
    </div>
  );
}
