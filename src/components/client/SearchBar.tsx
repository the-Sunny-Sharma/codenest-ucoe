import { useState } from "react";
import { Search } from "lucide-react"; // Icon
import axios from "axios";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{
    suggestions: string[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    courses: any[];
  }>({
    suggestions: [],
    courses: [],
  });

  const router = useRouter();

  const fetchResults = async (q: string) => {
    if (!q.trim()) return setResults({ suggestions: [], courses: [] });

    try {
      const { data } = await axios.get(`/api/search?q=${q}`);
      console.log("Data", data);
      setResults(data);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const handleSearch = async () => {
    if (!query.trim()) return;
    router.push(`/courses?search=${encodeURIComponent(query)}`); //navigating to courses page
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            fetchResults(e.target.value);
          }}
          className="w-full outline-none"
        />
        {query && <button onClick={() => setQuery("")}>✖</button>}
        <Search className="ml-2 text-gray-500" onClick={handleSearch} />
      </div>

      {query &&
        (results.suggestions.length > 0 || results.courses.length > 0) && (
          <div className="absolute w-full bg-white shadow-lg mt-2 rounded-lg p-2">
            {/* Suggestions */}
            {results.suggestions.length > 0 && (
              <div className="mb-2">
                <p className="text-gray-500 font-semibold">Suggestions</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {results.suggestions.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-200 rounded text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Courses */}
            {results.courses.length > 0 && (
              <div>
                <p className="text-gray-500 font-semibold">Courses</p>
                {/* <ul>
                {results.courses.map((course) => (
                  <li key={course.id} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded">
                    <img src={course.thumbnail} alt={course.title} className="w-12 h-12 rounded" />
                    <div>
                      <p className="font-semibold">{course.title}</p>
                      <p className="text-sm text-gray-500">{course.tags.join(", ")}</p>
                    </div>
                  </li>
                ))}
              </ul> */}
                <ul>
                  {results.courses.map((course) => (
                    <li
                      key={course.id}
                      className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded"
                    >
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-12 h-12 rounded"
                      />
                      <div>
                        <p className="font-semibold">{course.name}</p>{" "}
                        {/* Show Course Name */}
                        <p className="text-sm text-gray-500">
                          {course.instructor.name}
                        </p>{" "}
                        {/* Keep tags as secondary info */}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
    </div>
  );
}
