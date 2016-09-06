import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {AgendaEntry} from "../model/Lesson";
import {Student} from "../model/Student";
import {Parameters} from "../model/Parameters";
import {StorageDao} from "../framework/dao/StorageDao";
import {AgendaConfig} from "../config/AgendaConfig";
import {Query} from "angularfire2/interfaces";

export const COLLECTION_AGENDA = "agenda";
export const COLLECTION_STUDENTS = "students";
export const COLLECTION_PARAMETERS = "parameters";

@Injectable()
export class AgendaDao {

	constructor(private dao:StorageDao) {
	}

	findAgenda(query?:Query):Observable<AgendaEntry[]> {
		return this.dao.findAll(COLLECTION_AGENDA, query)
			.map((agenda:AgendaEntry[]) => agenda ? agenda : [])
			.filter((agenda:AgendaEntry[]) => {
				let entriesToUpdate:AgendaEntry[] = [];
				for (let entry of agenda) {
					let modified:boolean = false;
					// Intercept: if entries are found with incorrect data, they are fixed and updated on-the-fly.
					if (typeof entry.price === 'string') {
						entry.price = +entry.price; // convert to number
						modified = true;
					}
					if (!entry.date) {
						entry.date = new Date().toJSON();
						modified = true;
					}
					// if (entry.repetition === Freq.NONE || !entry.repetition) {
					// 	entry.repetition = Freq.WEEKLY;
					// 	modified = true;
					// }
					if (modified) {
						entriesToUpdate.push(entry);
					}
				}
				if (entriesToUpdate.length) {
					this.updateAgendaList(entriesToUpdate);
					return false;
				}
				return true;
			})
			;
	}

	findAgendaEntry(key:string):Observable<AgendaEntry> {
		return this.dao.findByKey(COLLECTION_AGENDA, key)
	}

	findStudents():Observable<Student[]> {
		return this.dao.findAll(COLLECTION_STUDENTS)
			.map((students:Student[]) => students ? students : [])
			.filter((students:Student[]) => {
				let studentsToUpdate:Student[] = [];
				for (let student of students) {
					let modified:boolean = false;
					// Intercept: if entries are found with incorrect data, they are fixed and updated on-the-fly.
					if (typeof student.price === 'string') {
						student.price = +student.price; // convert to number
						modified = true;
					}
					// if (!student.startBilling) {
					// 	student.startBilling = AgendaConfig.defaultStartBillingDate;
					// 	modified = true;
					// }
					if (student.startBilling != null) {
						delete student.startBilling;
						modified = true;
					}
					// if (typeof student.paid !== 'number') {
					// 	student.paid = 0;
					// 	modified = true;
					// }
					if (student.paid != null) {
						delete student.paid;
						modified = true;
					}
					if (modified) {
						studentsToUpdate.push(student);
					}
				}
				if (studentsToUpdate.length) {
					this.updateStudents(studentsToUpdate);
					return false;
				}
				return true;
			})
			;
	}

	findStudent(key:string):Observable<Student> {
		return this.dao.findByKey(COLLECTION_STUDENTS, key)
	}

	findParameters():Observable<Parameters> {
		return this.dao.findObject(COLLECTION_PARAMETERS)
			.filter((params:Parameters) => {
				if (params && params.defaultDuration) {
					return true;
				}
				if (!params) {
					params = {defaultDuration: AgendaConfig.defaultDuration};
				} else if (!params.defaultDuration) {
					params.defaultDuration = AgendaConfig.defaultDuration;
				}
				this.dao.insertObject(COLLECTION_PARAMETERS, params);
				return false;
			})
			.map((params:Parameters) => params ? params : {});
	}

	insertAgendaEntry(entry:AgendaEntry):Promise<void> {
		return this.dao.pushToList(COLLECTION_AGENDA, entry);
	}

	updateAgendaEntry(entry:AgendaEntry):Promise<void> {
		return this.dao.updateInList(COLLECTION_AGENDA, entry);
	}

	updateAgendaList(entries:AgendaEntry[]):Promise<void> {
		return this.dao.updateList(COLLECTION_AGENDA, entries);
	}

	removeAgendaEntry(entry:AgendaEntry):Promise<void> {
		return this.dao.removeInList(COLLECTION_AGENDA, entry);
	}

	updateStudents(students:Student[]):Promise<void> {
		return this.dao.updateList(COLLECTION_STUDENTS, students);
	}

}
