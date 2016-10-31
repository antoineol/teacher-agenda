import {Component} from "@angular/core";
import {NavParams, NavController, Alert, AlertController} from "ionic-angular/index";
import {Observable} from "rxjs/Observable";
import {TranslateService} from "ng2-translate/ng2-translate";
import {StudentFormPage} from "../forms/student";
import {PayFormPage} from "../forms/pay";
import moment from "moment";
import {Student} from "../../business/student.model";
import {StudentDao} from "../../business/student.dao";
import {ErrorService} from "../../../core/framework/error.service";
import {AgendaDao} from "../../business/agenda.dao";
import {PaymentService} from "../../business/payment.service";
import {Conf} from "../../../shared/config/Config";

@Component({
	templateUrl: 'student-detail.html'
})
export class StudentDetailPage {
	private loading = false;

	private _student:Student;
	get student():Student {
		return this._student;
	}
	set student(value:Student) {
		this._student = StudentDetailPage.formatStudent(value);
	}
	private removePopup:Observable<Alert>;

	constructor(navParams:NavParams, private nav:NavController, alertCtrl: AlertController, translate:TranslateService, studentDao:StudentDao, private error:ErrorService, private agendaDao:AgendaDao, private paymentService:PaymentService) {
		let errKey = "global.error.init";
		try {
			this.student = navParams.get('student');

			agendaDao.findStudent(this.student.$key).subscribe((student:Student) => {
				this.student = student;
			}, (err:any) => error.handler(err.code || "global.error.init")(err));

			this.removePopup = translate.getTranslation(Conf.lang).map(() => {
				let confirm = alertCtrl.create({
					title: translate.instant('student.deleteConfirm.title'),
					message: translate.instant('student.deleteConfirm.message'),
					buttons: [
						{text: translate.instant('alert.cancel')},
						{
							text: translate.instant('alert.confirm'),
							handler: () => {
								studentDao.removeStudent(this.student).then(() => {
									confirm.dismiss().then(() => {
										this.nav.pop();
									});
								}, (err:any) => error.handler(err.code || "student.error.remove")(err));
							}
						}
					]
				});
				return confirm;
			}).share();
		} catch(err) {
			this.error.handler(errKey)(err);
		}
	}

	addPayment() {
		this.nav.push(PayFormPage, {student: this.student});
	}

	edit() {
		this.nav.push(StudentFormPage, {student: this.student});
	}

	remove() {
		this.removePopup.first().subscribe((confirm:Alert) => {
			confirm.present();
		});
	}

	checkPayment() {
		let errKey = "global.error.init";
		this.loading = true;
		this.paymentService.checkPayment(this.student).then(() => {
			this.loading = false;
			// this.nav.pop().then(() => this.loading = false, () => this.loading = false);
		}, (err:any) => {
			this.loading = false;
			this.error.handler(err.code || errKey)(err)
		});
	}

	private static formatStudent(student:Student):Student {
		// student.startBillingReadable = moment(student.startBilling).format('L');
		// console.log("format student.paidUntil:", student.paidUntil);
		student.paidUntilReadable = student.paidUntil ? moment(student.paidUntil).format('L') : '-';
		return student;
	}

}
