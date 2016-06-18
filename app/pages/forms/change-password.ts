import {Component} from "@angular/core";
import {NavController, Modal, ViewController} from "ionic-angular/index";
import {AuthService} from "../../framework/AuthService";
import {ErrorService} from "../../framework/ErrorService";
import {ControlGroup, FormBuilder, Validators} from "@angular/common";

@Component({
	templateUrl: 'build/pages/forms/change-password.html'
})
export class ChangePasswordPage {

	loading:boolean;
	changePasswordForm:ControlGroup;

	static _show(nav:NavController):void {
		let modal = Modal.create(ChangePasswordPage);
		nav.present(modal);
	}

	// Custom validator:
	// https://auth0.com/blog/2016/05/03/angular2-series-forms-and-custom-validation/
	// http://stackoverflow.com/questions/31788681/angular2-validator-which-relies-on-multiple-form-fields
	// http://stackoverflow.com/questions/35474991/angular-2-form-validating-for-repeat-password
	constructor(private authService:AuthService, private error:ErrorService, private viewCtrl:ViewController, fb:FormBuilder) {
		// TODO continue here: trying to add a custom validator for password confirmation
		this.changePasswordForm= fb.group({
			oldPassword: ['', Validators.required],
			newPassword: ['', Validators.required],
			confirmPassword: ['', Validators.required],
		}, {validator: matchingPasswords('newPassword', 'confirmPassword')})
	}

	private changePassword(credentials:FirebaseChangePasswordCredentials):void {
		this.loading = true;
		this.authService.changePassword(credentials).then(() => {
			this.loading = false;
			this._dismiss();
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

//CONTROL GROUP VALIDATORS
export function matchingPasswords(passwordKey: string, confirmPasswordKey: string) {
	return (group: ControlGroup): {[key: string]: any} => {
		let password = group.controls[passwordKey];
		let confirmPassword = group.controls[confirmPasswordKey];

		if (password.value !== confirmPassword.value) {
			return {
				differentPasswords: true
			};
		}
	}
}

