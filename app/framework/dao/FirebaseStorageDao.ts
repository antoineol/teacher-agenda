import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {AngularFire, FirebaseListObservable, FirebaseObjectObservable} from "angularfire2/angularfire2";
import {StorageDao} from "./StorageDao";


@Injectable()
export class FirebaseStorageDao implements StorageDao {

	// private sql = new Storage(SqlStorage);
	private cache = new Map<string, Promise<any>>();
	// FirebaseObjectObservable or FirebaseListObservable
	private bindings = new Map<string, Observable<any>>();

	// Alternative in China: Kii
	// Firebase with Angular2: angularfire2 once updated to firebase 3
	// https://github.com/aaronksaunders/ionic2-angularfire-sample
	// http://stackoverflow.com/a/36537871


	// We use sql storage internally to ensure it is persisted, since localStorage may me cleaned
	// by the OS, the user...
	constructor(private af: AngularFire/*, public auth: FirebaseAuth*/) {
	}
	ngOnInit() {
		// https://github.com/aaronksaunders/ionic2-angularfire-sample/blob/master/app/pages/home/home.ts#L45
		// this.auth.subscribe((data) => {
	}

	// TODO login with wechat
	// http://stackoverflow.com/questions/32629147/wechat-api-is-unable-to-set-app-icon
	// http://stackoverflow.com/questions/34507731/authenticate-mobile-application-with-wechat

	public findAll(collection:string):Observable<any> {
		return this.getListBinding(collection);
	}

	public findObject(collection:string):Observable<any> {
		return this.getObjectBinding(collection);
	}

	public pushToList(collection:string, entity:any):Promise<void> {
		this.checkFirebaseEntity(entity);
		return <Promise<void>>/*FirebaseWithPromise<void>*/this.getListBinding(collection).push(entity);
	}

	public updateInList(collection:string, entity:any):Promise<void> {
		this.checkUpdateFirebaseEntity(entity);
		// console.log("Update collection", collection, ":", entity.$key, entity);
		// TODO dirty but there is no clear/simple way yet to update the whole object in once.
		// https://github.com/angular/angularfire2/issues/190
		let updateEntity = Object.assign({}, entity);
		delete updateEntity.$key;
		return this.getListBinding(collection).update(entity, updateEntity);
	}

	public removeInList(collection:string, entity:any):Promise<void> {
		this.checkUpdateFirebaseEntity(entity);
		return this.getListBinding(collection).remove(entity.$key);
	}

	public removeAllList(collection:string):Promise<void> {
		return this.getListBinding(collection).remove();
	}

	public insertObject(collection:string, entity:any):Promise<void> {
		this.checkFirebaseEntity(entity);
		return this.getObjectBinding(collection).set(entity);
	}

	public updateObject(collection:string, entity:any):Promise<void> {
		this.checkFirebaseEntity(entity);
		return this.getObjectBinding(collection).update(entity);
	}

	public removeObject(collection:string):Promise<void> {
		return this.getObjectBinding(collection).remove();
	}


	// Internal Firebase util

	private checkUpdateFirebaseEntity(entity:any):void {
		if (!entity || !entity.$key) {
			throw new Error("Not a firebase entity, null or without $key: " + entity);
		}
		this.checkFirebaseEntity(entity);
	}
	private checkFirebaseEntity(entity:any):void {
		if (entity) {
			for (let property in entity) {
				if (entity.hasOwnProperty(property) && entity[property] == null) {
					delete entity[property];
				}
			}
		}
	}

	private getListBinding(collection:string):FirebaseListObservable<any> {
		let binding:FirebaseListObservable<any> = <FirebaseListObservable<any>>this.bindings.get(collection);
		if (!binding) {
			binding = this.af.database.list('/' + collection);
			this.bindings.set(collection, binding);
		}
		return binding;
	}

	private getObjectBinding(collection:string):FirebaseObjectObservable<any> {
		let binding:FirebaseObjectObservable<any> = <FirebaseObjectObservable<any>>this.bindings.get(collection);
		if (!binding) {
			binding = this.af.database.object('/' + collection);
			this.bindings.set(collection, binding);
		}
		return binding;
	}
}
