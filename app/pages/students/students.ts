import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {AddPopover} from "../forms/add-popover";
import {Student} from "../../model/Student";
import {StudentDao} from "../../business/StudentDao";
import {StudentDetailPage} from "./student-detail";
import moment = require("moment");
import {ErrorService} from "../../framework/ErrorService";


@Component({
	templateUrl: 'build/pages/students/students.html'
})
export class StudentsPage {

	private students:Student[];

	constructor(private nav:NavController, private studentDao:StudentDao, private error:ErrorService) {
		let errKey = "global.error.init";
		try {
			studentDao.findStudents().subscribe((students:Student[]) => this.students = students, this.error.handler(errKey));
		} catch(err) {
			this.error.handler(errKey)(err);
		}
	}

	popAddList(event) {
		this.nav.present(AddPopover.make(), {ev: event});
	}

	entryTapped(event:any, student:Student) {
		this.nav.push(StudentDetailPage, {student: student});
	}

}
