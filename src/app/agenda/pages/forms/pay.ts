import {Component} from "@angular/core";
import {NavParams, NavController} from "ionic-angular";
import {Student} from "../../business/student.model";
import {AgendaDao} from "../../business/agenda.dao";
import {ErrorService} from "../../../core/framework/error.service";
import {FormBuilder, Validators, FormGroup} from "@angular/forms";
import {PaymentService, PaymentFormInfo} from "../../business/payment.service";
import {Utils} from "../../../shared/utils";

@Component({
	templateUrl: 'pay.html'
})
export class PayFormPage {
	private loading = false;
	private form: FormGroup;

	// private payment:PaymentDetail = {date: null, amount: null};
	// private studentChoice:Student;
	students: Student[] = [];


	constructor(private nav: NavController, private navParams: NavParams, private agendaDao: AgendaDao, private error: ErrorService, fb: FormBuilder, private paymentService: PaymentService) {
		let errKey = "global.error.init";
		let student = navParams.get('student');

		this.form = fb.group({
			'studentChoice': [null, Validators.required],
			'date': [Utils.truncateDate(Utils.now.format()), Validators.required],
			'amount': [null, Validators.required],
		});

		agendaDao.findStudents().subscribe((students: Student[]) => {
			if (student) {
				this.form.controls['studentChoice'].setValue(students.find((s: Student) => s.$key === student.$key));
				// (<AbstractControl>this.form.controls['studentChoice']).updateValue(students.find((s: Student) => s.$key === student.$key));
				// this.studentChoice = students.find((s:Student) => s.$key === student.$key);
			}
			this.students = students;
		}, (err: any) => this.error.handler(err.code || errKey)(err));
	}

	addPayment() {
		let errKey = "global.error.init";
		const formInfo: PaymentFormInfo = this.form.value;

		this.loading = true;
		this.paymentService.addPayment(formInfo).then(() => {
			this.nav.pop().then(() => this.loading = false, () => this.loading = false);
		}, (err: any) => {
			this.loading = false;
			this.error.handler(err.code || errKey)(err)
		});
	}

}
