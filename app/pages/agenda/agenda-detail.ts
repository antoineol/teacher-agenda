import {Page, NavParams} from "ionic-angular";
import {AgendaEntry} from "../../model/Lesson";

@Page({
	templateUrl: 'build/pages/agenda/agenda-detail.html'
})
export class AgendaDetailPage {
	entry:AgendaEntry;

	constructor(navParams:NavParams) {
		this.entry = navParams.get('entry');
	}

	remove() {
		console.log("Should remove the entry");
	}
	
	edit() {
		console.log("Should edit the entry");
	}
}
