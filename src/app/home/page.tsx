import { AlertBanner } from "@/components/client/AlertBanner";
import { CourseListing } from "@/components/client/CourseListing";
import { Footer } from "@/components/client/Footer";
import { Navbar } from "@/components/client/Navbar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, CheckCircle2, ChevronDown, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { auth } from "@/auth";
import { User } from "@/models/userDetails";
import { connectToDatabase } from "@/lib/connectDB";
import { redirect } from "next/navigation";

const categories = [
  "Web Development",
  "Data Science",
  "Mobile Development",
  "Game Development",
  "Machine Learning",
  "DevOps",
  "Cybersecurity",
  "Blockchain",
];

const featuredCourses = [
  {
    id: 1,
    title: "Interactive Python Fundamentals",
    instructor: "Dr. Jane Doe",
    image: "/placeholder.svg?height=150&width=250",
  },
  {
    id: 2,
    title: "Full-Stack JavaScript Mastery",
    instructor: "Prof. John Smith",
    image: "/placeholder.svg?height=150&width=250",
  },
  {
    id: 3,
    title: "Data Structures & Algorithms in C++",
    instructor: "Dr. Emily Brown",
    image: "/placeholder.svg?height=150&width=250",
  },
];

const projectTasks = [
  { name: "Project Planning", status: "completed" },
  { name: "System Architecture Design", status: "completed" },
  { name: "Database Design", status: "completed" },
  { name: "User Authentication", status: "completed" },
  { name: "Course Management System", status: "in-progress" },
  { name: "Video Streaming Integration", status: "completed" },
  { name: "Code Editor Integration", status: "completed" },
  { name: "Real-time Collaboration", status: "completed" },
  { name: "Payment Integration", status: "completed" },
  { name: "User Interface Design", status: "in-progress" },
  { name: "Frontend Development", status: "in-progress" },
  { name: "Backend API Development", status: "not-started" },
  { name: "Integration and Testing", status: "not-started" },
  { name: "Bug Fixing and Optimization", status: "not-started" },
  { name: "Deployment Preparation", status: "not-started" },
  { name: "User Acceptance Testing", status: "not-started" },
  { name: "Final Adjustments and Launch", status: "not-started" },
];

async function getUserRole(email: string) {
  await connectToDatabase();
  const user = await User.findOne({ email });
  return user?.role || "student";
}

export default async function HomePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const userRole = session?.user?.email
    ? await getUserRole(session.user.email)
    : "student";

  const completedTasks = projectTasks.filter(
    (task) => task.status === "completed"
  ).length;
  const totalTasks = projectTasks.length;
  const progress = Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className="min-h-screen bg-background">
      <AlertBanner />
      <Navbar />

      <main>
        <section className="bg-muted py-12 px-5">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-8 md:mb-0">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                  Master Coding through Interactive Learning
                </h1>
                <p className="text-lg md:text-xl mb-6">
                  Join live coding sessions, collaborate in real-time, and build
                  your skills with expert instructors.
                </p>
                <Button size="lg" asChild>
                  <Link href="/courses">Explore Courses</Link>
                </Button>
              </div>
              <div className="md:w-1/2">
                <Image
                  src="/assets/student_coding.png"
                  alt="Student coding"
                  width={600}
                  height={400}
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6">Project Progress</h2>
            <div className="mb-4">
              <Progress value={progress} className="w-full" />
            </div>
            <p className="text-center text-lg font-medium mb-8">
              {progress}% Complete
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projectTasks.map((task, index) => (
                <div key={index} className="flex items-center space-x-2">
                  {task.status === "completed" && (
                    <CheckCircle2 className="text-green-500" />
                  )}
                  {task.status === "in-progress" && (
                    <Clock className="text-yellow-500" />
                  )}
                  {task.status === "not-started" && (
                    <AlertTriangle className="text-gray-400" />
                  )}
                  <span
                    className={
                      task.status === "completed" ? "line-through" : ""
                    }
                  >
                    {task.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6">Featured Courses</h2>
            <CourseListing courses={featuredCourses} />
          </div>
        </section>

        <section className="bg-muted py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6">Top Categories</h2>
            <div className="space-y-2">
              {categories.map((category) => (
                <div
                  key={category}
                  className="border rounded-lg overflow-hidden"
                >
                  <Button
                    variant="ghost"
                    className="w-full justify-between text-left p-4"
                  >
                    {category}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {userRole === "teacher" ? (
          <section className="py-12 bg-primary text-primary-foreground">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold mb-4">Welcome, Instructor!</h2>
              <p className="mb-6">
                Ready to inspire the next generation of developers? Manage your
                courses and connect with students.
              </p>
              <div className="space-x-4">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/dashboard">Instructor Dashboard</Link>
                </Button>
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/create-course">Create New Course</Link>
                </Button>
              </div>
            </div>
          </section>
        ) : (
          <section className="py-12">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-2xl font-bold mb-4">Become an Instructor</h2>
              <p className="mb-6">
                Share your coding expertise and inspire the next generation of
                developers.
              </p>
              <Button size="lg" asChild>
                <Link href="/teach">Start Teaching</Link>
              </Button>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
