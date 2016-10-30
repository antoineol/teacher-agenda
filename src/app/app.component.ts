import {Component, ViewChild} from '@angular/core';
import {Platform, Nav, Config} from 'ionic-angular';
import {StatusBar, Splashscreen} from 'ionic-native';

import {AgendaPage} from "./agenda/pages/agenda/agenda";
import {TranslateService} from "ng2-translate";
import {ErrorService} from "./core/framework/error.service";
import {AuthService} from "./core/framework/auth.service";
import {Conf} from "./shared/config/Config";
import {StudentsPage} from "./agenda/pages/students/students";


interface PageEntry {
	title: string;
	component: any;
}

// TODO rename to TeacherAgendaApp
// TODO move initialization logic to core module
@Component({
	templateUrl: 'app.component.html'
})
export class MyApp {
	@ViewChild(Nav) nav: Nav;

	rootPage: any = AgendaPage;
	pages: PageEntry[] = [];

	constructor(/*private app:App, */private platform: Platform, private translate: TranslateService, private error: ErrorService, ionicConfig: Config, private authService: AuthService) {
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
		} catch (err) {
			this.error.handler("error")(err);
		}

	}

	initializeApp() {
		this.initializeTranslateServiceConfig();
		this.platform.ready().then(() => {
			// Okay, so the platform is ready and our plugins are available.
			// Here you can do any higher level native things you might need.
			StatusBar.styleDefault();
			Splashscreen.hide();
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

	openPage(page: PageEntry) {
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
