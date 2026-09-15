import coursesPodstawa from "@/data/sample-courses/podstawa.json";

export const sampleCoursesByLevel = {
  podstawówka: [],
  podstawowy: coursesPodstawa,
  rozszerzony: [],
};

export const allSampleCourses = [...coursesPodstawa];

export function getSampleCourseById(id) {
  if (!id) return null;
  return allSampleCourses.find((course) => course.id === id) ?? null;
}
