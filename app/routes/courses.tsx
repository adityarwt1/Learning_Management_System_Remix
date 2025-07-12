import { LoaderFunction, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

export const loader: LoaderFunction = async ({
  params,
}: LoaderFunctionArgs) => {
  // Add your course loading logic here
  return { courses: [] };
};

export default function CoursesPage() {
  const { courses } = useLoaderData<typeof loader>();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCourses = courses.filter((course: any) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  useEffect(() => {
    
  }, []);
  return (
    <div className="container mx-auto p-6">
      {/* Search Bar */}
      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Search Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Course Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course: any) => (
          <Card key={course.id}>
            <CardHeader>
              <CardTitle>{course.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{course.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCourses.length === 0 && searchQuery && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            No courses found matching "{searchQuery}"
          </p>
        </div>
      )}
    </div>
  );
}
