import {Toast, ToastController} from "ionic-angular/index";
import {TranslateService} from "ng2-translate/ng2-translate";
import {Injectable} from "@angular/core";

@Injectable()
export class Toaster {

	constructor(/*private app:App, */private toastCtrl: ToastController, private translate:TranslateService) {
	}

	toast(friendlyErrorMessageKey:string):void {
		this.translate.get(friendlyErrorMessageKey).subscribe((message:string) => {
			// let nav:NavController = this.app.getActiveNav();
			let toast:Toast = this.toastCtrl.create({
				message: message,
				duration: message.length * 100 + 2000
			});
			toast.present();
		});
	}
}
