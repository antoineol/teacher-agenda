
import {Component} from "@angular/core";
import {Popover, ViewController} from "ionic-angular/index";

@Component({
	template: `
    <ion-list>
      <div padding>{{"auth.unverifiedEmail" | translate}}</div>
      <button ion-item (click)="resendVerificationEmail()">{{"auth.resendVerificationEmail" | translate}}</button>
    </ion-list>
  `
})
export class UnverifiedEmailPopover {

	static make():Popover {
		return Popover.create(UnverifiedEmailPopover, {}, {cssClass: 'add-popover'});
	}

	constructor(private viewCtrl:ViewController) {
	}

	resendVerificationEmail() {
		// TODO
		console.log("TODO: Must re-send verification email");
		this.viewCtrl.dismiss();
	}
}
