import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {AgendaEntry} from "../../model/Lesson";
import {AgendaService} from "../../business/AgendaService";
import {AgendaDetailPage} from "./agenda-detail";
import {ErrorService} from "../../framework/ErrorService";
import moment = require("moment");


@Component({
	selector: 'agenda-list',
	templateUrl: 'build/pages/agenda/agenda-list.html'
})
export class AgendaList {

	agenda:AgendaEntry[];

	constructor(private nav:NavController, agendaService:AgendaService, error:ErrorService) {
		// Challenge: how to keep the 3 agenda lists separate, with different content, but using the
		// same service to provide the list of entries?
		// All component instances must be automatically updated when a new entry is added through the form.
		try {
			agendaService.getFormattedAgenda().subscribe((agenda:AgendaEntry[]) => {
				// console.log("Formatted agenda:", agenda);
				this.agenda = agenda;
			}, error.handler("agenda.error.loadAgenda"));
		} catch(err) {
			error.handler("agenda.error.loadAgenda")(err);
		}
	}

	entryTapped(event:any, entry:AgendaEntry) {
		this.nav.push(AgendaDetailPage, {entry: entry});
	}
}
