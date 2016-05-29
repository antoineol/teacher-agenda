import {provide, PLATFORM_PIPES} from "@angular/core";
import {Http} from "@angular/http";
import {
	TranslateService,
	TranslateLoader,
	TranslateStaticLoader,
	MissingTranslationHandler,
	TranslatePipe
} from "ng2-translate/ng2-translate";
import {AgendaDao} from "./business/AgendaDao";
import {AgendaService} from "./business/AgendaService";
import {Cache, StorageDao} from "./framework/StorageDao";
import {MyMissingTranslationHandler} from "./framework/MyMissingTranslationHandler";
import {ErrorService} from "./framework/ErrorService";
import {LessonFormService} from "./business/LessonFormService";
// import {TranslatePipe} from "ionic-angular/index"; // look at the translation facilities embedded in ionic2


export const pipes:any[] = [
	TranslatePipe
];

export const injectables:any[] = [
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
	Cache,
	StorageDao,
	ErrorService,
	AgendaService,
	LessonFormService
];
