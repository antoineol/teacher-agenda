import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Student} from "../model/Student";
import {StorageDao} from "../framework/dao/StorageDao";

const COLLECTION_STUDENTS = "students";

@Injectable()
export class StudentDao {

	constructor(private dao:StorageDao) {
	}

	findStudents():Observable<Student[]> {
		return this.dao.findAll(COLLECTION_STUDENTS).map((students:Student[]) => students ? students : []);
	}

	insertStudent(student:Student):Promise<void> {
		return this.dao.pushToList(COLLECTION_STUDENTS, student);
	}

	updateStudent(student:Student):Promise<void> {
		// TODO validate how to get the key. If included in the entity, remove the need of key param here
		return this.dao.updateInList(COLLECTION_STUDENTS, student);
	}

	removeStudent(student:Student):Promise<void> {
		// TODO validate how to get the key. If included in the entity, replace the key by the entity
		// because the key is an internal Firebase logic.
		return this.dao.removeInList(COLLECTION_STUDENTS, student);
	}

}
