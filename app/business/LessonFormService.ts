import {Injectable} from "@angular/core";
import {Lesson, AgendaEntry} from "../model/Lesson";
import {Observable} from "rxjs/Observable";
import {Parameters} from "../model/Parameters";
import {AgendaDao} from "./AgendaDao";
import {Utils} from "./Utils";
import {AgendaService} from "./AgendaService";
import {Student} from "../model/Student";
import moment = require("moment");

@Injectable()
export class LessonFormService {

	// updateLessonEmitter = new EventEmitter<Lesson>();

	constructor(private agendaDao:AgendaDao, private agendaService:AgendaService) {
	}


	submitLesson(lesson:Lesson, student:Student, edit?:boolean):Observable<void> {
		return this.agendaDao.findParameters().mergeMap((params:Parameters) => {

			// Restore a copy for the insert case if any side effect.
			// Beware of the update case: it was commented to update directly the object reference
			// and propagate automatically the changes in the app.
			// lesson = Object.assign({}, lesson);

			if (typeof lesson.price === 'string') {
				lesson.price = +lesson.price; // convert to number
			}

			// {studentId: "482b4f74-ba0d-4b10-acf2-69ffff8f0c4f", date: "2016-05-22", repetition: 0, duration: 45}
			// Remove useless information from the JSON we are going to persist (default, empty...)
			if (student) {
				lesson.studentId = student.$key;
			}
			if (!lesson.studentId) {
				delete lesson.studentId;
			}
			if (typeof lesson.duration === 'string' && Utils.isNumeric(lesson.duration)) {
				lesson.duration = parseInt(<any>lesson.duration);
				// console.log("lesson.duration:", lesson.duration, "typeof:", typeof lesson.duration)
			}
			if (lesson.duration === params.defaultDuration) {
				delete lesson.duration;
			}
			if (!lesson.repetition) {
				delete lesson.repetition;
				delete lesson.repetitionEnd;
			}
			if (!lesson.repetitionEnd) {
				delete lesson.repetitionEnd;
			}

			if (edit) {
				// console.log("Update lesson:", lesson);
				// let lessonFormatted = Object.assign({}, lesson);
				// this.agendaService.formatEntry(lessonFormatted).subscribe(() => {
				// 	this.updateLessonEmitter.emit(lessonFormatted);
				// });
				return this.agendaDao.updateAgendaEntry(lesson);
			} else {
				// console.log("Create lesson:", lesson);
				return this.agendaDao.insertAgendaEntry(lesson);
			}
		});
	}

	prepareLessonForForm(lesson:Lesson, studentId?:string):void {

		// Truncate dates because date inputs don't recognize ISO formats with more information
		// than supported by the input type.
		if (lesson.date) {
			lesson.date = Utils.truncateDatetime(lesson.date);
		}
		if (lesson.repetitionEnd) {
			lesson.repetitionEnd = lesson.repetitionEnd.substr(0, 10);
		}
		if (!lesson.duration) {
			this.agendaDao.findParameters().subscribe((params:Parameters) => {
				lesson.duration = params.defaultDuration;
			});
		}
		if (!lesson.studentId) {
			// If the lesson is created from a student view, we default to this student
			lesson.studentId = studentId;
		}
	}

	cancelLesson(entry:AgendaEntry):Promise<void> {
		let lesson:Lesson = Utils.toLesson(entry);
		if (!lesson.cancellations) {
			lesson.cancellations = [];
		}
		let found:string = lesson.cancellations.find((cancellation:string) => {
			return moment(cancellation).isSame(entry.start);
		});
		if (found) {
			let err:any = new Error("Tried to cancel a lesson that is already cancelled! The cancellation date has been found in the array of existing cancellations.");
			err.code = 'lesson.error.alreadyCancelled';
			return Promise.reject(err);
		}
		lesson.cancellations.push(entry.start.format());
		return this.agendaDao.updateAgendaEntry(lesson);
		// TODO continue from here: take the date, change to match this repetition's date and push to the array
		// as cancelled date.
		// Then, when formatting the agenda entries, add an info: whether a repetition was cancelled, by checking this array.
		// Then display it on the UI
	}

	restoreLesson(entry:AgendaEntry):Promise<void> {
		let lesson:Lesson = Utils.toLesson(entry);
		let foundIndex = -1;
		if (Array.isArray(lesson.cancellations)) {
			foundIndex = lesson.cancellations.findIndex((cancellation:string) => {
				return moment(cancellation).isSame(entry.start);
			});
		}
		if (!lesson.cancellations || foundIndex === -1) {
			let err:any = new Error("Tried to restore a lesson that is not cancelled! The cancellation date has not been found in the array of existing cancellations.");
			err.code = 'lesson.error.notCancelled';
			return Promise.reject(err);
		}
		lesson.cancellations.splice(foundIndex, 1);
		return this.agendaDao.updateAgendaEntry(lesson);

	}


}
