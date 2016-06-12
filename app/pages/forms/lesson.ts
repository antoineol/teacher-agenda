import {Component} from "@angular/core";
import {NavParams, NavController} from "ionic-angular";
import {Lesson, Freq, FreqChoice} from "../../model/Lesson";
import {Utils} from "../../business/Utils";
import {AgendaDao} from "../../business/AgendaDao";
import {Student} from "../../model/Student";
import {ErrorService} from "../../framework/ErrorService";
import {LessonFormService} from "../../business/LessonFormService";
import {MiscService} from "../../business/MiscService";
import {AgendaService} from "../../business/AgendaService";
// import moment = require("moment");


@Component({
	templateUrl: 'build/pages/forms/lesson.html'
})
export class LessonFormPage {
	edit:boolean;
	updating = false;

	lesson:Lesson = {
		studentId: null,
		date: Utils.now.format(),
		repetition: Freq.NONE
	};

	students:Student[] = [];
	freq:FreqChoice[] = [];

	constructor(private nav:NavController, private navParams:NavParams, private agendaService:AgendaService, private agendaDao:AgendaDao, private error:ErrorService, private lessonService:LessonFormService, miscService:MiscService) {
		let errKey = "global.error.init";
		try {
			let initLesson = navParams.get('lesson');
			this.edit = !!initLesson;

			if (this.edit) {
				this.lesson = {
					$key: initLesson.$key,
					studentId: initLesson.studentId,
					date: initLesson.date,
					duration: initLesson.duration,
					repetition: initLesson.repetition,
					repetitionEnd: initLesson.repetitionEnd,
				};
			}
			// this.lesson = initLesson || this.lesson;
			lessonService.prepareLessonForForm(this.lesson, navParams.get('studentId'));

			agendaDao.findStudents().subscribe((students:Student[]) => this.students = students, this.error.handler(errKey));
			miscService.getFrequencies().subscribe((freq:FreqChoice[]) => this.freq = freq, this.error.handler(errKey));
		} catch(err) {
			this.error.handler(errKey)(err);
		}
	}

	createLesson() {
		// console.log("Create lesson:", this.lesson);
		let errKey = this.edit ? "lesson.error.update" : "lesson.error.insert";
		this.updating = true;
		try {
			// if (this.edit) {
			// 	this.agendaService.formatEntry(this.lesson).subscribe();
			// }
			this.lessonService.submitLesson(this.lesson, this.edit).subscribe(() => {
				this.updating = false;
				this.nav.pop();
			}, (err) => {
				this.updating = false;
				this.error.handler(errKey)(err)
			});
		} catch (err) {
			this.updating = false;
			this.error.handler(errKey)(err);
		}
	}

}
