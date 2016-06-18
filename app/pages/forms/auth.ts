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

	authenticating:boolean;
	private signUpMode = false;

	static _show(nav:NavController):void {
		let loginPage = Modal.create(AuthFormPage);
		nav.present(loginPage);
	}

	constructor(private authService:AuthService, private viewCtrl:ViewController,
				private error:ErrorService, private toaster:Toaster) {
	}

	private loginWithGithub():void {
		this.login(AuthService.METHOD_GITHUB);
	}

	private loginWithEmail(credentials:FirebaseCredentials):void {
		if (this.signUpMode) {
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
		this.authenticating = true;
		this.authService.signup(credentials).then(() => {
			this.authenticating = false;
			this.toaster.toast('auth.checkEmailSent');
		}, (err:any) => {
			this.authenticating = false;
			this.error.handler(err.code)(err);
		});
	}

	private login(options?:AuthConfiguration, credentials?:FirebaseCredentials):void {
		this.authenticating = true;
		this.authService.login(options, credentials).then(() => {
			this.authenticating = false;
			this._dismiss();
		}, (err:any) => {
			this.authenticating = false;
			this.error.handler(err.code)(err);
		});
	}

	// Call me only after a successful authentication.
	private _dismiss():void {
		this.viewCtrl.dismiss();
	}

}
