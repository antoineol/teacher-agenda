import {Page, NavParams} from "ionic-angular";
import {AgendaEntry} from "../../model/Lesson";
import {LessonFormService} from "../../business/LessonFormService";

@Page({
	templateUrl: 'build/pages/agenda/agenda-detail.html'
})
export class AgendaDetailPage {
	entry:AgendaEntry;

	constructor(navParams:NavParams, private lessonService:LessonFormService) {
		
		this.entry = navParams.get('entry');
	}

	remove() {
		console.log("Should remove the entry");
	}

	edit() {
		console.log("Should edit the entry");
	}
}
