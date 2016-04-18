import 'es6-shim';
import {App, IonicApp, Platform} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {AgendaPage} from './pages/agenda/agenda';
import {ListPage} from './pages/list/list';
import {injectables} from "./injectables";
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/forkJoin'


interface PageEntry {
	title:string;
	component:any;
}

@App({
	templateUrl: 'build/app.html',
	config: {}, // http://ionicframework.com/docs/v2/api/config/Config/
	providers: injectables
})
class MyApp {
	rootPage:any = AgendaPage;
	pages:PageEntry[];

	constructor(private app:IonicApp, private platform:Platform) {
		try {
			this.initializeApp();

			// used for an example of ngFor and navigation
			this.pages = [
				{title: 'Getting Started', component: AgendaPage},
				{title: 'List', component: ListPage}
			];
		} catch (err) {console.error(err.stack || err);}

	}

	initializeApp() {
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
}
