import {Page, NavParams, NavController} from "ionic-angular";
import {Lesson, Freq, FreqChoice} from "../../model/Lesson";
import {Utils} from "../../business/Utils";
import {AgendaDao} from "../../business/AgendaDao";
import {Student} from "../../model/Student";
import {ErrorService} from "../../framework/ErrorService";
import {LessonFormService} from "../../business/LessonFormService";
// import moment = require("moment");


@Page({
	templateUrl: 'build/pages/forms/lesson.html'
})
export class LessonFormPage {
	edit:boolean;

	lesson:Lesson = {
		studentId: null,
		date: Utils.now.format(),
		repetition: Freq.NONE
	};

	students:Student[] = [];
	freq:FreqChoice[] = [];

	constructor(private nav:NavController, private navParams:NavParams, private agendaDao:AgendaDao, private error:ErrorService, private lessonService:LessonFormService) {
		let initLesson = navParams.get('lesson');
		this.edit = !!initLesson;

		this.lesson = initLesson || this.lesson;
		lessonService.prepareLessonForForm(this.lesson, navParams.get('studentId'));

		agendaDao.findStudents().subscribe((students:Student[]) => this.students = students);

		lessonService.getFrequencies().subscribe((freq:FreqChoice[]) => this.freq = freq);

		// console.log("localeData:", moment.localeData('fr'));
	}

	createLesson(event:any) {
		this.lessonService.createLesson(this.lesson).subscribe(() => {
			this.nav.pop();
		}, this.error.handler("lesson.error.insert"));
	}

}
