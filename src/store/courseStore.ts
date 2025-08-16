import { create } from 'zustand';

export interface Subject {
    id: string;
    name: string;
    description?: string;
    semesterId: string;
    createdAt: string;
    updatedAt: string;
}

export interface Semester {
    id: string;
    name: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Course {
    id: string;
    title: string;
    description: string;
    subjectId: string;
    type: 'note' | 'video' | 'summary' | 'quiz';
    content?: string;
    fileUrl?: string;
    createdAt: string;
    updatedAt: string;
}

interface CourseState {
    // Data
    subjects: Subject[];
    semesters: Semester[];
    courses: Course[];

    // UI State
    isLoading: boolean;
    error: string | null;
    selectedSubject: Subject | null;
    selectedSemester: Semester | null;

    // Actions
    setSubjects: (subjects: Subject[]) => void;
    setSemesters: (semesters: Semester[]) => void;
    setCourses: (courses: Course[]) => void;

    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;

    setSelectedSubject: (subject: Subject | null) => void;
    setSelectedSemester: (semester: Semester | null) => void;

    addSubject: (subject: Subject) => void;
    updateSubject: (id: string, updates: Partial<Subject>) => void;
    deleteSubject: (id: string) => void;

    addSemester: (semester: Semester) => void;
    updateSemester: (id: string, updates: Partial<Semester>) => void;
    deleteSemester: (id: string) => void;

    addCourse: (course: Course) => void;
    updateCourse: (id: string, updates: Partial<Course>) => void;
    deleteCourse: (id: string) => void;

    reset: () => void;
}

export const useCourseStore = create<CourseState>((set, get) => ({
    // Initial state
    subjects: [],
    semesters: [],
    courses: [],

    isLoading: false,
    error: null,
    selectedSubject: null,
    selectedSemester: null,

    // Actions
    setSubjects: (subjects) => set({ subjects }),
    setSemesters: (semesters) => set({ semesters }),
    setCourses: (courses) => set({ courses }),

    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),

    setSelectedSubject: (subject) => set({ selectedSubject: subject }),
    setSelectedSemester: (semester) => set({ selectedSemester: semester }),

    addSubject: (subject) => set((state) => ({
        subjects: [...state.subjects, subject]
    })),

    updateSubject: (id, updates) => set((state) => ({
        subjects: state.subjects.map(subject =>
            subject.id === id ? { ...subject, ...updates } : subject
        )
    })),

    deleteSubject: (id) => set((state) => ({
        subjects: state.subjects.filter(subject => subject.id !== id)
    })),

    addSemester: (semester) => set((state) => ({
        semesters: [...state.semesters, semester]
    })),

    updateSemester: (id, updates) => set((state) => ({
        semesters: state.semesters.map(semester =>
            semester.id === id ? { ...semester, ...updates } : semester
        )
    })),

    deleteSemester: (id) => set((state) => ({
        semesters: state.semesters.filter(semester => semester.id !== id)
    })),

    addCourse: (course) => set((state) => ({
        courses: [...state.courses, course]
    })),

    updateCourse: (id, updates) => set((state) => ({
        courses: state.courses.map(course =>
            course.id === id ? { ...course, ...updates } : course
        )
    })),

    deleteCourse: (id) => set((state) => ({
        courses: state.courses.filter(course => course.id !== id)
    })),

    reset: () => set({
        subjects: [],
        semesters: [],
        courses: [],
        isLoading: false,
        error: null,
        selectedSubject: null,
        selectedSemester: null
    })
}));
