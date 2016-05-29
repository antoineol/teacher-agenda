import {Page, NavParams, NavController, Alert} from "ionic-angular";
import moment = require("moment");
import {AgendaEntry, FreqChoice} from "../../model/Lesson";
import {LessonFormService} from "../../business/LessonFormService";
import {Utils} from "../../business/Utils";
import {AgendaDao} from "../../business/AgendaDao";
import {ErrorService} from "../../framework/ErrorService";
import {TranslateService} from "ng2-translate/ng2-translate";
import {Conf} from "../../config/Config";
import {LessonFormPage} from "../forms/lesson";
import {MiscService} from "../../business/MiscService";

@Page({
	templateUrl: 'build/pages/agenda/agenda-detail.html'
})
export class AgendaDetailPage {

	private entry:AgendaEntry;
	// private fromDate:string;
	// private toDate:string;
	// private repetition:string;
	// private price:string;

	constructor(private nav:NavController, navParams:NavParams, private miscService:MiscService, private agendaDao:AgendaDao, private error:ErrorService, private translate:TranslateService) {
		// console.log("Constructor of agenda-detail");
		this.entry = navParams.get('entry');
		// this.initFields(this.entry);
	}

	// initFields(entry:AgendaEntry) {
		// this.fromDate = moment(entry.date).format('L');
		// this.price = Utils.formatCurrency(this.entry.student.price);

		// if (entry.repetition) {
		// 	this.miscService.getFrequencies().subscribe((freq:FreqChoice[]) => {
		// 		let found = freq.find((elt:FreqChoice) => elt.id === entry.repetition);
		// 		this.repetition = found ? found.label : undefined;
		// 	});
        //
		// 	if (entry.repetEnd) {
		// 		this.toDate = entry.repetEnd.format('L');
		// 	}
		// }
	// }

	remove() {
		this.translate.getTranslation(Conf.lang).subscribe(() => {
			let confirm = Alert.create({
				title: this.translate.instant('agenda.deleteConfirm.title'),
				message: this.translate.instant('agenda.deleteConfirm.message'),
				buttons: [
					{text: this.translate.instant('alert.cancel')},
					{
						text: this.translate.instant('alert.confirm'),
						handler: () => {
							this.agendaDao.removeAgendaEntry(this.entry).subscribe(() => {
								confirm.dismiss().then(() => {
									this.nav.pop();
								});
							}, this.error.handler("lesson.error.insert"));
						}
					}
				]
			});
			this.nav.present(confirm);
		});
	}

	edit() {
		this.nav.push(LessonFormPage, {lesson: this.entry});
	}
}
