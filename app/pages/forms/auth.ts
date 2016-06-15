import {Component} from "@angular/core";
import {NavParams, NavController, Modal, ViewController} from "ionic-angular";
import {Lesson, Freq, FreqChoice} from "../../model/Lesson";
import {Utils} from "../../business/Utils";
import {AgendaDao} from "../../business/AgendaDao";
import {Student} from "../../model/Student";
import {ErrorService} from "../../framework/ErrorService";
import {LessonFormService} from "../../business/LessonFormService";
import {MiscService} from "../../business/MiscService";
import {AgendaService} from "../../business/AgendaService";
import {AuthService} from "../../framework/AuthService";
import {FirebaseAuth} from "angularfire2/angularfire2";
// import moment = require("moment");


@Component({
	templateUrl: 'build/pages/forms/auth.html'
})
export class AuthFormPage {

	static show(nav:NavController):void {
		let loginPage = Modal.create(AuthFormPage);
		console.log("Show modal");
		nav.present(loginPage);
	}

	constructor(/*private nav:NavController, */private authService:AuthService, private viewCtrl:ViewController,
				private auth: FirebaseAuth, private error:ErrorService) {
	}

	private loginWithGithub():void {
		console.log("Log in with github");
		this.auth.login().then((result:any) => {
			console.log("result of auth with github:", result);
			this.authService._completeAuth();
			this.dismiss();
		}, this.error.handler);
	}

	private dismiss() {
		console.log("Dismiss modal");
		this.viewCtrl.dismiss();
	}

}
