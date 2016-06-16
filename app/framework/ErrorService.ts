import {Injectable} from "@angular/core";
import {Toast, NavController, App} from "ionic-angular";
import {TranslateService} from "ng2-translate/ng2-translate";
import {AuthService} from "./AuthService";


@Injectable()
export class ErrorService {

	// private nav:NavController;

	constructor(private app:App, private translate:TranslateService, private auth:AuthService) {
		// this.nav = app.getActiveNav();
	}

	/**
	 * Pass this function call as an error handler. e.g. .then(null, errorService.handler("Something was wrong"))
	 * @param friendlyErrorMessageKey
	 * @returns {function(any)}
     */
	handler(friendlyErrorMessageKey:string):(error:any)=>void {
		return (error:any):void => {
			if (error && error.code === 'PERMISSION_DENIED') {
				// If authentication issue with firebase: error.code === 'PERMISSION_DENIED'
				// this.translate.get('auth.accessDenied').subscribe((message:string) => {
				// 	this.toast(message);
				// });
				this.auth.ensureAuth();
				return;
			}

			// Can send the error to a tool like Crittercism here
			if (error && typeof error === 'object') {
				console.error(error.stack || error);
			} else {
				console.error(error);
			}

			this.translate.get(friendlyErrorMessageKey).subscribe((message:string) => {
				this.toast(message);
			});
		}
	}

	private toast(message:string):void {
		let nav:NavController = this.app.getActiveNav();
		let toast:Toast = Toast.create({
			message: message,
			duration: message.length * 100 + 2000
		});
		nav.present(toast);
	}
	// private reauth():void {
	// 	let nav:NavController = this.app.getActiveNav();
	// 	this.auth.authenticate(nav);
	// }

}
