import {Injectable} from "@angular/core";
import {Student} from "./student.model";
import {StudentDao} from "./student.dao";

@Injectable()
export class StudentFormService {

	constructor(private studentDao:StudentDao) {
	}

	submitStudent(student:Student, edit?:boolean):Promise<void> {
		if (typeof student.price === 'string') {
			student.price = +student.price; // convert to number
		}
		// if (typeof student.paid === 'string') {
		// 	student.paid = +student.paid; // convert to number
		// }
		if (edit) {
			// console.log("Update student:", student);
			return this.studentDao.updateStudent(student);
		} else {
			// console.log("Create student:", student);
			return this.studentDao.insertStudent(student);
		}
	}
}
