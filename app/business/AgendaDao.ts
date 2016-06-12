import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {AgendaEntry} from "../model/Lesson";
import {Student} from "../model/Student";
import {Parameters} from "../model/Parameters";
import {StorageDao} from "../framework/dao/StorageDao";
import {ReplaySubject} from "rxjs/ReplaySubject";

const COLLECTION_AGENDA = "agenda";
const COLLECTION_STUDENTS = "students";
const COLLECTION_PARAMETERS = "parameters";

@Injectable()
export class AgendaDao {

	private agendaUpdates = new ReplaySubject<AgendaEntry[]>(1);

	constructor(private dao:StorageDao) {
	}

	latestAgenda():Observable<AgendaEntry[]> {
		return Observable.merge(this.findAgenda(), this.agendaUpdates);
	}

	findAgenda():Observable<AgendaEntry[]> {
		return this.dao.findAll(COLLECTION_AGENDA).map((agenda:AgendaEntry[]) => agenda ? agenda : []);
	}

	findStudents():Observable<Student[]> {
		return this.dao.findAll(COLLECTION_STUDENTS).map((students:Student[]) => students ? students : []);
	}

	findParameters():Observable<Parameters> {
		return this.dao.findObject(COLLECTION_PARAMETERS).map((params:Parameters) => params ? params : {});
	}

	insertAgendaEntry(entry:AgendaEntry):Observable<void> {
		return this.findAgenda().mergeMap((entries:AgendaEntry[]) => {
			entries.push(entry);
			// console.log("agendaUpdates", entries)
			this.agendaUpdates.next(entries);
			return this.dao.pushToList(COLLECTION_AGENDA, entry);
		});
	}

	updateAgendaEntry(entry:AgendaEntry):Observable<void> {
		return this.findAgenda().mergeMap((entries:AgendaEntry[]) => {

			// TODO if firebase automatically updates the local model (and re-emit), move the manual update
			// to the stub storage

			// The reference should have already been updated.
			// entries.push(entry);
			// console.log("Update of entry", entry);
			this.agendaUpdates.next(entries);
			// TODO validate how to get the key. If included in the entity, remove the need of key param here
			// because it is an internal Firebase logic.
			return this.dao.updateInList(COLLECTION_AGENDA, "Replace by the real key", entry);
		});
	}

	removeAgendaEntry(entry:AgendaEntry):Observable<void> {
		return this.findAgenda().mergeMap((entries:AgendaEntry[]) => {

			// TODO if firebase automatically updates the local model (and re-emit), move the manual update
			// to the stub storage
			
			let i = entries.indexOf(entry);
			if (i === -1) {
				return Promise.reject(new Error("Entry to remove not found in the list of entries (AgendaDao)"));
			}

			entries.splice(i, 1);
			this.agendaUpdates.next(entries);
			// TODO validate how to get the key. If included in the entity, replace the key by the entity
			// because the key is an internal Firebase logic.
			return this.dao.removeInList(COLLECTION_AGENDA, "Replace by the real key");
		});
	}

}
