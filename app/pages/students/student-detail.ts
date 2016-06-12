import {Component} from "@angular/core";
import {NavParams, NavController, Alert} from "ionic-angular/index";
import {Student} from "../../model/Student";
import {StudentFormPage} from "../forms/student";
import {Observable} from "rxjs/Rx";
import {Conf} from "../../config/Config";
import {TranslateService} from "ng2-translate/ng2-translate";
import {StudentDao} from "../../business/StudentDao";
import {ErrorService} from "../../framework/ErrorService";

@Component({
	templateUrl: 'build/pages/students/student-detail.html'
})
export class StudentDetailPage {
	
	private student:Student;
	private removePopup:Observable<Alert>;
	
	constructor(navParams:NavParams, private nav:NavController, translate:TranslateService, studentDao:StudentDao, private error:ErrorService) {
		let errKey = "global.error.init";
		try {
			this.student = navParams.get('student');

			this.removePopup = translate.getTranslation(Conf.lang).map(() => {
				let confirm = Alert.create({
					title: translate.instant('student.deleteConfirm.title'),
					message: translate.instant('student.deleteConfirm.message'),
					buttons: [
						{text: translate.instant('alert.cancel')},
						{
							text: translate.instant('alert.confirm'),
							handler: () => {
								studentDao.removeStudent(this.student).then(() => {
									confirm.dismiss().then(() => {
										this.nav.pop();
									});
								}, error.handler("student.error.remove"));
							}
						}
					]
				});
				return confirm;
			}).share();
		} catch(err) {
			this.error.handler(errKey)(err);
		}
	}

	edit() {
		this.nav.push(StudentFormPage, {student: this.student});
	}

	remove() {
		this.removePopup.first().subscribe((confirm:Alert) => {
			this.nav.present(confirm);
		});
	}

}
