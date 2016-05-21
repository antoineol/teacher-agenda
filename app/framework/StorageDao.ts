import {Injectable} from "@angular/core";
import {Http, Response} from "@angular/http";
import {Observable} from "rxjs/Observable";
import "rxjs/add/observable/of";

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
export class StorageDao {

	constructor(private http:Http, private cache:Cache) {
	}

	public find(key:string, url:string):Observable<any> {
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
