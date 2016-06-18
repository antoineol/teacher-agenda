import {Injectable, Inject} from "@angular/core";
import {
	FirebaseAuth, FirebaseAuthState, Firebase, FirebaseRef, AuthProviders,
	AuthMethods
} from "angularfire2/angularfire2";
import {Nav, App, NavController} from "ionic-angular/index";
import {AuthFormPage} from "../pages/forms/auth";
// import {Deferred} from "promise-defer";
import defer = require("promise-defer");
// import Deferred = require("promise-defer");
import {Observable} from "rxjs/Observable";
import {ReplaySubject} from "rxjs/ReplaySubject";
import {Deferred} from "promise-defer";
import {AuthConfiguration} from "angularfire2/es6/providers/auth_backend";
import {Utils} from "../business/Utils";
import {AgendaDao} from "../business/AgendaDao";
import {Parameters} from "../model/Parameters";
// import defer = require("promise-defer");
// import Deferred = require("promise-defer");
// import Deferred = require("promise-defer");

@Injectable()
export class AuthService {

	// TODO fallback popup to redirect when not available
	static METHOD_GITHUB = {
		provider: AuthProviders.Github,
		method: AuthMethods.Popup,
		// method: AuthMethods.Redirect,
	};
	static METHOD_PASSWORD = {
		provider: AuthProviders.Password,
		method: AuthMethods.Password
	};

	private authDeferred:Deferred<FirebaseAuthState>;
	popAuth = new ReplaySubject<boolean>(1);
	popChangePwd = new ReplaySubject<boolean>(1);

	constructor(private auth: FirebaseAuth, @Inject(FirebaseRef) private ref:Firebase) {
		// subscribe to the auth object to check for the login status
		// of the user, if logged in, save some user information and
		// execute the firebase query...
		// .. otherwise
		// _show the login modal page

		this.auth.subscribe((authInfo:FirebaseAuthState) => {
			if (!authInfo) {
				// console.log("Logged out.");
				this.requestAuth();
			} else if (authInfo.password && authInfo.password.isTemporaryPassword) {
				this.requestPwdChange();
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

	// TODO Temporary implementation until angularfire2 supports Firebase SDK v3
	// https://github.com/angular/angularfire2/issues/220#issuecomment-225317731

	resetPasswordFirebase(credentials:FirebaseResetPasswordCredentials):Promise<void> {
		return new Promise<void>((resolve, reject) => {
			this.ref.resetPassword(credentials, error => {
				if (error) {
					reject(error);
				} else {
					resolve();
				}
			});
		});
	}

	changePasswordFirebase(credentials:FirebaseChangePasswordCredentials):Promise<void> {
		return new Promise<void>((resolve, reject) => {
			this.ref.changePassword(credentials, error => {
				if (error) {
					reject(error);
				} else {
					resolve();
				}
			});
		});
	}

	changeEmailFirebase(credentials:FirebaseChangeEmailCredentials):Promise<void> {
		return new Promise<void>((resolve, reject) => {
			this.ref.changeEmail(credentials, error => {
				if (error) {
					reject(error);
				} else {
					resolve();
				}
			});
		});
	}

	// End of temporary implementation

	ensureAuth():Promise<FirebaseAuthState> {
		return this.auth.first().toPromise().then((authInfo:FirebaseAuthState) => {
			// console.log("in auth subscribe", authInfo);
			if (authInfo) {
				return Promise.resolve(authInfo);
			}
			return this.requestAuth();
		});
	}

	login(options?:AuthConfiguration, credentials?:FirebaseCredentials):Promise<void> {
		let loginPromise = credentials ? this.auth.login(credentials, options) : this.auth.login(options);
		return loginPromise.then((user:FirebaseAuthState) => {
			if (!this.authDeferred) {
				console.warn("Calling login(), but the deferred object is falsy: it seems the authentication was already completed. The application should avoid to request twice the authentication on the same time.");
				console.warn("User:", user);
				return;
			}
			this.authDeferred.resolve(user);
			this.popAuth.next(false);
			this.authDeferred = null;
		});
	}

	logout():void {
		// console.log("Logout");
		this.auth.logout();
	}

	signup(credentials:FirebaseCredentials):Promise<void> {
		credentials.password = Utils.randomPassword();
		return this.auth.createUser(credentials).then((authData: FirebaseAuthData) => {
			console.log(authData);
			return this.resetPasswordFirebase({email: credentials.email}).then(() => {
				return this.login(AuthService.METHOD_PASSWORD, credentials);
			});
		})
	}

	changePassword(credentials:FirebaseChangePasswordCredentials) {
		// TODO continue from here
	}

	private requestAuth():Promise<FirebaseAuthState> {
		if (this.authDeferred) {
			return this.authDeferred.promise;
		}
		this.authDeferred = defer<FirebaseAuthState>();
		this.popAuth.next(true);
		return this.authDeferred.promise;
	}

	private modalShown:boolean;
	private requestPwdChange():Promise<void> {
		if (this.modalShown) {
			return;
		}
		this.modalShown = true;
		this.popChangePwd.next(true);
	}
}
