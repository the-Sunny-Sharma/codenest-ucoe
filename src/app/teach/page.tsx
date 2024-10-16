import { TeacherRegistrationForm } from "@/components/client/TeacherRegistrationForm";

export default function TeachPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Become a Teacher</h1>
      <p className="mb-8">
        Fill out the form below to register as a teacher on our platform.
      </p>
      <TeacherRegistrationForm />
    </div>
  );
}
