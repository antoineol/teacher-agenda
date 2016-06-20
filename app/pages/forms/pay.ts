import {Component} from "@angular/core";
import {FormBuilder, ControlGroup, Validators, Control} from "@angular/common";
import {NavParams, NavController} from "ionic-angular";
import {AgendaDao} from "../../business/AgendaDao";
import {ErrorService} from "../../framework/ErrorService";
import {Student} from "../../model/Student";
import {Utils} from "../../business/Utils";
import {PaymentService, PaymentFormInfo} from "../../business/PaymentService";

@Component({
	templateUrl: 'build/pages/forms/pay.html'
})
export class PayFormPage {
	private loading = false;
	private form:ControlGroup;

	// private payment:PaymentDetail = {date: null, amount: null};
	// private studentChoice:Student;
	private students:Student[] = [];


	constructor(private nav:NavController, private navParams:NavParams, private agendaDao:AgendaDao, private error:ErrorService, fb:FormBuilder, private paymentService:PaymentService) {
		let errKey = "global.error.init";
		let student = navParams.get('student');

		this.form = fb.group({
			'studentChoice': [null, Validators.required],
			'date': [Utils.truncateDate(Utils.now.format()), Validators.required],
			'amount': [null, Validators.required],
		});

		agendaDao.findStudents().subscribe((students:Student[]) => {
			if (student) {
				(<Control>this.form.controls['studentChoice']).updateValue(students.find((s:Student) => s.$key === student.$key));
				// this.studentChoice = students.find((s:Student) => s.$key === student.$key);
			}
			this.students = students;
		}, (err:any) => this.error.handler(err.code || errKey)(err));
	}

	private addPayment(formInfo:PaymentFormInfo) {
		let errKey = "global.error.init";

		this.loading = true;
		this.paymentService.addPayment(formInfo).then(() => {
			this.nav.pop().then(() => this.loading = false, () => this.loading = false);
		}, (err:any) => {
			this.loading = false;
			this.error.handler(err.code || errKey)(err)
		});
	}

}
