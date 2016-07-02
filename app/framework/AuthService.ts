import {Injectable, Inject} from "@angular/core";
import {
	FirebaseAuth,
	FirebaseAuthState,
	FirebaseRef,
	AuthProviders,
	AuthMethods,
	AngularFire,
} from "angularfire2";
import {ReplaySubject} from "rxjs/ReplaySubject";
import {AuthConfiguration} from "angularfire2/es6/providers/auth_backend";
import {Utils} from "../business/Utils";
import defer = require("promise-defer");
// import {FirebaseSdkAuthBackend} from "angularfire2/es6/providers/firebase_sdk_auth_backend";

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
	popChangePwd = new ReplaySubject<FirebaseAuthDataPassword>(1);
	// private fbAuth:firebase.auth.Auth;

	constructor(private auth: FirebaseAuth, @Inject(FirebaseRef) private ref:Firebase/*, private af:AngularFire*/) {
		// subscribe to the auth object to check for the login status
		// of the user, if logged in, save some user information and
		// execute the firebase query...
		// .. otherwise
		// _show the login modal page
		// this.fbAuth = (<any>af.auth)._authBackend._fbAuth;

		// console.log("Firebase ref:", ref);
		// console.log("Firebase af:", af);
		// let authBackend:FirebaseSdkAuthBackend = (<any>af.auth)._authBackend;
		// console.log("Firebase authBackend:", authBackend);//_fbAuth
		// console.log("Firebase fbAuth:", authBackend._fbAuth.sendPasswordResetEmail);

		this.auth.subscribe((authInfo:FirebaseAuthState) => {
			console.log("authInfo:", authInfo);
			if (!authInfo) {
				this.requestAuth();
				// TODO used in angularfire2 beta 0
			// } else if (authInfo.password && authInfo.password.isTemporaryPassword) {
			// 	this.requestPwdChange(authInfo.password);
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
		// return this.fbAuth.sendPasswordResetEmail(credentials.email);
		return new Promise<void>((resolve, reject) => {
			this.ref.resetPassword(credentials, (error:any) => {
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
			this.ref.changePassword(credentials, (error:any) => {
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
			this.ref.changeEmail(credentials, (error:any) => {
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
		// angularfire2 beta 2
		return this.auth.createUser(credentials).then((authData: FirebaseAuthState) => {
			console.log(authData);
			return this.resetPasswordFirebase({email: credentials.email}).then(() => {
				return this.login(AuthService.METHOD_PASSWORD, credentials);
			});
		});
		// angularfire2 beta 0
		// return this.auth.createUser(credentials).then((authData: FirebaseAuthData) => {
		// 	console.log(authData);
		// 	return this.resetPasswordFirebase({email: credentials.email}).then(() => {
		// 		return this.login(AuthService.METHOD_PASSWORD, credentials);
		// 	});
		// });
	}

	changePassword(credentials:FirebaseChangePasswordCredentials):Promise<void> {
		// TODO continue from here
		return this.changePasswordFirebase(credentials).then(() => {
			this.popChangePwd.next(null);
			this.modalShown = false;
		})
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
	private requestPwdChange(password:FirebaseAuthDataPassword):Promise<void> {
		if (this.modalShown) {
			return;
		}
		this.modalShown = true;
		this.popChangePwd.next(password);
	}
}
