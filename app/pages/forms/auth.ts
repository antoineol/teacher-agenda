import {Component} from "@angular/core";
import {NavController, Modal, ViewController} from "ionic-angular";
import {ErrorService} from "../../framework/ErrorService";
import {AuthService} from "../../framework/AuthService";
import {AuthConfiguration} from "angularfire2/es6/providers/auth_backend";
import {Toaster} from "../../framework/Toaster";
// import moment = require("moment");


@Component({
	templateUrl: 'build/pages/forms/auth.html'
})
export class AuthFormPage {

	loading:boolean;
	private signUpMode:string = '';

	static _show(nav:NavController):void {
		let loginPage = Modal.create(AuthFormPage);
		// Workaround: https://github.com/driftyco/ionic/issues/6933#issuecomment-226508870
		//(<any>loginPage).fireOtherLifecycles = false;
		nav.present(loginPage);
		console.log("AuthFormPage present");
	}

	constructor(private authService:AuthService, private viewCtrl:ViewController,
				private error:ErrorService, private toaster:Toaster) {
	}

	private loginWithGithub():void {
		this.login(AuthService.METHOD_GITHUB);
	}

	private loginWithEmail(credentials:FirebaseCredentials):void {
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

	private signUp(credentials:FirebaseCredentials):void {
		this.loading = true;
		this.authService.signup(credentials).then(() => {
			this.loading = false;
			this.toaster.toast('auth.checkEmailSent');
			this.signUpMode = '';
		}, (err:any) => {
			this.loading = false;
			this.error.handler(err.code)(err);
		});
	}

	private resetPassword(credentials:FirebaseResetPasswordCredentials):void {
		this.loading = true;
		this.authService.resetPasswordFirebase(credentials).then(() => {
			this.loading = false;
			this.toaster.toast('auth.checkEmailSent');
			this.signUpMode = '';
		}, (err:any) => {
			this.loading = false;
			this.error.handler(err.code)(err);
		});
	}


	private login(options?:AuthConfiguration, credentials?:FirebaseCredentials):void {
		this.loading = true;
		this.authService.login(options, credentials).then(() => {
			this.loading = false;
			this._dismiss();
		}, (err:any) => {
			this.loading = false;
			this.error.handler(err.code)(err);
		});
	}

	// Call me only after a successful authentication.
	private _dismiss():void {
		this.viewCtrl.dismiss();
	}

}
