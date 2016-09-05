import {Component} from "@angular/core";
import {ViewController, NavParams} from "ionic-angular/index";
import {AuthService} from "../../framework/AuthService";
import {ErrorService} from "../../framework/ErrorService";
import {ControlGroup, FormBuilder, Validators} from "@angular/common";
import {Toaster} from "../../framework/Toaster";
import {matchingPasswords} from "../../framework/validators/matchingPasswordsValidator";

@Component({
	templateUrl: 'build/pages/forms/change-password.html'
})
export class ChangePasswordPage {

	static opts = {enableBackdropDismiss: false};

	private email:string/*password:FirebaseAuthDataPassword*/;
	private loading:boolean;
	private changePasswordForm:ControlGroup;


	// static _show(nav:NavController, email:string/*password:FirebaseAuthDataPassword*/):void {
	// 	let modal = Modal.create(ChangePasswordPage, {email: email}/*{password: password}*/, {enableBackdropDismiss: false});
	// 	nav.present(modal);
	// }

	// Custom validator:
	// https://auth0.com/blog/2016/05/03/angular2-series-forms-and-custom-validation/
	// http://stackoverflow.com/questions/31788681/angular2-validator-which-relies-on-multiple-form-fields
	// http://stackoverflow.com/questions/35474991/angular-2-form-validating-for-repeat-password
	constructor(private authService:AuthService, private error:ErrorService, private viewCtrl:ViewController, fb:FormBuilder, params:NavParams, private toaster:Toaster) {
		// this.password = params.get('password');
		this.email = params.get('email');
		this.changePasswordForm= fb.group({
			oldPassword: ['', Validators.required],
			newPassword: ['', Validators.required],
			confirmPassword: ['', Validators.required],
		}, {validator: matchingPasswords('newPassword', 'confirmPassword')});
	}


	private changePassword(formInfo:{newPassword:string}/*credentials:any*/ /*FirebaseChangePasswordCredentials*/):void {
		this.loading = true;
		// credentials.email = this.password.email;

		// console.log("credentials:", credentials);
		// console.error("Form validated! It should have checked first if the confirm password is okay");
		// this.loading = false;
		// return;

		this.authService.changePassword(formInfo.newPassword).then(() => {
			this.loading = false;
			this._dismiss();
		}, (err:any) => {
			this.loading = false;
			this.error.handler(err.code)(err);
		});
	}

	private resendPassword():void {
		this.loading = true;
		this.authService.resetPasswordFirebase(this.email/*{email: this.password.email}*/).then(() => {
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
