import {Component} from "@angular/core";
import {ControlGroup, FormBuilder, Validators} from "@angular/common";
import {NavController, Modal, ViewController} from "ionic-angular";
import {ErrorService} from "../../framework/ErrorService";
import {AuthService} from "../../framework/AuthService";
import {AuthConfiguration, EmailPasswordCredentials} from "angularfire2/es6/providers/auth_backend";
import {Toaster} from "../../framework/Toaster";
import {AuthMethods} from "angularfire2/angularfire2";
import {Credentials} from "../../../typings_manual/global/angularfire";
import {matchingPasswords} from "../../framework/validators/matchingPasswordsValidator";


@Component({
	templateUrl: 'build/pages/pop/auth.html'
})
export class AuthFormPage {

	static data = {};
	static opts = {enableBackdropDismiss: false};

	loading:boolean;
	private signUpMode:string = '';
	private loginCreds:ControlGroup;

	// static _show(nav:NavController):void {
	// 	let loginPage = Modal.create(AuthFormPage, {}, {enableBackdropDismiss: false});
	// 	// Workaround: https://github.com/driftyco/ionic/issues/6933#issuecomment-226508870
	// 	//(<any>loginPage).fireOtherLifecycles = false;
	// 	nav.present(loginPage);
	// 	// console.log("AuthFormPage present");
	// }

	constructor(private authService:AuthService, private viewCtrl:ViewController, fb:FormBuilder,
				private error:ErrorService, private toaster:Toaster) {
		this.loginCreds= fb.group({
			email: ['', Validators.required],
			password: ['', Validators.required],
			confirmPassword: ['', Validators.required],
		}, {validator: matchingPasswords('password', 'confirmPassword')});
	}

	private loginWithGithub():void {
		this.login(AuthService.METHOD_GITHUB);
	}

	private loginWithEmail(credentials:EmailPasswordCredentials):void {
		if (this.signUpMode === 'signup') {
			// console.log("Sign up with email:", credentials);
			this.signUp(credentials);
		} else {
			// console.log("Login with email:", credentials);
			this.login(AuthService.METHOD_PASSWORD, credentials);
		}
	}

	// private signup():void {
	// 	this.signUp = true;
	// }

	private signUp(credentials:EmailPasswordCredentials):void {
		this.loading = true;
		this.authService.signup(credentials).then(() => {
			this.loading = false;
			this.signUpMode = '';
			// the signup seems to include the sign-in, we can close the popup.
			return this._dismiss();
		}).then(() => {
			this.toaster.toast('auth.checkEmailSent');
		}, (err:any) => {
			this.loading = false;
			this.error.handler(err.code)(err);
		});
	}

	private resetPassword(credentials:{email:string}):void {
		this.loading = true;
		this.authService.resetPasswordFirebase(credentials.email).then(() => {
			this.loading = false;
			this.toaster.toast('auth.checkEmailSent');
			this.signUpMode = '';
		}, (err:any) => {
			this.loading = false;
			this.error.handler(err.code)(err);
		});
	}


	private login(options?:AuthConfiguration, credentials?:Credentials):void {
		this.loading = true;
		this.authService.login(options, credentials).catch((err:any) => {
			if (err.code === 'TRANSPORT_UNAVAILABLE') {
				options.method = AuthMethods.Redirect;
				return this.authService.login(options, credentials);
			} else {
				return Promise.reject(err);
			}
		}).then(() => {
			this.loading = false;
			return this._dismiss();
		}).catch((err:any) => {
			this.loading = false;
			this.error.handler(err.code)(err);
		});
	}

	// Call me only after a successful authentication.
	private _dismiss():Promise<void> {
		return this.viewCtrl.dismiss();
	}

}
