import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Ghost } from "lucide-react";

interface CourseNotFoundProps {
  message: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
}

export function CourseNotFound({
  message,
  description,
  actionLabel,
  onAction,
}: CourseNotFoundProps) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-[350px]">
        <CardHeader>
          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-muted rounded-full">
            <Ghost className="w-6 h-6 text-muted-foreground" />
          </div>
          <CardTitle className="text-center mt-4">{message}</CardTitle>
          <CardDescription className="text-center">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button onClick={onAction}>{actionLabel}</Button>
        </CardContent>
      </Card>
    </div>
  );
}
