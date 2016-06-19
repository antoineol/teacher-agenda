import {provide, PLATFORM_PIPES} from "@angular/core";
import {Http} from "@angular/http";
import {TranslateService, TranslateLoader, TranslateStaticLoader, TranslatePipe} from "ng2-translate/ng2-translate";
import {
	FIREBASE_PROVIDERS, defaultFirebase, firebaseAuthConfig, AuthProviders,
	AuthMethods
} from "angularfire2";
import {AgendaService} from "./business/AgendaService";
import {/*Cache, */StorageDao} from "./framework/dao/StorageDao";
import {AgendaDao} from "./business/AgendaDao";
import {ErrorService} from "./framework/ErrorService";
import {LessonFormService} from "./business/LessonFormService";
import {MiscService} from "./business/MiscService";
import {FirebaseStorageDao} from "./framework/dao/FirebaseStorageDao";
import {StubStorageDao} from "./framework/dao/StubStorageDao";
import {Conf} from "./config/Config";
import {StudentFormService} from "./business/StudentFormService";
import {StudentDao} from "./business/StudentDao";
import {AuthService} from "./framework/AuthService";
import {CurrencyPipe} from "./framework/pipes/CurrencyPipe";
import {Toaster} from "./framework/Toaster";
// import {TranslatePipe} from "ionic-angular/index"; // look at the translation facilities embedded in ionic2

export const pipes:any[] = [
	TranslatePipe,
	CurrencyPipe
];

export const injectables:any[] = [
	// IONIC_DIRECTIVES,

	// Firebase Angular2 adapter
	FIREBASE_PROVIDERS,
	defaultFirebase("https://crackling-heat-2871.firebaseio.com"),
	// defaultFirebase({
	// 	apiKey: "AIzaSyA0gBTBwU7x2m6dQVOormHdf8UnifI7Tu4",
	// 	authDomain: "crackling-heat-2871.firebaseapp.com",
	// 	databaseURL: "https://crackling-heat-2871.firebaseio.com", // "https://teacher-agenda-812ca.firebaseio.com"
	// 	storageBucket: "crackling-heat-2871.appspot.com",
	// }),
	// TODO test and replace by a better auth config
	firebaseAuthConfig({
		provider: AuthProviders.Password,
		method: AuthMethods.Password
		// scope: ['email']

		// If authenticated with same email, for different providers, they may be linked:
		// https://firebase.google.com/docs/auth/web/github-auth#popup-mode
	}),

	provide(TranslateLoader, {
		useFactory: (http: Http) => new TranslateStaticLoader(http, 'assets/i18n', '.json'),
		deps: [Http]
	}),
	// If the default behavior (fallback to default language, then to the key) is not good enough:
	// provide(MissingTranslationHandler, { useClass: MyMissingTranslationHandler }),
	TranslateService,

	// Global pipes
	// http://stackoverflow.com/questions/35044068/is-it-possible-to-override-the-built-in-angular-2-pipes-so-they-can-be-used-glob
	// For directives: https://forum.ionicframework.com/t/how-to-make-custom-pipes-application-wide/42843/10
	provide(PLATFORM_PIPES, {useValue: pipes, multi: true}),

	AgendaDao,
	// Cache,
	// StorageDao,
	// FirebaseStorageDao,
	// StubStorageDao,
	provide(StorageDao, {useClass: Conf.stub ? StubStorageDao : FirebaseStorageDao}),
	ErrorService,
	AgendaService,
	LessonFormService,
	MiscService,
	StudentFormService,
	StudentDao,
	AuthService,
	Toaster,
];
