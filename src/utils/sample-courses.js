import coursesPodstawowka from "@/data/sample-courses/podstawowka.json";
import coursesPodstawa from "@/data/sample-courses/podstawa.json";
import coursesRozszerzenie from "@/data/sample-courses/rozszerzenie.json";

export const sampleCoursesByLevel = {
  podstawówka: coursesPodstawowka,
  podstawowy: coursesPodstawa,
  rozszerzony: coursesRozszerzenie,
};

export const allSampleCourses = [
  ...coursesPodstawowka,
  ...coursesPodstawa,
  ...coursesRozszerzenie,
];

export function getSampleCourseById(id) {
  if (!id) return null;
  return allSampleCourses.find((course) => course.id === id) ?? null;
}
