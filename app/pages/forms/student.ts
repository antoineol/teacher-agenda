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
	edit:boolean;
	updating = false;

	student:Student = {
		// id: null,
		name: null,
		price: null
	};

	constructor(private nav:NavController, private navParams:NavParams, private agendaService:AgendaService, private agendaDao:AgendaDao, private error:ErrorService, private studentService:StudentFormService) {
		let initStudent = navParams.get('student');
		this.edit = !!initStudent;
		if (this.edit) {
			this.student = {
				$key: initStudent.$key,
				name: initStudent.name,
				price: initStudent.price
			};
		}
		// this.student = initStudent || this.student;
	}

	createStudent() {
		let errKey = this.edit ? "student.error.update" : "student.error.insert";
		this.updating = true;
		try {
			this.studentService.submitStudent(this.student, this.edit).then(() => {
				this.updating = false;
				this.nav.pop();
			}, (err) => {
				this.updating = false;
				this.error.handler(errKey)(err)
			});
		} catch (err) {
			this.updating = false;
			this.error.handler(errKey)(err);
		}
	}

}
