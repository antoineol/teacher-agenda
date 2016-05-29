import {Injectable} from "@angular/core";
import {Lesson, FreqChoice, Freq} from "../model/Lesson";
import {Observable} from "rxjs/Observable";
import {Parameters} from "../model/Parameters";
import {AgendaDao} from "./AgendaDao";
import {Conf} from "../config/Config";
import {TranslateService} from "ng2-translate/ng2-translate";

@Injectable()
export class LessonFormService {
	constructor(private agendaDao:AgendaDao, private translate:TranslateService) {

	}

	getFrequencies():Observable<FreqChoice[]> {
		return this.translate.getTranslation(Conf.lang).map(() => {
			return [
				{id: Freq.NONE, label: this.translate.instant('frequency.none')},
				{id: Freq.DAILY, label: this.translate.instant('frequency.daily')},
				{id: Freq.WEEKLY, label: this.translate.instant('frequency.weekly')},
				{id: Freq.BIWEEKLY, label: this.translate.instant('frequency.biweekly')},
				{id: Freq.MONTHLY, label: this.translate.instant('frequency.monthly')},
				// {id: Freq.BIMONTHLY, label: this.translate.instant('frequency.bimonthly')}
			];
		});
	}


	createLesson(lesson:Lesson):Observable<void> {
		return this.agendaDao.findParameters().mergeMap((params:Parameters) => {
			lesson = Object.assign({}, lesson);
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
			return this.agendaDao.insertAgendaEntry(lesson);
		});
	}
}
