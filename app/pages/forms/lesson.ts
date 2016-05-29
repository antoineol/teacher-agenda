import {Page, NavParams, NavController} from "ionic-angular";
import {Lesson, Freq, FreqChoice} from "../../model/Lesson";
import {Utils} from "../../business/Utils";
import {AgendaDao} from "../../business/AgendaDao";
import {Parameters} from "../../model/Parameters";
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
		date: Utils.now.format('YYYY-MM-DD'),
		repetition: Freq.NONE
	};

	students:Student[] = [];
	freq:FreqChoice[] = [];

	constructor(private nav:NavController, private navParams:NavParams, private agendaDao:AgendaDao, private error:ErrorService, private lessonService:LessonFormService) {
		this.edit = !!navParams.get('edit');
		agendaDao.findParameters().subscribe((params:Parameters) => {
			this.lesson.duration = params.defaultDuration;
		});
		// If the lesson is created from a student view, we default to this student
		this.lesson.studentId = navParams.get('studentId');
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
