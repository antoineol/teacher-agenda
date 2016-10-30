import {NgModule, SkipSelf, Optional} from "@angular/core";
import {Conf} from "../shared/config/Config";
import {MiscService} from "./business/misc.service";
import {AuthService} from "./framework/auth.service";
import {ErrorDao} from "./framework/error.dao";
import {ErrorService} from "./framework/error.service";
import {Toaster} from "./framework/toaster.service";
import {FirebaseStorageDao} from "./framework/dao/firebase-storage.dao";
import {StorageDao} from "./framework/dao/storage.dao";
import {StubStorageDao} from "./framework/dao/stub-storage.dao";
import {AngularFireModule} from "angularfire2";
import "./init";

export const firebaseConfig = {
	apiKey: "AIzaSyA0gBTBwU7x2m6dQVOormHdf8UnifI7Tu4",
	authDomain: "crackling-heat-2871.firebaseapp.com",
	databaseURL: "https://crackling-heat-2871.firebaseio.com", // "https://teacher-agenda-812ca.firebaseio.com"
	storageBucket: "crackling-heat-2871.appspot.com",
};


/**
 * It holds the app bootstrap logic and app-wide singleton services.
 * import once when the app starts and never import anywhere else.
 * @see https://angular.io/docs/ts/latest/guide/ngmodule.html#!#the-core-module
 */
@NgModule({
	declarations: [], // directives, components, and pipes owned by this NgModule
	imports: [
		AngularFireModule.initializeApp(firebaseConfig
			// If there is only one authentication method, or for the default one:
			// , {
			// 	provider: AuthProviders.Password,
			// 	method: AuthMethods.Password
			// }
		),
	],
	exports: [
	],
	providers: [
		// library services
		// TODO test and replace by a better auth config
		// firebaseAuthConfig({
		// 	provider: AuthProviders.Password,
		// 	method: AuthMethods.Password
		// 	// scope: ['email']
        //
		// 	// If authenticated with same email, for different providers, they may be linked:
		// 	// https://firebase.google.com/docs/auth/web/github-auth#popup-mode
		// }),
		// TranslateService,

		// App services
		MiscService,
		AuthService,
		ErrorDao,
		ErrorService,
		Toaster,
		{ provide: StorageDao, useClass: Conf.stub ? StubStorageDao : FirebaseStorageDao },
	]
})
export class CoreModule {

	constructor (@Optional() @SkipSelf() parentModule: CoreModule) {
		if (parentModule) {
			throw new Error(
				'CoreModule is already loaded. Import it in the AppModule only');
		}
	}

}
