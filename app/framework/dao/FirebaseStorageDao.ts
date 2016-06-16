import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {
	AngularFire,
	FirebaseListObservable,
	FirebaseObjectObservable,
	FirebaseAuthState
} from "angularfire2/angularfire2";
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
		return this.authObs().mergeMap((user:FirebaseAuthState) => {
			return this.getListBinding(user, collection);
		});
	}

	findObject(collection:string):Observable<any> {
		return this.authObs().mergeMap((user:FirebaseAuthState) => {
			return this.getObjectBinding(user, collection);
		});
	}

	findByKey(collection:string, key:string):Observable<any> {
		return this.authObs().mergeMap((user:FirebaseAuthState) => {
			return this.getObjectBinding(user, collection + '/' + key).map((obj:any) => {
				obj.$key = key;
				return obj;
			});
		});
	}

	pushToList(collection:string, entity:any):Promise<void> {
		return this.auth().then((user:FirebaseAuthState) => {
			this.checkFirebaseEntity(entity);
			return <Promise<void>>/*FirebaseWithPromise<void>*/this.getListBinding(user, collection).push(entity);
		});
	}

	updateInList(collection:string, entity:any):Promise<void> {
		return this.auth().then((user:FirebaseAuthState) => {
			this.checkUpdateFirebaseEntity(entity);
			// console.log("Update collection", collection, ":", entity.$key, entity);
			// TODO dirty but there is no clear/simple way yet to update the whole object in once.
			// https://github.com/angular/angularfire2/issues/190
			let updateEntity = Object.assign({}, entity);
			delete updateEntity.$key;
			return this.getListBinding(user, collection).update(entity, updateEntity);
		});
	}

	removeInList(collection:string, entity:any):Promise<void> {
		return this.auth().then((user:FirebaseAuthState) => {
			this.checkUpdateFirebaseEntity(entity);
			return this.getListBinding(user, collection).remove(entity.$key);
		});
	}

	removeAllList(collection:string):Promise<void> {
		return this.auth().then((user:FirebaseAuthState) => {
			return this.getListBinding(user, collection).remove();
		});
	}

	insertObject(collection:string, entity:any):Promise<void> {
		return this.auth().then((user:FirebaseAuthState) => {
			this.checkFirebaseEntity(entity);
			return this.getObjectBinding(user, collection).set(entity);
		});
	}

	updateObject(collection:string, entity:any):Promise<void> {
		return this.auth().then((user:FirebaseAuthState) => {
			this.checkFirebaseEntity(entity);
			return this.getObjectBinding(user, collection).update(entity);
		});
	}

	removeObject(collection:string):Promise<void> {
		return this.auth().then((user:FirebaseAuthState) => {
			return this.getObjectBinding(user, collection).remove();
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

	private getListBinding(user:FirebaseAuthState, collection:string):FirebaseListObservable<any> {
		// return Observable.fromPromise(this.auth.ensureAuth()).map(() => {
			let binding:FirebaseListObservable<any> = <FirebaseListObservable<any>>this.bindings.get(collection);
			if (!binding) {
				binding = this.af.database.list('/users/' + user.uid + '/' + collection);
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

	private getObjectBinding(user:FirebaseAuthState, collection:string):FirebaseObjectObservable<any> {
		// return Observable.fromPromise(this.auth.ensureAuth()).map(() => {
			let binding:FirebaseObjectObservable<any> = <FirebaseObjectObservable<any>>this.bindings.get(collection);
			if (!binding) {
				binding = this.af.database.object('/users/' + user.uid + '/' + collection);
				this.bindings.set(collection, binding);
			}
			return binding;
		// });
	}

	private authObs():Observable<FirebaseAuthState> {
		return Observable.fromPromise(this.authService.ensureAuth());
	}

	private auth():Promise<FirebaseAuthState> {
		return this.authService.ensureAuth();
	}
}
