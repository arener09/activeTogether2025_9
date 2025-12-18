import { Injectable } from '@angular/core';
import { RegistrationDto } from './Interfaces/Registration';
import { Course } from './Interfaces/Course';

@Injectable({
  providedIn: 'root',
})
export class Store {
  public courses: Course[] = [];
  public registrations: RegistrationDto[] = [];

  public isLoadingCourses = false;
  public isLoadingRegistrations = false;

  public get isInitialLoading(): boolean {
    return this.isLoadingCourses || this.isLoadingRegistrations;
  }
}
