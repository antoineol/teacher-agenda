import {Injectable} from "@angular/core";
import {Toast, NavController, IonicApp} from "ionic-angular";
import {TranslateService} from "ng2-translate/ng2-translate";


@Injectable()
export class ErrorService {

	private nav:NavController;

	constructor(private app: IonicApp, private translate:TranslateService) {
		this.nav = app.getActiveNav();
	}

	/**
	 * Pass this function call as an error handler. e.g. .then(null, errorService.handler("Something was wrong"))
	 * @param friendlyErrorMessageKey
	 * @returns {function(any)}
     */
	handler(friendlyErrorMessageKey:string) {
		return (error:any) => {
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

	private toast(message:string) {
		let toast:Toast = Toast.create({
			message: message,
			duration: message.length * 100
		});
		this.nav.present(toast);
	}

}
