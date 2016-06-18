import {Injectable} from "@angular/core";
import {AuthService} from "./AuthService";
import {Toaster} from "./Toaster";


@Injectable()
export class ErrorService {

	// private nav:NavController;

	constructor(/*private app:App, *//*private translate:TranslateService, */private auth:AuthService, private toaster:Toaster) {
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

			if (!friendlyErrorMessageKey) {
				friendlyErrorMessageKey = 'error';
			}
			// Firebase error codes:
			// https://www.firebase.com/docs/java-api/javadoc/com/firebase/client/FirebaseError.html
			// https://www.firebase.com/docs/web/guide/user-auth.html
			this.toaster.toast(friendlyErrorMessageKey);
			// this.translate.get(friendlyErrorMessageKey).subscribe((message:string) => {
			// 	this.toaster.toast(message);
			// });
		}
	}

	// private toast(message:string):void {
	// 	let nav:NavController = this.app.getActiveNav();
	// 	let toast:Toast = Toast.create({
	// 		message: message,
	// 		duration: message.length * 100 + 2000
	// 	});
	// 	nav.present(toast);
	// }

}
