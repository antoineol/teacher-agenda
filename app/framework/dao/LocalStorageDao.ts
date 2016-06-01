import {Injectable} from "@angular/core";
import {Http, Response} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {SqlStorage, Storage} from "ionic-angular";


@Injectable()
export class LocalStorageDao {

	private sql = new Storage(SqlStorage);
	private cache = new Map<string, Promise<any>>();

	// We use sql storage internally to ensure it is persisted, since localStorage may me cleaned
	// by the OS, the user...
	constructor() {
	}

	public find(cacheKey:string):Observable<any> {
		let cached = this.cache.get(cacheKey);
		let promise:Promise<any>;
		if (cached) {
			promise = cached;
		} else {
			promise = this.sql.get(cacheKey).then((val:any) => {
				console.log("val from sql storage:", val);
				return JSON.parse(val);
			}).catch((err:any) => {
				console.warn("non-JSON value in sql storage for key:", cacheKey, "-", undefined, "is returned instead.");
				return undefined;
			});
			this.cache.set(cacheKey, promise);
		}

		return Observable.fromPromise(promise);
	}

	public insert(cacheKey:string, entity:any):Observable<void> {
		// TODO refresh or invalidate cache
		return Observable.fromPromise(this.sql.setJson(cacheKey, entity).then((result:any) => {
			console.log("insert result:", result);
			return result;
		}));
	}

	public remove(cacheKey:string, url:string, entity:any):Observable<void> {
		// this.sql.remove(cacheKey)
		// TODO implement once we have a persistent storage
		// Mock: persistent removes not supported yet.
		return Observable.of(null);
	}
}
