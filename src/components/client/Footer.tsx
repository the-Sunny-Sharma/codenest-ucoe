import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-muted py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold mb-2">CodeNest</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm hover:underline">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm hover:underline">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-sm hover:underline">
                  Careers
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Learn</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/courses" className="text-sm hover:underline">
                  All Courses
                </Link>
              </li>
              <li>
                <Link href="/live-sessions" className="text-sm hover:underline">
                  Live Sessions
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm hover:underline">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Community</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/forums" className="text-sm hover:underline">
                  Forums
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-sm hover:underline">
                  Coding Events
                </Link>
              </li>
              <li>
                <Link href="/mentorship" className="text-sm hover:underline">
                  Mentorship
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold">Project Team</h3>
              <p>Sunny Sharma, Ganesh Jha, Rushikesh Kharat</p>
            </div>
            <div className="text-center mb-4">
              <p>
                This project was made under the guidance and mentorship of Prof.
                Akshay Agrawal
              </p>
            </div>
          </div>
        </div>
        <div className="text-center text-sm text-muted-foreground pt-12">
          © 2024 CodeNest. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
