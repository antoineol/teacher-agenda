import {Component} from "@angular/core";
import {NavParams, NavController} from "ionic-angular";
import {Student} from "../../business/student.model";
import {AgendaService} from "../../business/agenda.service";
import {AgendaDao} from "../../business/agenda.dao";
import {ErrorService} from "../../../core/framework/error.service";
import {StudentFormService} from "../../business/student-form.service";


@Component({
	templateUrl: 'student.html'
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
			}, (err: any) => {
				this.loading = false;
				this.error.handler(err.code || errKey)(err)
			});
		} catch (err) {
			this.loading = false;
			this.error.handler(errKey)(err);
		}
	}

}
