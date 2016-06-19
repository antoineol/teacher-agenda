import {Component} from "@angular/core";
import {NavController, Modal, ViewController, NavParams} from "ionic-angular/index";
import {AuthService} from "../../framework/AuthService";
import {ErrorService} from "../../framework/ErrorService";
import {ControlGroup, FormBuilder, Validators, AbstractControl} from "@angular/common";
import {Toaster} from "../../framework/Toaster";

@Component({
	templateUrl: 'build/pages/forms/change-password.html'
})
export class ChangePasswordPage {

	password:FirebaseAuthDataPassword;
	loading:boolean;
	changePasswordForm:ControlGroup;


	static _show(nav:NavController, password:FirebaseAuthDataPassword):void {
		let modal = Modal.create(ChangePasswordPage, {password: password});
		nav.present(modal);
	}

	// Custom validator:
	// https://auth0.com/blog/2016/05/03/angular2-series-forms-and-custom-validation/
	// http://stackoverflow.com/questions/31788681/angular2-validator-which-relies-on-multiple-form-fields
	// http://stackoverflow.com/questions/35474991/angular-2-form-validating-for-repeat-password
	constructor(private authService:AuthService, private error:ErrorService, private viewCtrl:ViewController, fb:FormBuilder, params:NavParams, private toaster:Toaster) {
		this.password = params.get('password');
		this.changePasswordForm= fb.group({
			oldPassword: ['', Validators.required],
			newPassword: ['', Validators.required],
			confirmPassword: ['', Validators.required],
		}, {validator: matchingPasswords('newPassword', 'confirmPassword')});
	}


	private changePassword(credentials:FirebaseChangePasswordCredentials):void {
		this.loading = true;
		credentials.email = this.password.email;

		// console.log("credentials:", credentials);
		// console.error("Form validated! It should have checked first if the confirm password is okay");
		// this.loading = false;
		// return;

		this.authService.changePassword(credentials).then(() => {
			this.loading = false;
			this._dismiss();
		}, (err:any) => {
			this.loading = false;
			this.error.handler(err.code)(err);
		});
	}

	private resendPassword():void {
		this.loading = true;
		this.authService.resetPasswordFirebase({email: this.password.email}).then(() => {
			this.loading = false;
			this.toaster.toast('auth.checkEmailSent');
		}, (err:any) => {
			this.loading = false;
			this.error.handler(err.code)(err);
		});
	}

	// Call me only after a successful password change.
	private _dismiss():void {
		this.viewCtrl.dismiss();
	}

}


// Custom validator
export function matchingPasswords(passwordKey: string, confirmPasswordKey: string) {
	return (group: ControlGroup): {[key: string]: any} => {
		let password = group.controls[passwordKey];
		let confirmPassword = group.controls[confirmPasswordKey];
		// console.log("Matching password:", password, confirmPassword);

		if (password.value !== confirmPassword.value) {
			return {
				differentPasswords: true
			};
		}
	}
}

