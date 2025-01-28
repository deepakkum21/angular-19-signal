import {
  afterNextRender,
  Component,
  computed,
  effect,
  inject,
  Injector,
  signal,
} from '@angular/core';
import { CoursesService } from '../services/courses.service';
import { Course, sortCoursesBySeqNo } from '../models/course.model';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { CoursesCardListComponent } from '../courses-card-list/courses-card-list.component';
import { MatDialog } from '@angular/material/dialog';
import { MessagesService } from '../messages/messages.service';
import { catchError, from, throwError } from 'rxjs';
import {
  toObservable,
  toSignal,
  outputToObservable,
  outputFromObservable,
} from '@angular/core/rxjs-interop';
import { CoursesServiceWithFetch } from '../services/courses-fetch.service';

@Component({
  selector: 'home',
  imports: [MatTabGroup, MatTab, CoursesCardListComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  #courses = signal<Course[]>([]); // # is a ECMA 22 way of declaring private fields

  beginnerCourses = computed(() => {
    const allCourses = this.#courses();
    return allCourses.filter(
      (course: Course) => course.category === 'BEGINNER'
    );
  });

  advancedCourses = computed(() => {
    const allCourses = this.#courses();
    return allCourses.filter(
      (course: Course) => course.category === 'ADVANCED'
    );
  });

  //   coursesFetchService = inject(CoursesServiceWithFetch); // other than in constructor other way to inject service
  coursesService = inject(CoursesService);

  constructor() {
    // 1st way to load
    this.loadCourses().then(() =>
      console.log('courses loaded, ', this.#courses())
    );

    // 2nd way to load
    // will be called once after Next render
    afterNextRender(() => {
      this.loadCourses().then(() =>
        console.log('courses loaded, ', this.#courses())
      );
    });
  }

  async loadCourses() {
    try {
      //   const courses = await this.coursesFetchService.loadAllCourses();
      const courses = await this.coursesService.loadAllCourses();
      this.#courses.set(courses.sort(sortCoursesBySeqNo));
    } catch (error) {
      alert('Error while loading courses');
      console.error(error);
    }
  }
}
