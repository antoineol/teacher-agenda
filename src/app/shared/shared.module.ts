import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {TranslatePipe, TranslateModule, TranslateLoader, TranslateStaticLoader} from "ng2-translate";
import {CurrencyPipe} from "./currency.pipe";
import {Http} from "@angular/http";
import {ReactiveFormsModule} from "@angular/forms";


export function createTranslateLoader(http: Http) {
	return new TranslateStaticLoader(http, './assets/i18n', '.json');
}

/**
 * It holds the common components, directives, and pipes, to share them with the modules that need them.
 * This module is intended to be imported in all feature modules that need it.
 *
 * @see https://angular.io/docs/ts/latest/guide/ngmodule.html#!#shared-module
 */
@NgModule({
	declarations: [					// directives, components, and pipes used inside this module
		TranslatePipe,	// TODO check the ionic/angular version
		CurrencyPipe,	// TODO check the Angular version
	],
	imports: [						// import modules that are used inside this module
		CommonModule,
		ReactiveFormsModule,
		TranslateModule.forRoot({
			provide: TranslateLoader,
			useFactory: (createTranslateLoader),
			deps: [Http]
		}),
	],
	exports: [						// export what is exposed to the rest of the application
		CommonModule,	// To access Angular 2 common directives in templates
		// RouterModule,				// To access routing directives like [routerLink] in templates - can be replaced by the Ionic equivalent
		ReactiveFormsModule,
		TranslatePipe,
		CurrencyPipe,
		TranslateModule,
	],
	// Avoid declaring providers here: they won't be application-wide singleton,
	// typically in the case of lazy loaded modules (they would create a new instance).
	// Prefer declaring the application-wide providers in the core module.
})
export class SharedModule {
}
