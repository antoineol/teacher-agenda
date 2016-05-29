import {Page, NavParams} from "ionic-angular";
import {AgendaEntry, FreqChoice} from "../../model/Lesson";
import {LessonFormService} from "../../business/LessonFormService";
import {Utils} from "../../business/Utils";
import moment = require("moment");

@Page({
	templateUrl: 'build/pages/agenda/agenda-detail.html'
})
export class AgendaDetailPage {

	private entry:AgendaEntry;
	private fromDate:string;
	private toDate:string;
	private repetition:string;
	private price:string;

	constructor(navParams:NavParams, private lessonService:LessonFormService) {
		this.entry = navParams.get('entry');
		this.initFields(this.entry);
	}

	initFields(entry:AgendaEntry) {
		this.fromDate = moment(entry.date).format('L');

		if (entry.repetition) {
			this.lessonService.getFrequencies().subscribe((freq:FreqChoice[]) => {
				let found = freq.find((elt:FreqChoice) => elt.id === entry.repetition);
				this.repetition = found ? found.label : undefined;
			});

			if (entry.repetEnd) {
				this.toDate = entry.repetEnd.format('L');
			}
		}

		this.price = Utils.formatCurrency(this.entry.student.price);
	}

	remove() {
		console.log("Should remove the entry");
	}

	edit() {
		console.log("Should edit the entry");
	}
}
