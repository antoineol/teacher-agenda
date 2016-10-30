import {Component} from "@angular/core";
import {NavController, PopoverController} from "ionic-angular";
import {AddPopover} from "../pop/add-popover";
import {StudentDetailPage} from "./student-detail";
import {Student} from "../../business/student.model";
import {StudentDao} from "../../business/student.dao";
import {ErrorService} from "../../../core/framework/error.service";


@Component({
	templateUrl: 'students.html'
})
export class StudentsPage {

	students:Student[];

	constructor(private nav:NavController, private popoverCtrl:PopoverController, private studentDao:StudentDao, private error:ErrorService) {
		let errKey = "global.error.init";
		try {
			studentDao.findStudents().subscribe((students:Student[]) => this.students = students,
				(err:any) => this.error.handler(err.code || errKey)(err));
		} catch(err) {
			this.error.handler(errKey)(err);
		}
	}

	popAddList(event:Event) {
		this.popoverCtrl.create(AddPopover, AddPopover.data, AddPopover.opts).present({ev: event});
	}

	entryTapped(event:Event, student:Student) {
		this.nav.push(StudentDetailPage, {student: student});
	}

}
