import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {AngularFire, FirebaseListObservable, FirebaseObjectObservable} from "angularfire2/angularfire2";
import {StorageDao} from "./StorageDao";
import {AuthService} from "../AuthService";


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
	constructor(private af: AngularFire/*, public auth: FirebaseAuth*/, private authService:AuthService) {
	}
	ngOnInit() {
		// https://github.com/aaronksaunders/ionic2-angularfire-sample/blob/master/app/pages/home/home.ts#L45
		// this.auth.subscribe((data) => {
	}

	// TODO login with wechat
	// http://stackoverflow.com/questions/32629147/wechat-api-is-unable-to-set-app-icon
	// http://stackoverflow.com/questions/34507731/authenticate-mobile-application-with-wechat

	findAll(collection:string):Observable<any> {
		return this.authObs().map(() => {
			console.log("find all");
			let obs = this.getListBinding(collection).share();
			obs.subscribe((result:any) => {
				console.log("In firebase DAO:", result);
			}, (err:any) => {
				console.log("In firebase DAO error:", err.stack || err);
			});
			return obs;
			// return this.getListBinding(collection)/*.map((val:any) => {
			// 	console.log("Val:", val);
			// 	return val;
			// })*/;
		});
	}

	findObject(collection:string):Observable<any> {
		return this.authObs().map(() => {
			return this.getObjectBinding(collection);
		});
	}

	pushToList(collection:string, entity:any):Promise<void> {
		return this.auth().then(() => {
			this.checkFirebaseEntity(entity);
			return <Promise<void>>/*FirebaseWithPromise<void>*/this.getListBinding(collection).push(entity);
		});
	}

	updateInList(collection:string, entity:any):Promise<void> {
		return this.auth().then(() => {
			this.checkUpdateFirebaseEntity(entity);
			// console.log("Update collection", collection, ":", entity.$key, entity);
			// TODO dirty but there is no clear/simple way yet to update the whole object in once.
			// https://github.com/angular/angularfire2/issues/190
			let updateEntity = Object.assign({}, entity);
			delete updateEntity.$key;
			return this.getListBinding(collection).update(entity, updateEntity);
		});
	}

	removeInList(collection:string, entity:any):Promise<void> {
		return this.auth().then(() => {
			this.checkUpdateFirebaseEntity(entity);
			return this.getListBinding(collection).remove(entity.$key);
		});
	}

	removeAllList(collection:string):Promise<void> {
		return this.auth().then(() => {
			return this.getListBinding(collection).remove();
		});
	}

	insertObject(collection:string, entity:any):Promise<void> {
		return this.auth().then(() => {
			this.checkFirebaseEntity(entity);
			return this.getObjectBinding(collection).set(entity);
		});
	}

	updateObject(collection:string, entity:any):Promise<void> {
		return this.auth().then(() => {
			this.checkFirebaseEntity(entity);
			return this.getObjectBinding(collection).update(entity);
		});
	}

	removeObject(collection:string):Promise<void> {
		return this.auth().then(() => {
			return this.getObjectBinding(collection).remove();
		});
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
		// return Observable.fromPromise(this.auth.ensureAuth()).map(() => {
			let binding:FirebaseListObservable<any> = <FirebaseListObservable<any>>this.bindings.get(collection);
			if (!binding) {
				binding = this.af.database.list('/' + collection);
				this.bindings.set(collection, binding);
			}
			return binding;
		// });
		// let binding:FirebaseListObservable<any> = <FirebaseListObservable<any>>this.bindings.get(collection);
		// if (!binding) {
		// 	binding = this.af.database.list('/' + collection);
		// 	this.bindings.set(collection, binding);
		// }
		// return binding;
	}

	private getObjectBinding(collection:string):FirebaseObjectObservable<any> {
		// return Observable.fromPromise(this.auth.ensureAuth()).map(() => {
			let binding:FirebaseObjectObservable<any> = <FirebaseObjectObservable<any>>this.bindings.get(collection);
			if (!binding) {
				binding = this.af.database.object('/' + collection);
				this.bindings.set(collection, binding);
			}
			return binding;
		// });
	}

	private authObs():Observable<void> {
		return Observable.fromPromise(this.authService.ensureAuth());
	}

	private auth():Promise<void> {
		return this.authService.ensureAuth();
	}
}
