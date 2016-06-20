import {Component} from "@angular/core";
import {NavParams, NavController} from "ionic-angular";
import {AgendaDao} from "../../business/AgendaDao";
import {Student} from "../../model/Student";
import {ErrorService} from "../../framework/ErrorService";
import {AgendaService} from "../../business/AgendaService";
import {StudentFormService} from "../../business/StudentFormService";


@Component({
	templateUrl: 'build/pages/forms/student.html'
})
export class StudentFormPage {
	private edit:boolean;
	private loading = false;

	private student:Student = {
		name: null,
		price: null,
		paidUntil: null,
		paymentHistory: [],
		// paid: 0,
		// startBilling: AgendaConfig.defaultStartBillingDate
	};

	constructor(private nav:NavController, private navParams:NavParams, private agendaService:AgendaService, private agendaDao:AgendaDao, private error:ErrorService, private studentService:StudentFormService) {
		let initStudent:Student = navParams.get('student');
		this.edit = !!initStudent;
		if (this.edit) {
			this.student = {
				$key: initStudent.$key,
				name: initStudent.name,
				price: initStudent.price,
				paidUntil: initStudent.paidUntil,
				paymentHistory: initStudent.paymentHistory,
				// paid: initStudent.paid,
				// startBilling: Utils.truncateDate(initStudent.startBilling)
			};
		}
	}

	createStudent() {
		let errKey = this.edit ? "student.error.update" : "student.error.insert";
		this.loading = true;
		try {
			this.studentService.submitStudent(this.student, this.edit).then(() => {
				this.nav.pop().then(() => this.loading = false, () => this.loading = false);
			}, (err) => {
				this.loading = false;
				this.error.handler(err.code || errKey)(err)
			});
		} catch (err) {
			this.loading = false;
			this.error.handler(errKey)(err);
		}
	}

}
