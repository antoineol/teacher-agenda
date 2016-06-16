import {Injectable} from "@angular/core";
import {FirebaseAuth, FirebaseAuthState} from "angularfire2/angularfire2";
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

	private authDeferred:Deferred<FirebaseAuthState>;
	private popAuth = new ReplaySubject<boolean>(1);

	constructor(/*private app:App, */private auth: FirebaseAuth) {
		// subscribe to the auth object to check for the login status
		// of the user, if logged in, save some user information and
		// execute the firebase query...
		// .. otherwise
		// show the login modal page

		this.auth.subscribe((authInfo:FirebaseAuthState) => {
			if (!authInfo) {
				// console.log("Logged out.");
				this.requestAuth();
			}
		});
	}

	// init(/*nav:Nav*/):void {
	// }

	// authenticate(nav:NavController):void {
	// 	let nav2:NavController = this.app.getActiveNav();
	// 	console.log("Active:", nav2.getActive());
	// 	console.log("AuthFormPage:", AuthFormPage);
	// 	nav.push(AuthFormPage);
	// }

	ensureAuth():Promise<FirebaseAuthState> {
		return this.auth.first().toPromise().then((authInfo:FirebaseAuthState) => {
			// console.log("in auth subscribe", authInfo);
			if (authInfo) {
				return Promise.resolve(authInfo);
			}
			return this.requestAuth();
		});
	}

	logout():void {
		// console.log("Logout");
		this.auth.logout();
	}

	_showAuthEmitter():Observable<boolean> {
		return this.popAuth;
	}

	_completeAuth(user:FirebaseAuthState):void {
		if (!this.authDeferred) {
			console.warn("Calling _completeAuth(), but the deferred object is falsy: it seems the authentication was already completed. The application should avoid to request twice the authentication on the same time.");
			console.warn("User:", user);
			return;
		}
		this.authDeferred.resolve(user);
		this.popAuth.next(false);
		this.authDeferred = null;
	}

	private requestAuth():Promise<FirebaseAuthState> {
		if (this.authDeferred) {
			return this.authDeferred.promise;
		}
		this.authDeferred = defer<FirebaseAuthState>();
		this.popAuth.next(true);
		return this.authDeferred.promise;
	}
}
