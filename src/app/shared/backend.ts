import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Store } from './store';
import { Course } from './Interfaces/Course';
import { RegistrationDto, RegistrationModel } from './Interfaces/Registration';

@Injectable({
  providedIn: 'root',
})
export class Backend {
  private http = inject(HttpClient);
  private store = inject(Store);

  public getCourses() {
    this.http
      .get<Course[]>('http://localhost:5000/courses?_expand=eventLocation')
      .subscribe((data) => {
        this.store.courses = data;
      });
  }

  public getRegistrations() {
    this.http
      .get<RegistrationDto[]>('http://localhost:5000/registrations?_expand=course')
      .subscribe((data) => {
        this.store.registrations = data;
      });
  }

  public addRegistration(registration: RegistrationModel) {
    this.http.post('http://localhost:5000/registrations', registration).subscribe((_) => {
      this.getRegistrations();
    });
  }

  public deleteRegistration(id: string) {
    this.http.delete(`http://localhost:5000/registrations/${id}`).subscribe((_) => {
      this.getRegistrations();
    });
  }
}
