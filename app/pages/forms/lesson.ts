import {Component} from "@angular/core";
import {NavParams, NavController} from "ionic-angular";
import {Lesson, FreqChoice, AgendaEntry} from "../../model/Lesson";
import {Utils} from "../../business/Utils";
import {AgendaDao} from "../../business/AgendaDao";
import {Student} from "../../model/Student";
import {ErrorService} from "../../framework/ErrorService";
import {LessonFormService} from "../../business/LessonFormService";
import {MiscService} from "../../business/MiscService";
import {AgendaService} from "../../business/AgendaService";
import {Conf} from "../../config/Config";
// import moment = require("moment");


@Component({
	templateUrl: 'build/pages/forms/lesson.html'
})
export class LessonFormPage {

	private edit:boolean;
	private loading = false;
	// private lessonForm:ControlGroup;

	lesson:Lesson = {
		// studentId: null,
		date: Utils.now.format(),
		repetition: Conf.defaultLessonFrequency
	};
	private _studentChoice:Student;
	get studentChoice():Student {
		return this._studentChoice;
	}
	set studentChoice(student:Student) {
		if (student && (!this.lesson.price || (this._studentChoice && this.lesson.price === this._studentChoice.price))) {
			this.lesson.price = student.price;
		}
		this._studentChoice = student;
	}

	students:Student[] = [];
	freq:FreqChoice[] = [];

	constructor(private nav:NavController, private navParams:NavParams, private agendaService:AgendaService, private agendaDao:AgendaDao, private error:ErrorService, private lessonService:LessonFormService, miscService:MiscService) {
		let errKey = "global.error.init";
		try {
			let agendaEntry:AgendaEntry = navParams.get('agendaEntry');
			this.edit = !!agendaEntry;

			if (this.edit) {
				this.studentChoice = agendaEntry.student; // set first not to override eventual custom price
				this.lesson = Utils.toLesson(agendaEntry)/*{
					$key: agendaEntry.$key,
					studentId: agendaEntry.studentId,
					price: agendaEntry.price,
					date: agendaEntry.date,
					duration: agendaEntry.duration,
					repetition: agendaEntry.repetition,
					repetitionEnd: agendaEntry.repetitionEnd,
				}*/;
			}
			// this.lesson = initLesson || this.lesson;
			lessonService.prepareLessonForForm(this.lesson, navParams.get('studentId'));

			agendaDao.findStudents().subscribe((students:Student[]) => {
				if (agendaEntry && agendaEntry.student) {
					this.studentChoice = students.find((s:Student) => s.$key === agendaEntry.student.$key);
				}
				this.students = students;
			}, (err:any) => this.error.handler(err.code || errKey)(err));
			miscService.getFrequencies().subscribe((freq:FreqChoice[]) => this.freq = freq,
				(err:any) => this.error.handler(err.code || errKey)(err));
		} catch(err) {
			this.error.handler(errKey)(err);
		}
	}

	createLesson() {
		// console.log("Create lesson:", this.lesson);
		let errKey = this.edit ? "lesson.error.update" : "lesson.error.insert";
		this.loading = true;
		try {
			// if (this.edit) {
			// 	this.agendaService.formatEntry(this.lesson).subscribe();
			// }
			this.lessonService.submitLesson(this.lesson, this._studentChoice, this.edit).subscribe(() => {
				this.nav.pop().then(() => this.loading = false, () => this.loading = false);
			}, (err:any) => {
				this.loading = false;
				this.error.handler(err.code || errKey)(err)
			});
		} catch (err) {
			this.loading = false;
			this.error.handler(errKey)(err);
		}
	}

}
