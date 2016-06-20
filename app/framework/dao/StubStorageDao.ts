import {Injectable} from "@angular/core";
import {Http, Response} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {FirebaseStorageDao} from "./FirebaseStorageDao";
import {StorageDao} from "./StorageDao";

// @Injectable()
// export class Cache {
//
// 	// Current implementation: in-memory cache. Can be moved to local storage or session storage.
//
// 	cache = new Map<string, any>();
//
// 	get(key:string):any {
// 		return this.cache.get(key);
// 	}
//
// 	set(key:string, value:any):void {
// 		this.cache.set(key, value);
// 	}
// }


@Injectable()
export class StubStorageDao implements StorageDao {

	private loadingObs = new Map<string, Observable<any>>();

	constructor(private http:Http/*, private cache:Cache*/) {
	}

	public findAll(collection:string):Observable<any> {
		return this.findJson(collection);
	}

	findObject(collection:string):Observable<any> {
		return this.findJson(collection);
	}

	findByKey(collection:string, key:string):Observable<any> {
		return this.findJson(collection);
	}

	pushToList(collection:string, entity:any):Promise<void> {
		return Promise.resolve(null);
	}

	pushToListGlobal(collection:string, entity:any):Promise<void> {
		return Promise.resolve(null);
	}

	updateInList(collection:string, entity:any):Promise<void> {
		return Promise.resolve(null);
	}

	updateList(collection:string, entity:any):Promise<void> {
		return Promise.resolve(null);
	}

	removeInList(collection:string, entity:any):Promise<void> {
		return Promise.resolve(null);
	}

	removeAllList(collection:string):Promise<void> {
		return Promise.resolve(null);
	}

	insertObject(collection:string, entity:any):Promise<void> {
		return Promise.resolve(null);
	}

	updateObject(collection:string, entity:any):Promise<void> {
		return Promise.resolve(null);
	}

	removeObject(collection:string):Promise<void> {
		return Promise.resolve(null);
	}


	private findJson(collection:string):Observable<any> {
		// console.log('StubStorageDao findAll');
		let url = 'stub/' + collection + '.json';

		// The shared observable is already used as a memory cache.
		// The use of cache can be re-enabled if persistent, like local storage.

		// let cached = this.cache.get(key);
		// console.log("cached", key, ":", cached);
		// if (cached) {
		// 	return Observable.of(cached);
		// }

		let cachedObs:Observable<any> = this.loadingObs.get(collection);
		// console.log(key, ":", cachedObs);
		if (cachedObs) {
			return cachedObs;
		}
		cachedObs = this.http.get(url).map((resp:Response) => {
			let parsed:any = resp.json();
			// Uncomment if the cache is finally used.
			// this.cache.set(cacheKey, parsed);
			return parsed;
		})/*.share()*/;
		cachedObs = Observable.from(cachedObs.toPromise());
		this.loadingObs.set(collection, cachedObs);
		return cachedObs;
	}

	// public insert(collection:string, entity:any):Observable<void> {
	// 	// TODO implement once we have a persistent storage
	// 	// Mock: persistent inserts/updates not supported yet.
	// 	return Observable.of(null);
	// }
    //
	// public remove(collection:string, entity:any):Observable<void> {
	// 	// TODO implement once we have a persistent storage
	// 	// Mock: persistent removes not supported yet.
	// 	return Observable.of(null);
	// }
}
