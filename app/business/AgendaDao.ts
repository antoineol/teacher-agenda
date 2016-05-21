import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {AgendaEntry} from "../model/Lesson";
import {Student} from "../model/Student";
import {Parameters} from "../model/Parameters";
import {StorageDao} from "../framework/StorageDao";

@Injectable()
export class AgendaDao {

	constructor(private dao:StorageDao) {
	}

	findAgenda():Observable<AgendaEntry[]> {
		return this.dao.find("agenda", "stub/agenda-entries.json");
	}

	findStudents():Observable<Student[]> {
		return this.dao.find("students", "stub/students.json");
	}

	findParameters():Observable<Parameters> {
		return this.dao.find("parameters", "stub/parameters.json");
	}
}
