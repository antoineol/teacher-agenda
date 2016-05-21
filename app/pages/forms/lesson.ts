import {Page, NavParams} from "ionic-angular/index";
import {Lesson, Freq} from "../../model/Lesson";
import {Utils} from "../../business/Utils";
import {AgendaDao} from "../../business/AgendaDao";
import {Parameters} from "../../model/Parameters";
import {Student} from "../../model/Student";
import {TranslateService} from "ng2-translate/ng2-translate";
import {Conf} from "../../config/Config";


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
	freq = [];

	constructor(navParams:NavParams, agendaDao:AgendaDao, translate: TranslateService) {
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
	}

	createLesson(event:any) {
		console.log("Create the lesson");
	}

	// pickDate(event:any) {
	// 	console.log("event:", event);
	// 	console.log("lesson:", this.lesson);
	// }
}
