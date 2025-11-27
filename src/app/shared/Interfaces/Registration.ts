import { Course } from './Course';

// Vom Backend (DTO)
export interface RegistrationDto {
  id: string;
  name: string;
  birthdate: string;
  email?: string;
  newsletter?: boolean;
  course?: Course;
  courseId: number;
}

export interface RegistrationModel {
  name: string;
  birthdate: string;
  email: string;
  newsletter: boolean;
  courseId: number;
}
