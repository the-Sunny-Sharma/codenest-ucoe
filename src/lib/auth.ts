import { User } from "@/models/userDetails";
import { connectToDatabase } from "@/lib/connectDB";

export async function getUserRole(
  email: string
): Promise<"student" | "teacher" | "admin"> {
  await connectToDatabase();
  const user = await User.findOne({ email });
  return user?.role || "student";
}
