import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { Course } from '../models/course.model';
import { GetCoursesResponse } from '../models/get-courses.response';

@Injectable({
  providedIn: 'root',
})
export class CoursesService {
  env = environment;
  http = inject(HttpClient);

  async loadAllCourses(): Promise<Course[]> {
    const courseRes$ = this.http.get<GetCoursesResponse>(
      `${this.env.apiRoot}/courses`
    );
    const coursesPromise = await firstValueFrom(courseRes$);
    return coursesPromise.courses as Course[];
  }

  async createCourse(course: Partial<Course>): Promise<Course> {
    const response$ = this.http.post<Course>(
      `${this.env.apiRoot}/courses`,
      course
    );

    return firstValueFrom(response$);
  }

  async saveCourse(
    courseId: string,
    changes: Partial<Course>
  ): Promise<Course> {
    const response$ = this.http.put<Course>(
      `${this.env.apiRoot}/courses`,
      changes
    );

    return firstValueFrom(response$);
  }

  async deleteCourse(courseId: string): Promise<any> {
    const response$ = this.http.delete(
      `${this.env.apiRoot}/courses/${courseId}`
    );
    return firstValueFrom(response$);
  }
}
