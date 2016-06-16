import {Observable} from "rxjs/Observable";
import {Injectable} from "@angular/core";


@Injectable()
export abstract class StorageDao {
	abstract findAll(collection:string):Observable<any>;
	abstract findObject(collection:string):Observable<any>;
	abstract findByKey(collection:string, key:string):Observable<any>;
	abstract pushToList(collection:string, entity:any):Promise<void>;
	abstract updateInList(collection:string, entity:any):Promise<void>;
	abstract removeInList(collection:string, entity:any):Promise<void>;
	abstract removeAllList(collection:string):Promise<void>;
	abstract insertObject(collection:string, entity:any):Promise<void>;
	abstract updateObject(collection:string, entity:any):Promise<void>;
	abstract removeObject(collection:string):Promise<void>;


	// abstract insert(collection:string, entity:any):Observable<void>;
	// abstract remove(collection:string, entity:any):Observable<void>;
}
// For some unknown reason, the following interface imported in injectables.ts is undefined. TS bug?
// export interface StorageDao {
// 	findAll(collection:string):Observable<any>;
// 	insert(collection:string, entity:any):Observable<void>;
// 	remove(collection:string, entity:any):Observable<void>;
// }

// @Injectable()
// export class StorageDao {
//
// 	private loadingObs = new Map<string, Observable<any>>();
//
// 	constructor(private http:Http, private firebaseDao:FirebaseStorageDao, private stubStorage:StubStorageDao) {
// 	}
//
// 	public findAll(collection:string):Observable<any> {
// 		console.log('StorageDao findAll');
//
// 		// return this.firebaseDao.findAll(collection);
// 		return this.stubStorage.findAll(collection);
// 	}
//
// 	public insert(collection:string, entity:any):Observable<void> {
// 		// KO: always adding at the same key. Currently investigating other approaches. PouchDB seems good.
// 		// return this.localStorage.insert(cacheKey, entity);
// 		return this.stubStorage.insert(collection, entity);
// 	}
//
// 	public remove(collection:string, entity:any):Observable<void> {
// 		return this.stubStorage.remove(collection, entity);
// 	}
// }
