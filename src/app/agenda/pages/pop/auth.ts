import {Component, OnInit} from "@angular/core";
import {ViewController} from "ionic-angular";
import {EmailPasswordCredentials} from "angularfire2/auth";
import {AuthConfiguration} from "angularfire2/auth/auth_backend";
import {AuthMethods} from "angularfire2/angularfire2";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../../core/framework/auth.service";
import {ErrorService} from "../../../core/framework/error.service";
import {Toaster} from "../../../core/framework/toaster.service";
import {matchingPasswords} from "../../../shared/matching-passwords.validator";
import {Credentials} from "../../../../../typings_manual/global/angularfire";


@Component({
	templateUrl: 'auth.html'
})
export class AuthFormPage implements OnInit {

	static data = {};
	static opts = {enableBackdropDismiss: false};

	loading: boolean;
	private signUpMode: string = '';
	private loginCreds: FormGroup;
	private resetForm: FormGroup;

	// static _show(nav:NavController):void {
	// 	let loginPage = Modal.create(AuthFormPage, {}, {enableBackdropDismiss: false});
	// 	// Workaround: https://github.com/driftyco/ionic/issues/6933#issuecomment-226508870
	// 	//(<any>loginPage).fireOtherLifecycles = false;
	// 	nav.present(loginPage);
	// 	// console.log("AuthFormPage present");
	// }

	constructor(private authService: AuthService, private viewCtrl: ViewController, private fb: FormBuilder,
				private error: ErrorService, private toaster: Toaster) {
	}

	ngOnInit(): void {
		this.loginCreds = this.fb.group({
			email: [null, Validators.required],
			password: [null, Validators.required],
			confirmPassword: [null, Validators.required],
		}, {validator: matchingPasswords('password', 'confirmPassword')});
		this.resetForm = this.fb.group({
			email: [null, Validators.required],
		});
	}

	// Facebook case on Cordova: need an extra plugin
	// https://github.com/angular/angularfire2/blob/master/docs/5-user-authentication.md#cordova-case

	loginWithGithub(): void {
		this.login(AuthService.METHOD_GITHUB);
	}

	loginWithEmail(): void {
		const credentials: EmailPasswordCredentials = this.loginCreds.value;
		if (this.signUpMode === 'signup') {
			// console.log("Sign up with email:", credentials);
			this.signUp(credentials);
		} else {
			// console.log("Login with email:", credentials);
			this.login(AuthService.METHOD_PASSWORD, credentials);
		}
	}

	resetPassword(): void {
		const credentials: {email: string} = this.resetForm.value;
		this.loading = true;
		this.authService.resetPasswordFirebase(credentials.email).then(() => {
			this.loading = false;
			this.toaster.toast('auth.checkEmailSent');
			this.signUpMode = '';
		}, (err: any) => {
			this.loading = false;
			this.error.handler(err.code)(err);
		});
	}

	// private signup():void {
	// 	this.signUp = true;
	// }

	private signUp(credentials: EmailPasswordCredentials): void {
		this.loading = true;
		this.authService.signup(credentials).then(() => {
			this.loading = false;
			this.signUpMode = '';
			// the signup seems to include the sign-in, we can close the popup.
			return this._dismiss();
		}).then(() => {
			this.toaster.toast('auth.checkEmailSent');
		}, (err: any) => {
			this.loading = false;
			this.error.handler(err.code)(err);
		});
	}


	private login(options?: AuthConfiguration, credentials?: Credentials): void {
		this.loading = true;
		this.authService.login(options, credentials).catch((err: any) => {
			if (err.code === 'TRANSPORT_UNAVAILABLE') {
				options.method = AuthMethods.Redirect;
				return this.authService.login(options, credentials);
			} else {
				return Promise.reject(err);
			}
		}).then(() => {
			this.loading = false;
			return this._dismiss();
		}).catch((err: any) => {
			this.loading = false;
			this.error.handler(err.code)(err);
		});
	}

	// Call me only after a successful authentication.
	private _dismiss(): Promise<boolean> {
		return this.viewCtrl.dismiss();
	}

}
