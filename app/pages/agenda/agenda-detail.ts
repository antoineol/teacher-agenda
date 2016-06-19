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

@Component({
	templateUrl: 'build/pages/agenda/agenda-detail.html'
})
export class AgendaDetailPage {

	private entry:AgendaEntry;
	private removePopup:Observable<Alert>;
	// private fromDate:string;
	// private toDate:string;
	// private repetition:string;
	// private price:string;

	constructor(private nav:NavController, navParams:NavParams, private agendaDao:AgendaDao, private error:ErrorService, private translate:TranslateService, lessonService:LessonFormService) {
		let errKey = "global.error.init";
		try {
			this.entry = navParams.get('entry');
			// This page is not actively listening to the update from the storage, so we catch updates from the update service.
			// If it causes sync issues, we can update this component to subscribe to the storage instead.
			lessonService.updateLessonEmitter.subscribe((lesson:Lesson) => {
				this.entry = lesson;
				// console.log("New entry:", this.entry);
			});

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

	edit() {
		this.nav.push(LessonFormPage, {agendaEntry: this.entry});
	}
}
