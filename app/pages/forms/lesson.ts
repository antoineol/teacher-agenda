import {Page, NavParams, NavController} from "ionic-angular";
import {Lesson, Freq} from "../../model/Lesson";
import {Utils} from "../../business/Utils";
import {AgendaDao} from "../../business/AgendaDao";
import {Parameters} from "../../model/Parameters";
import {Student} from "../../model/Student";
import {TranslateService} from "ng2-translate/ng2-translate";
import {Conf} from "../../config/Config";
import {ErrorService} from "../../framework/ErrorService";
// import moment = require("moment");


interface FreqChoice {
	id:number;
	label:string;
}

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

	constructor(private nav:NavController, private navParams:NavParams, private agendaDao:AgendaDao, translate:TranslateService, private error:ErrorService) {
		this.edit = !!navParams.get('edit');
		agendaDao.findParameters().subscribe((params:Parameters) => {
			this.lesson.duration = params.defaultDuration;
		});
		// If the lesson is created from a student view, we default to this student
		this.lesson.studentId = navParams.get('studentId');
		agendaDao.findStudents().subscribe((students:Student[]) => this.students = students);

		// Can be moved to a service if other things are added
		translate.getTranslation(Conf.lang).subscribe(() => {
			this.freq = [
				{id: Freq.NONE, label: translate.instant('frequency.none')},
				{id: Freq.DAILY, label: translate.instant('frequency.daily')},
				{id: Freq.WEEKLY, label: translate.instant('frequency.weekly')},
				{id: Freq.BIWEEKLY, label: translate.instant('frequency.biweekly')},
				{id: Freq.MONTHLY, label: translate.instant('frequency.monthly')},
				{id: Freq.BIMONTHLY, label: translate.instant('frequency.bimonthly')}
			];
		});

		// console.log("localeData:", moment.localeData('fr'));
	}

	createLesson(event:any) {
		this.agendaDao.findParameters().subscribe((params:Parameters) => {
			let lesson:Lesson = Object.assign({}, this.lesson);
			// {studentId: "482b4f74-ba0d-4b10-acf2-69ffff8f0c4f", date: "2016-05-22", repetition: 0, duration: 45}
			// Remove useless information from the JSON we are going to persist (default, empty...)
			if (!lesson.studentId) {
				delete lesson.studentId;
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

			// console.log("Create the lesson:", lesson);
			this.agendaDao.insertAgendaEntry(lesson).subscribe(() => {
				// console.log("Lesson inserted");
			}, this.error.handler("lesson.error.insert"));
			this.nav.pop();
		});
	}

	// pickDate(event:any) {
	// 	console.log("event:", event);
	// 	console.log("lesson:", this.lesson);
	// }
}
