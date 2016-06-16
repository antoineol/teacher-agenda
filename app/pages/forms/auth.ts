import {Component} from "@angular/core";
import {NavController, Modal, ViewController} from "ionic-angular";
import {ErrorService} from "../../framework/ErrorService";
import {AuthService} from "../../framework/AuthService";
import {FirebaseAuth, AuthProviders, AuthMethods, FirebaseAuthState} from "angularfire2/angularfire2";
import {AuthConfiguration} from "angularfire2/es6/providers/auth_backend";
// import moment = require("moment");


@Component({
	templateUrl: 'build/pages/forms/auth.html'
})
export class AuthFormPage {

	authenticating:boolean;

	static show(nav:NavController):void {
		let loginPage = Modal.create(AuthFormPage);
		// console.log("Show modal");
		nav.present(loginPage);
	}

	constructor(/*private nav:NavController, */private authService:AuthService, private viewCtrl:ViewController,
				private auth: FirebaseAuth, private error:ErrorService) {
	}

	private loginWithGithub():void {
		this.login({
			provider: AuthProviders.Github,
			method: AuthMethods.Popup,
			// method: AuthMethods.Redirect,
		});
	}

	private login(options?:AuthConfiguration) {
		// console.log("Log in with github");
		this.authenticating = true;
		this.auth.login(options).then((user:FirebaseAuthState) => {
			// console.log("result of auth with github:", result);
			this.authenticating = false;
			this.authService._completeAuth(user);
			this.dismiss();
		}, (err:any) => {
			this.authenticating = false;
			this.error.handler(err);
		});
	}

	private dismiss() {
		// console.log("Dismiss modal");
		this.viewCtrl.dismiss();
	}

}
