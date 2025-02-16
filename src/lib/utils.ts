import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import slugify from "slugify";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function generateSlug(title: string): Promise<string> {
  const Course = (await import("@/models/Course")).default; // Lazy import to avoid circular dependency

  let slug = slugify(title, {
    lower: true,
    strict: true,
    trim: true,
  });

  let counter = 0;
  let isUnique = false;

  while (!isUnique) {
    const count = await Course.countDocuments({
      slug: counter === 0 ? slug : `${slug}-${counter}`,
    });

    if (count === 0) {
      isUnique = true;
    } else {
      counter++;
    }
  }

  return counter === 0 ? slug : `${slug}-${counter}`;
}
