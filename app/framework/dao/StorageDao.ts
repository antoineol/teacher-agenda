import {Injectable} from "@angular/core";
import {Http, Response} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {LocalStorageDao} from "./LocalStorageDao";

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

	private loadingObs = new Map<string, Observable<any>>();

	constructor(private http:Http, private cache:Cache, private localStorage:LocalStorageDao) {
	}

	public find(cacheKey:string, url:string):Observable<any> {

		return this.localStorage.find(cacheKey);

		// The shared observable is already used as a memory cache.
		// The use of cache can be re-enabled if persistent, like local storage.

		// let cached = this.cache.get(key);
		// console.log("cached", key, ":", cached);
		// if (cached) {
		// 	return Observable.of(cached);
		// }

		// let cachedObs:Observable<any> = this.loadingObs.get(cacheKey);
		// // console.log(key, ":", cachedObs);
		// if (cachedObs) {
		// 	return cachedObs;
		// }
		// // console.log("Will call HTTP");
		// cachedObs = this.http.get(url).map((resp:Response) => {
		// 	// console.log("Did call HTTP");
		// 	let parsed:any = resp.json();
		// 	this.cache.set(cacheKey, parsed);
		// 	return parsed;
		// })/*.share()*/;
		// cachedObs = Observable.from(cachedObs.toPromise());
		// this.loadingObs.set(cacheKey, cachedObs);
		// return cachedObs;
	}

	public insert(cacheKey:string, url:string, entity:any):Observable<void> {
		// TODO implement once we have a persistent storage
		// Mock: persistent inserts/updates not supported yet.
		return Observable.of(null);
	}

	public remove(cacheKey:string, url:string, entity:any):Observable<void> {
		// TODO implement once we have a persistent storage
		// Mock: persistent removes not supported yet.
		return Observable.of(null);
	}
}
