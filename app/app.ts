// import 'es6-shim';

import {Conf} from "./config/Config";
// Load the locale for momentjs - early init to ensure all components use the right local
import moment = require("moment");
import 'moment/locale/fr';
import 'moment/locale/zh-cn';
// moment.locale(Conf.langMoment);

// Starts by adding operators and methods to observables
// import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/filter';
import 'rxjs/add/observable/combineLatest';
import "rxjs/add/observable/of";
import "rxjs/add/observable/from";
import "rxjs/add/observable/fromPromise";
import "rxjs/add/observable/merge";

import {Component, ViewChild} from '@angular/core';
import {ionicBootstrap, Platform, Nav, Config} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {AgendaPage} from './pages/agenda/agenda';
import {injectables} from "./injectables";
import {TranslateService} from "ng2-translate/ng2-translate";
import {ErrorService} from "./framework/ErrorService";
import {StudentsPage} from "./pages/students/students";
import {AuthService} from "./framework/AuthService";

moment.locale(Conf.langMoment);

// TODO display loader while caching. See event listeners:
// https://jonathanstark.com/blog/debugging-html-5-offline-application-cache?filename=2009/09/27/debugging-html-5-offline-application-cache/

// TODO offline mode https://www.firebase.com/docs/android/guide/offline-capabilities.html
// https://www.firebase.com/docs/web/guide/offline-capabilities.html
// https://angularfire2.com/api/ to get Firebase obj: @Inject(FirebaseRef) ref:Firebase

// HTML5 offline: Service Worker
// https://developer.mozilla.org/fr/docs/Web/API/Service_Worker_API/Using_Service_Workers
// Deprecated but usable: AppCache (with manifest)

// Guides for progressive web apps (mobile):
// https://github.com/angular/mobile-toolkit
// implemented by https://github.com/mgechev/angular2-seed

interface PageEntry {
	title:string;
	component:any;
}

@Component({
	templateUrl: 'build/app.html',
	// config: {}, // http://ionicframework.com/docs/v2/api/config/Config/
	// providers: injectables,
	// pipes: pipes
})
class MyApp {
	@ViewChild(Nav) nav:Nav;

	rootPage:any = AgendaPage;
	pages:PageEntry[] = [];

	constructor(/*private app:App, */private platform:Platform, private translate: TranslateService, private error:ErrorService, ionicConfig:Config, private authService:AuthService) {
		try {
			this.initializeApp();

			// used for an example of ngFor and navigation

			this.translate.getTranslation(Conf.lang).subscribe(() => {
				this.pages = [
					{title: this.translate.instant('agenda.title'), component: AgendaPage},
					{title: this.translate.instant('student.title'), component: StudentsPage}
				];

				// Back button text: provide translations (only English by default with ionic)
				if (ionicConfig.get('backButtonText')) {
					ionicConfig.set('backButtonText', this.translate.instant('global.backButton'));
				}
			}, this.error.handler("error"));
		} catch (err) {this.error.handler("error")(err);}

	}

	initializeApp() {
		this.initializeTranslateServiceConfig();
		this.platform.ready().then(() => {
			// Okay, so the platform is ready and our plugins are available.
			// Here you can do any higher level native things you might need.
			StatusBar.styleDefault();
		});
	}

	// private loaded:boolean;
	// onPageDidEnter() {
	// 	if (!this.loaded) {
	// 		this.loaded = true;
	// 		this.authService._showAuthEmitter().subscribe((_show:boolean) => {
	// 			console.log("Emit _show auth:", _show);
	// 			if (_show) {
	// 				AuthFormPage._show(this.nav);
	// 			}
	// 		});
	// 	}
	// 	// setTimeout(() => {
	// 	// }, 500);
	// }

	// ngAfterViewInit() {
	// 	// this.authService.init(/*this.nav*/);
	// 	setTimeout(() => {
	// 		this.authService._showAuthEmitter().subscribe(() => {
	// 			AuthFormPage._show(this.nav);
	// 		});
	// 	}, 500);
	// }

	openPage(page:PageEntry) {
		// Reset the content nav to have just this page
		// we wouldn't want the back button to _show in this scenario
		this.nav.setRoot(page.component);
	}

	initializeTranslateServiceConfig() {
		this.translate.setDefaultLang(Conf.defaultLang);
		this.translate.use(Conf.lang);

		// Workaround because default translations are missing, which causes an issue when
		// a translation is missing in the current language, and it tries to fallback to the default language.
		// https://github.com/ocombe/ng2-translate/issues/46
		this.translate.getTranslation(Conf.defaultLang).subscribe();
	}

	logout() {
		this.authService.logout();
	}
}

ionicBootstrap(MyApp, injectables, {
	// http://ionicframework.com/docs/v2/api/config/Config/
});
