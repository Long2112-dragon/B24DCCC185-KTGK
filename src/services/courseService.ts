import { Course } from '@/models/course';

const STORAGE_KEY = 'courses';

const sampleCourses: Course[] = [
  {
    id: '1',
    name: 'Lập trình JavaScript',
    instructor: 'Nguyễn Văn A',
    studentCount: 50,
    description: '<p>Khóa học cơ bản về JavaScript</p>',
    status: 'open',
  },
  {
    id: '2',
    name: 'React Advanced',
    instructor: 'Trần Thị B',
    studentCount: 30,
    description: '<p>Khóa học nâng cao React</p>',
    status: 'open',
  },
  {
    id: '3',
    name: 'Node.js Basics',
    instructor: 'Lê Văn C',
    studentCount: 0,
    description: '<p>Giới thiệu Node.js</p>',
    status: 'paused',
  },
];

export const getCourses = (): Course[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    return JSON.parse(data);
  } else {
    // Initialize with sample data
    saveCourses(sampleCourses);
    return sampleCourses;
  }
};

export const saveCourses = (courses: Course[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
};

export const addCourse = (course: Omit<Course, 'id'>): Course => {
  const courses = getCourses();
  const newCourse: Course = {
    ...course,
    id: Date.now().toString(),
  };
  courses.push(newCourse);
  saveCourses(courses);
  return newCourse;
};

export const updateCourse = (id: string, updatedCourse: Partial<Course>): boolean => {
  const courses = getCourses();
  const index = courses.findIndex(c => c.id === id);
  if (index !== -1) {
    courses[index] = { ...courses[index], ...updatedCourse };
    saveCourses(courses);
    return true;
  }
  return false;
};

export const deleteCourse = (id: string): boolean => {
  const courses = getCourses();
  const filtered = courses.filter(c => c.id !== id);
  if (filtered.length < courses.length) {
    saveCourses(filtered);
    return true;
  }
  return false;
};

export const getCourseById = (id: string): Course | undefined => {
  const courses = getCourses();
  return courses.find(c => c.id === id);
};

export const isCourseNameUnique = (name: string, excludeId?: string): boolean => {
  const courses = getCourses();
  return !courses.some(c => c.name === name && c.id !== excludeId);
};