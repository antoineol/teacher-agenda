import {Page, NavParams} from "ionic-angular/index";
import {AgendaEntry} from "../../model/AgendaEntry";

@Page({
	templateUrl: 'build/pages/agenda/agenda-detail.html'
})
export class AgendaDetailPage {
	entry:AgendaEntry;

	constructor(navParams:NavParams) {
		this.entry = navParams.get('entry');
	}
}
