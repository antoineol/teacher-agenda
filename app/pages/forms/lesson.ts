import {Page, NavParams} from "ionic-angular/index";

@Page({
	templateUrl: 'build/pages/forms/lesson.html'
})
export class LessonFormPage {
	edit:boolean;

	constructor(navParams:NavParams) {
		this.edit = !!navParams.get('edit');
	}
}
