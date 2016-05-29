/// <reference path="../typings_manual/my.d.ts" />
// import 'es6-shim';

import {Conf} from "./config/Config";
// Load the locale for momentjs - early init to ensure all components use the right local
import moment = require("moment");
import 'moment/locale/fr';
import 'moment/locale/zh-cn';
moment.locale(Conf.langMoment);

// Starts by adding operators and methods to observables
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/toPromise';
// import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/combineLatest';
import "rxjs/add/observable/of";
import "rxjs/add/observable/from";
import "rxjs/add/observable/merge";

import {ViewChild} from '@angular/core';
import {App, IonicApp, Platform, Nav} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {AgendaPage} from './pages/agenda/agenda';
import {injectables, pipes} from "./injectables";
import {TranslateService} from "ng2-translate/ng2-translate";
import {ErrorService} from "./framework/ErrorService";


interface PageEntry {
	title:string;
	component:any;
}

@App({
	templateUrl: 'build/app.html',
	config: {}, // http://ionicframework.com/docs/v2/api/config/Config/
	providers: injectables,
	pipes: pipes
})
class MyApp {
	@ViewChild(Nav) nav: Nav;

	rootPage:any = AgendaPage;
	pages:PageEntry[] = [];

	constructor(/*private app:IonicApp, */private platform:Platform, private translate: TranslateService, private error:ErrorService) {
		try {
			this.initializeApp();

			// used for an example of ngFor and navigation

			this.translate.getTranslation(Conf.lang).subscribe(() => {
				this.pages = [
					{title: this.translate.instant('agenda.title'), component: AgendaPage}
				];
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

	openPage(page:PageEntry) {
		// Reset the content nav to have just this page
		// we wouldn't want the back button to show in this scenario
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
}
