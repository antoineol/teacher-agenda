import {Injectable} from "angular2/core";
import {Http, Response} from "angular2/http";
import {Observable} from "rxjs/Observable";
import {AgendaEntry} from "../model/AgendaEntry";
import {Student} from "../model/Student";
import {Parameters} from "../model/Parameters";

@Injectable()
export class Cache {

	// Current implementation: in-memory cache. Can be moved to local storage or session storage.
	cache = new Map<string, any>();

	get(key:string):any {
		return this.cache.get(key);
	}

	set(key:string, value:any):void {
		this.cache.set(key, value);
	}
}

@Injectable()
export class AgendaDao {

	constructor(private http:Http, private cache:Cache) {
	}

	findAgenda():Observable<AgendaEntry[]> {
		return this.find("agenda", "stub/agenda-entries.json");
	}

	findStudents():Observable<Student[]> {
		return this.find("students", "stub/students.json");
	}

	findParameters():Observable<Parameters> {
		return this.find("parameters", "stub/parameters.json");
	}

	private find(key:string, url:string):Observable<any> {
		let cached = this.cache.get(key);
		if (cached) {
			return Observable.of(cached);
		}
		return this.http.get(url).map((resp:Response) => {
			let parsed:any = resp.json();
			this.cache.set(key, parsed);
			return parsed;
		});
	}
}
