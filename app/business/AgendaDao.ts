import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {AgendaEntry, Freq} from "../model/Lesson";
import {Student} from "../model/Student";
import {Parameters} from "../model/Parameters";
import {StorageDao} from "../framework/dao/StorageDao";
import {AgendaConfig} from "../config/AgendaConfig";

const COLLECTION_AGENDA = "agenda";
const COLLECTION_STUDENTS = "students";
const COLLECTION_PARAMETERS = "parameters";

@Injectable()
export class AgendaDao {

	// private agendaUpdates = new ReplaySubject<AgendaEntry[]>(1);

	constructor(private dao:StorageDao) {
	}

	// latestAgenda():Observable<AgendaEntry[]> {
	// 	// return Observable.merge(this.findAgenda(), this.agendaUpdates);
	// 	return this.findAgenda();
	// }

	findAgenda():Observable<AgendaEntry[]> {
		return this.dao.findAll(COLLECTION_AGENDA)
			.map((agenda:AgendaEntry[]) => agenda ? agenda : [])
			.filter((agenda:AgendaEntry[]) => {
				let entriesToUpdate:AgendaEntry[] = [];
				for (let entry of agenda) {
					// TODO Intercept: if entries are found with incorrect data, they are fixed and updated on-the-fly.
					if (entry.repetition === Freq.NONE) {
						entry.repetition = Freq.WEEKLY;
						entriesToUpdate.push(entry);
					}
				}
				if (entriesToUpdate.length) {
					let update:any = {};
					for (let entry of entriesToUpdate) {
						let k = entry.$key;
						let e = Object.assign({}, entry);
						delete e.$key;
						update[k] = e;
					}
					// We actually update a list of entries in once
					this.updateAgendaEntry(update);
					return false;
				}
				return true;
			})
			;
	}

	findStudents():Observable<Student[]> {
		return this.dao.findAll(COLLECTION_STUDENTS).map((students:Student[]) => students ? students : []);
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
		// return this.findAgenda().mergeMap((entries:AgendaEntry[]) => {
		// 	entries.push(entry);
		// 	// console.log("agendaUpdates", entries)
		// 	this.agendaUpdates.next(entries);
		// 	return this.dao.pushToList(COLLECTION_AGENDA, entry);
		// });
	}

	updateAgendaEntry(entry:AgendaEntry):Promise<void> {
		return this.dao.updateInList(COLLECTION_AGENDA, entry);
		// return this.findAgenda().mergeMap((entries:AgendaEntry[]) => {
        //
		// 	// TODO if firebase automatically updates the local model (and re-emit), move the manual update
		// 	// to the stub storage
        //
		// 	// The reference should have already been updated.
		// 	// entries.push(entry);
		// 	// console.log("Update of entry", entry);
		// 	this.agendaUpdates.next(entries);
		// 	// TODO validate how to get the key. If included in the entity, remove the need of key param here
		// 	// because it is an internal Firebase logic.
		// 	return this.dao.updateInList(COLLECTION_AGENDA, entry);
		// });
	}

	removeAgendaEntry(entry:AgendaEntry):Promise<void> {
		return this.dao.removeInList(COLLECTION_AGENDA, entry);
		// return this.findAgenda().mergeMap((entries:AgendaEntry[]) => {
        //
		// 	// TODO if firebase automatically updates the local model (and re-emit), move the manual update
		// 	// to the stub storage
		//
		// 	let i = entries.indexOf(entry);
		// 	if (i === -1) {
		// 		return Promise.reject(new Error("Entry to remove not found in the list of entries (AgendaDao)"));
		// 	}
        //
		// 	entries.splice(i, 1);
		// 	this.agendaUpdates.next(entries);
		// 	// TODO validate how to get the key. If included in the entity, replace the key by the entity
		// 	// because the key is an internal Firebase logic.
		// 	return this.dao.removeInList(COLLECTION_AGENDA, entry);
		// });
	}

}
