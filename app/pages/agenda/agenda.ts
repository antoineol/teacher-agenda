import {Page, NavController} from "ionic-angular";
import {AgendaEntry} from "../../model/Lesson";
import {AgendaService} from "../../business/AgendaService";
import moment = require("moment");
import {AgendaDetailPage} from "./agenda-detail";
import {LessonFormPage} from "../forms/lesson";
import {TranslateService} from "ng2-translate/ng2-translate";


@Page({
	templateUrl: 'build/pages/agenda/agenda.html'
})
export class AgendaPage {
	agenda:AgendaEntry[];
	constructor(private nav:NavController, agendaService:AgendaService, translate: TranslateService) {
		
		// Sample to get a translation
		// translate.get('segment.puppies').subscribe((val:string) => {
		// 	console.log('puppies:', val);
		// });
		
		try {
			let self = this;
			let start = moment("2016-05-18T07:00:00.000Z").startOf('day');
			let end = moment("2016-05-18T07:00:00.000Z").endOf('day');
			agendaService.getFormattedAgenda(start, end).subscribe((agenda:AgendaEntry[]) => {
				// console.log("Formatted agenda:", agenda);
				self.agenda = agenda;
			});
		} catch(err) {
			console.error(err.stack || err);
		}
	}

	entryTapped(event:any, entry:AgendaEntry) {
		this.nav.push(AgendaDetailPage, {entry: entry});
	}

	addEntry() {
		this.nav.push(LessonFormPage);
	}
}
