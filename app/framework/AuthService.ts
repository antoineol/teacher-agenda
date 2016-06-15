import {Injectable} from "@angular/core";
import {FirebaseAuth} from "angularfire2/angularfire2";
import {Nav, App, NavController} from "ionic-angular/index";
import {AuthFormPage} from "../pages/forms/auth";
// import {Deferred} from "promise-defer";
import defer = require("promise-defer");
// import Deferred = require("promise-defer");
import {Observable, ReplaySubject} from "rxjs/Rx";
import {Deferred} from "promise-defer";
// import defer = require("promise-defer");
// import Deferred = require("promise-defer");
// import Deferred = require("promise-defer");

@Injectable()
export class AuthService {

	private authInfo: any;
	private authDeferred:Deferred<void>;
	private popAuth = new ReplaySubject<void>(1);

	constructor(/*private app:App, */private auth: FirebaseAuth) {
	}

	// TODO continue from here to log in with github
	init(/*nav:Nav*/):void {
		// subscribe to the auth object to check for the login status
		// of the user, if logged in, save some user information and
		// execute the firebase query...
		// .. otherwise
		// show the login modal page
		this.auth.subscribe((data) => {
			console.log("in auth subscribe", data);
			if (data) {
				this.authInfo = data;
			} else {
				this.authInfo = null;
				// this.authenticate(nav);
				// this.nav.push(AgendaDetailPage, {entry: entry});
			}
		});
	}

	// authenticate(nav:NavController):void {
	// 	let nav2:NavController = this.app.getActiveNav();
	// 	console.log("Active:", nav2.getActive());
	// 	console.log("AuthFormPage:", AuthFormPage);
	// 	nav.push(AuthFormPage);
	// }

	ensureAuth():Promise<void> {
		if (this.authInfo) {
			return Promise.resolve(this.authInfo);
		}
		if (this.authDeferred) {
			return this.authDeferred.promise;
		}

		this.authDeferred = defer();
		this.popAuth.next(null);
		return this.authDeferred.promise;



		// let nav:NavController = this.app.getActiveNav();
		// console.log("Active:", nav.getActive()); // null :(
		// console.log("AuthFormPage:", AuthFormPage);
		// console.log("Is AuthFormPage:", (nav.getActive() == AuthFormPage)); // comparison refused
		// return Promise.resolve();
	}

	_showAuthEmitter():Observable<void> {
		return this.popAuth;
	}

	_completeAuth():void {
		this.authDeferred.resolve();
		this.authDeferred = null;
	}
}
