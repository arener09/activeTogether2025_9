import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Store } from './store';
import { Course } from './Interfaces/Course';
import { RegistrationDto, RegistrationModel } from './Interfaces/Registration';
import { finalize, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Backend {
  private http = inject(HttpClient);
  private store = inject(Store);

  public getCourses() {
    this.store.isLoadingCourses = true;

    this.http
      .get<Course[]>('http://localhost:5000/courses?_expand=eventLocation')
      .pipe(
        finalize(() => {
          this.store.isLoadingCourses = false;
        })
      )
      .subscribe((data) => {
        this.store.courses = data;
      });
  }

  public getRegistrations() {
    this.store.isLoadingRegistrations = true;

    this.http
      .get<RegistrationDto[]>('http://localhost:5000/registrations?_expand=course')
      .pipe(
        finalize(() => {
          this.store.isLoadingRegistrations = false;
        })
      )
      .subscribe((data) => {
        this.store.registrations = data;
      });
  }

  public addRegistration(registration: RegistrationModel) {
    this.http
      .post('http://localhost:5000/registrations', registration)
      .subscribe((_) => {
        this.getRegistrations();
      });
  }

  public deleteRegistration(id: string) {
    return this.http.delete(`http://localhost:5000/registrations/${id}`).pipe(
      tap(() => {
        this.getRegistrations();
      })
    );
  }
}
