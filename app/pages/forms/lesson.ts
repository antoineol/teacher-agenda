import {Page, NavParams, NavController} from "ionic-angular";
import {Lesson, Freq, FreqChoice} from "../../model/Lesson";
import {Utils} from "../../business/Utils";
import {AgendaDao} from "../../business/AgendaDao";
import {Student} from "../../model/Student";
import {ErrorService} from "../../framework/ErrorService";
import {LessonFormService} from "../../business/LessonFormService";
import {MiscService} from "../../business/MiscService";
import {AgendaService} from "../../business/AgendaService";
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

	constructor(private nav:NavController, private navParams:NavParams, private agendaService:AgendaService, private agendaDao:AgendaDao, private error:ErrorService, private lessonService:LessonFormService, miscService:MiscService) {
		let initLesson = navParams.get('lesson');
		this.edit = !!initLesson;

		this.lesson = initLesson || this.lesson;
		lessonService.prepareLessonForForm(this.lesson, navParams.get('studentId'));

		agendaDao.findStudents().subscribe((students:Student[]) => this.students = students);

		miscService.getFrequencies().subscribe((freq:FreqChoice[]) => this.freq = freq);

		// console.log("localeData:", moment.localeData('fr'));
	}

	createLesson(event:any) {
		if (this.edit) {
			this.agendaService.formatEntry(this.lesson).subscribe();
		}
		this.lessonService.submitLesson(this.lesson, this.edit).subscribe(() => {
			this.nav.pop();
		}, this.error.handler("lesson.error.insert"));
	}

}
