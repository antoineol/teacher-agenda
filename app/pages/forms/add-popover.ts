import {Component, ViewChild} from "@angular/core";
import {ViewController, NavController, Popover, App, NavParams} from "ionic-angular/index";
import {LessonFormPage} from "./lesson";
import {StudentFormPage} from "./student";


@Component({
	template: `
    <ion-list>
      <button ion-item (click)="addLesson()">{{"lesson.add" | translate}}</button>
      <button ion-item (click)="addStudent()">{{"student.add" | translate}}</button>
    </ion-list>
  `
})
export class AddPopover {
	
	static make():Popover {
		return Popover.create(AddPopover, {}, {cssClass: 'add-popover'});
	}
	
	private pageNav:NavController;
	
	constructor(private nav:NavController, private viewCtrl:ViewController, private app:App, private params:NavParams) {
		// let popover = <Popover>viewCtrl;
		// console.log("viewCtrl:", popover);
		// console.log(params.get('nav'));
		// this.pageNav = params.get('nav');
		// popover.data
	}

	addLesson() {
		this.nav.push(LessonFormPage).then(() => {
			// dismissing before the nav.push breaks the "back" button in the next view.
			// https://github.com/driftyco/ionic/issues/6820
			this.viewCtrl.dismiss();
		});
	}

	addStudent() {
		this.nav.push(StudentFormPage).then(() => {
			this.viewCtrl.dismiss();
		});
	}
}
