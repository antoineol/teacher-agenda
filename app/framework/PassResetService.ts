// import {Injectable} from "@angular/core";
// import {FirebaseAuth, FirebaseAuthState} from "angularfire2/angularfire2";
// import {NavController} from "ionic-angular/index";
// import {Observable} from "rxjs/Observable";
// import {AgendaDao} from "../business/AgendaDao";
// import {Parameters} from "../model/Parameters";
// import {ChangePasswordPage} from "../pages/forms/change-password";
//
// @Injectable()
// export class PassResetService {
//
// 	constructor(private auth: FirebaseAuth, private agendaDao:AgendaDao) {
// 	}
//
// 	private subscribed:boolean;
// 	_checkPasswordReset(nav:NavController):void {
// 		//isTemporaryPassword
// 		console.log("_checkPasswordReset 1");
// 		if (!this.subscribed) {
// 			console.log("_checkPasswordReset 2");
// 			this.subscribed = true;
// 			Observable.combineLatest([
// 				this.auth,
// 				this.agendaDao.findParameters()
// 			]).subscribe((results:any[]) => {
// 				let authInfo:FirebaseAuthState = results[0];
// 				let parameters:Parameters = results[1];
// 				console.log("_checkPasswordReset 3", authInfo, parameters);
//
// 				if (authInfo.password && !parameters.passwordSet) {
// 					console.log("_checkPasswordReset 4");
// 					this.showChangePasswordModal(nav);
// 					// TODO pop change password modal
// 					// _dismiss only once the password is successfully updated
// 				}
// 			});
// 		}
// 	}
//
// 	private modalShown:boolean;
// 	showChangePasswordModal(nav:NavController) {
// 		if (this.modalShown) {
// 			return;
// 		}
// 		this.modalShown = true;
// 		ChangePasswordPage._show(nav);
// 	}
// }
