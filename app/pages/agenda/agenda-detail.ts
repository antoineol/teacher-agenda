import {Component} from "@angular/core";
import {NavParams, NavController, Alert} from "ionic-angular";
import {AgendaEntry, Lesson} from "../../model/Lesson";
import {AgendaDao} from "../../business/AgendaDao";
import {ErrorService} from "../../framework/ErrorService";
import {TranslateService} from "ng2-translate/ng2-translate";
import {Conf} from "../../config/Config";
import {LessonFormPage} from "../forms/lesson";
import {Observable} from "rxjs/Observable";
import moment = require("moment");
import {LessonFormService} from "../../business/LessonFormService";
import {AgendaService} from "../../business/AgendaService";

@Component({
	templateUrl: 'build/pages/agenda/agenda-detail.html'
})
export class AgendaDetailPage {

	private entry:AgendaEntry;
	private removePopup:Observable<Alert>;
	private loading:boolean;
	// private fromDate:string;
	// private toDate:string;
	// private repetition:string;
	// private price:string;

	constructor(private nav:NavController, navParams:NavParams, private agendaDao:AgendaDao, private error:ErrorService, private translate:TranslateService, private lessonService:LessonFormService, agendaService:AgendaService) {
		let errKey = "global.error.init";
		try {
			this.entry = navParams.get('entry');
			let start = navParams.get('start');
			// Get live updates. Useful when the entry has been modified by a form, then we go back to this view.
			agendaService.getFormattedEntry(this.entry.$key, start).subscribe((entry:AgendaEntry) => {
				// console.log("AgendaDetailPage new entry:", entry);
				this.entry = entry;
			}, (err:any) => error.handler(err.code || errKey)(err));

			this.removePopup = this.translate.getTranslation(Conf.lang).map(() => {
				let confirm = Alert.create({
					title: this.translate.instant('agenda.deleteConfirm.title'),
					message: this.translate.instant('agenda.deleteConfirm.message'),
					buttons: [
						{text: this.translate.instant('alert.cancel')},
						{
							text: this.translate.instant('alert.confirm'),
							handler: () => {
								this.agendaDao.removeAgendaEntry(this.entry).then(() => {
									confirm.dismiss().then(() => {
										this.nav.pop();
									});
								}, (err:any) => this.error.handler(err.code || "lesson.error.remove")(err));
							}
						}
					]
				});
				return confirm;
			}).share();
		} catch(err) {
			this.error.handler(errKey)(err);
		}
	}

	remove() {
		this.removePopup.first().subscribe((confirm:Alert) => {
			this.nav.present(confirm);
		});
	}

	cancel() {
		this.loading = true;
		this.lessonService.cancelLesson(this.entry).then(() => {
			// this.loading = false;
			// this.nav.pop();
			this.nav.pop().then(() => this.loading = false, () => this.loading = false);
		}).catch((err:any) => {
			this.loading = false;
			this.error.handler(err.code)(err);
		});
	}

	holdLesson() {
		this.loading = true;
		this.lessonService.restoreLesson(this.entry).then(() => {
			// this.loading = false;
			// this.nav.pop();
			this.nav.pop().then(() => this.loading = false, () => this.loading = false);
		}).catch((err:any) => {
			this.loading = false;
			this.error.handler(err.code)(err);
		});
	}

	edit() {
		this.nav.push(LessonFormPage, {agendaEntry: this.entry});
	}
}
