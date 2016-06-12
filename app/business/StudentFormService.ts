import {Injectable} from "@angular/core";
import {Student} from "../model/Student";
import {StudentDao} from "./StudentDao";

@Injectable()
export class StudentFormService {

	constructor(private studentDao:StudentDao) {
	}

	submitStudent(student:Student, edit?:boolean):Promise<void> {
		if (edit) {
			// console.log("Update student:", student);
			return this.studentDao.updateStudent(student);
		} else {
			// console.log("Create student:", student);
			return this.studentDao.insertStudent(student);
		}
	}
}
