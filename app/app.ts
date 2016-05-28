/// <reference path="../typings_manual/my.d.ts" />
// import 'es6-shim';

import {Conf} from "./config/Config";
// Load the locale for momentjs - early init to ensure all components use the right local
import moment = require("moment");
import 'moment/locale/fr';
import 'moment/locale/zh-cn';
moment.locale(Conf.langMoment);

import {App, IonicApp, Platform} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {AgendaPage} from './pages/agenda/agenda';
import {injectables, pipes} from "./injectables";
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/forkJoin';
import "rxjs/add/observable/of";
import {TranslateService} from "ng2-translate/ng2-translate";


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
	rootPage:any = AgendaPage;
	pages:PageEntry[];

	constructor(private app:IonicApp, private platform:Platform, private translate: TranslateService) {
		try {
			this.initializeApp();

			// used for an example of ngFor and navigation
			this.pages = [
				{title: 'Agenda', component: AgendaPage}
			];
		} catch (err) {console.error(err.stack || err);}

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
		let nav = this.app.getComponent('nav');
		nav.setRoot(page.component);
	}

	initializeTranslateServiceConfig() {
		this.translate.setDefaultLang(Conf.defaultLang);
		this.translate.use(Conf.lang);
	}
}
