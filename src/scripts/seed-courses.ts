import { faker } from "@faker-js/faker";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Course from "../models/Course";
import { User } from "../models/userDetails";

// Load environment variables from .env
dotenv.config();

// Get MongoDB URI from .env or use local fallback
const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://syn8433898723:WvfN3A7NOyf5Djxz@bookwizard.injtshl.mongodb.net/CodeNest_UCOE?retryWrites=true&w=majority";

// Function to connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as mongoose.ConnectOptions);
    console.log("✅ MongoDB connected successfully!");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1); // Exit script if connection fails
  }
}

const categories = [
  "Web Development",
  "Mobile Development",
  "Data Science",
  "Machine Learning",
  "Cloud Computing",
  "DevOps",
  "Cybersecurity",
  "Blockchain",
  "Game Development",
  "UI/UX Design",
];

const tags = [
  "JavaScript",
  "Python",
  "React",
  "Node.js",
  "Angular",
  "Vue.js",
  "MongoDB",
  "SQL",
  "AWS",
  "Docker",
  "Kubernetes",
  "Git",
  "TypeScript",
  "Java",
  "Swift",
  "Kotlin",
  "Flutter",
  "Firebase",
];

const languages = [
  "English",
  "Spanish",
  "Hindi",
  "Chinese",
  "French",
  "German",
];

async function generateCourses() {
  try {
    console.log("🔄 Seeding courses...");

    // First, create some teacher users if they don't exist
    const teachers = await Promise.all(
      Array(10)
        .fill(null)
        .map(async () => {
          const teacher = new User({
            name: faker.person.fullName(),
            email: faker.internet.email(),
            role: "teacher",
            avatarUrl: faker.image.avatar(),
          });

          try {
            return await teacher.save();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } catch (error: any) {
            if (error.code === 11000) {
              // If duplicate email, just return a new object with an _id
              return { _id: new mongoose.Types.ObjectId() };
            }
            throw error;
          }
        })
    );

    // Generate 50 courses
    const courses = Array(50)
      .fill(null)
      .map(() => {
        const name = faker.company.catchPhrase();
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        const classCode = faker.string.alphanumeric(8).toUpperCase();

        return {
          name,
          slug,
          description: faker.lorem.paragraphs(3),
          thumbnail: `https://picsum.photos/seed/${slug}/800/600`,
          promoVideo: `https://example.com/videos/${slug}.mp4`,
          instructor: teachers[Math.floor(Math.random() * teachers.length)]._id,
          price: faker.number.int({ min: 0, max: 199 }),
          classCode,
          totalHours: faker.number.int({ min: 5, max: 50 }),
          level: ["Beginner", "Intermediate", "Advanced"][
            Math.floor(Math.random() * 3)
          ],
          tags: faker.helpers.arrayElements(tags, { min: 2, max: 5 }),
          prerequisites: faker.lorem
            .sentences(2)
            .split(".")
            .filter((s) => s.trim()),
          chapters: Array(faker.number.int({ min: 5, max: 15 }))
            .fill(null)
            .map((_, index) => ({
              title: faker.company.catchPhrase(),
              description: faker.lorem.paragraph(),
              thumbnail: `https://picsum.photos/seed/${slug}-${index}/400/300`,
              videoUrls: [`https://example.com/videos/${slug}-${index}.mp4`],
              duration: faker.number.int({ min: 30, max: 120 }),
              order: index + 1,
            })),
          rating: faker.number.float({ min: 3.5, max: 5, fractionDigits: 1 }),
          numberOfReviews: faker.number.int({ min: 0, max: 500 }),
          language: faker.helpers.arrayElement(languages),
          certificate: faker.datatype.boolean(),
          status: "published",
          category: faker.helpers.arrayElement(categories),
          publishedAt: faker.date.past(),
        };
      });

    // Insert all courses
    await Course.insertMany(courses);
    console.log("✅ Successfully seeded 50 courses!");
  } catch (error) {
    console.error("❌ Error seeding courses:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB.");
  }
}

// Run the script
async function main() {
  await connectDB();
  await generateCourses();
}

main();
// npx tsx src/scripts/seed-courses.ts
