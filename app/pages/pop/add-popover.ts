import {Component} from "@angular/core";
import {ViewController, NavController, Popover, App, NavParams} from "ionic-angular/index";
import {LessonFormPage} from "../forms/lesson";
import {StudentFormPage} from "../forms/student";
import {PayFormPage} from "../forms/pay";


@Component({
	template: `
    <ion-list>
      <button ion-item (click)="addLesson()">{{"lesson.add" | translate}}</button>
      <button ion-item (click)="addStudent()">{{"student.add" | translate}}</button>
      <button ion-item (click)="addPayment()">{{"pay.add" | translate}}</button>
    </ion-list>
  `
})
export class AddPopover {

	static data = {};
	static opts = {cssClass: 'add-popover'};

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

	addPayment() {
		this.nav.push(PayFormPage).then(() => {
			this.viewCtrl.dismiss();
		});
	}
}
