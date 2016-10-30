import {Component, OnInit} from "@angular/core";
import {ViewController, NavParams} from "ionic-angular/index";
import {AuthService} from "../../../core/framework/auth.service";
import {ErrorService} from "../../../core/framework/error.service";
import {FormBuilder, Validators, FormGroup} from "@angular/forms";
import {Toaster} from "../../../core/framework/toaster.service";
import {matchingPasswords} from "../../../shared/matching-passwords.validator";
// import {ControlGroup, FormBuilder, Validators} from "@angular/common";

@Component({
	templateUrl: 'change-password.html'
})
export class ChangePasswordPage implements OnInit {

	static opts = {enableBackdropDismiss: false};

	private email: string/*password:FirebaseAuthDataPassword*/;
	private loading: boolean;
	private changePasswordForm: FormGroup;


	// Custom validator:
	// https://auth0.com/blog/2016/05/03/angular2-series-forms-and-custom-validation/
	// http://stackoverflow.com/questions/31788681/angular2-validator-which-relies-on-multiple-form-fields
	// http://stackoverflow.com/questions/35474991/angular-2-form-validating-for-repeat-password
	constructor(private authService: AuthService, private error: ErrorService, private viewCtrl: ViewController, private fb: FormBuilder, private params: NavParams, private toaster: Toaster) {
	}

	ngOnInit(): void {
		// this.password = params.get('password');
		this.email = this.params.get('email');
		this.changePasswordForm = this.fb.group({
			oldPassword: [null, Validators.required],
			newPassword: [null, [
				Validators.required, Validators.minLength(4)]],
			confirmPassword: [null, [
				Validators.required, Validators.minLength(4)]],
			// TODO udpate implementation of custom validator
		}, {validator: matchingPasswords('newPassword', 'confirmPassword')});

		// If we have custom validation messages, cf. https://angular.io/docs/ts/latest/cookbook/form-validation.html#!#component-class
		// this.changePasswordForm.valueChanges.subscribe(data => this.onValuechanged(data));
		// this.onValueChanged(); // (re)set validation messages now
	}


	changePassword(/*credentials:any*/ /*FirebaseChangePasswordCredentials*/): void {
		this.loading = true;
		const formInfo: {newPassword: string} = this.changePasswordForm.value;
		// credentials.email = this.password.email;

		// console.log("credentials:", credentials);
		// console.error("Form validated! It should have checked first if the confirm password is okay");
		// this.loading = false;
		// return;

		this.authService.changePassword(formInfo.newPassword).then(() => {
			this.loading = false;
			this._dismiss();
		}, (err: any) => {
			this.loading = false;
			this.error.handler(err.code)(err);
		});
	}

	resendPassword(): void {
		this.loading = true;
		this.authService.resetPasswordFirebase(this.email/*{email: this.password.email}*/).then(() => {
			this.loading = false;
			this.toaster.toast('auth.checkEmailSent');
		}, (err: any) => {
			this.loading = false;
			this.error.handler(err.code)(err);
		});
	}

	// Call me only after a successful password change.
	private _dismiss(): void {
		this.viewCtrl.dismiss();
	}

}
