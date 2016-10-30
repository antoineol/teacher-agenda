import {NgModule} from "@angular/core";
import {IonicApp, IonicModule} from "ionic-angular";
import {MyApp} from "./app.component";
import {CoreModule} from "./core/core.module";
import {AgendaModule} from "./agenda/agenda.module";
import {AgendaPage} from "./agenda/pages/agenda/agenda";
import {AgendaDetailPage} from "./agenda/pages/agenda/agenda-detail";
import {AgendaList} from "./agenda/pages/agenda/agenda-list";
import {ChangePasswordPage} from "./agenda/pages/forms/change-password";
import {LessonFormPage} from "./agenda/pages/forms/lesson";
import {PayFormPage} from "./agenda/pages/forms/pay";
import {StudentFormPage} from "./agenda/pages/forms/student";
import {AddPopover} from "./agenda/pages/pop/add-popover";
import {AuthFormPage} from "./agenda/pages/pop/auth";
import {UnverifiedEmailPopover} from "./agenda/pages/pop/UnverifiedEmailPopover";
import {StudentDetailPage} from "./agenda/pages/students/student-detail";
import {StudentsPage} from "./agenda/pages/students/students";


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

/**
 * Shorthand: ta (Teacher Agenda) for top-level components in feature modules
 */
@NgModule({
	declarations: [
		MyApp,
		// TODO if pages must be added to entryComponents
		// AboutPage,
		// ContactPage,
		// HomePage,
		// TabsPage,
		AgendaPage,
		AgendaDetailPage,
		AgendaList,
		ChangePasswordPage,
		LessonFormPage,
		PayFormPage,
		StudentFormPage,
		AddPopover,
		AuthFormPage,
		UnverifiedEmailPopover,
		StudentsPage,
		StudentDetailPage,
	],
	imports: [
		IonicModule.forRoot(MyApp),

		// platform modules

		// Feature modules
		CoreModule,
		AgendaModule

		//SharedModule,	// if needed here

		// Routing modules, if any
	],
	bootstrap: [IonicApp],
	entryComponents: [
		MyApp,
		// TODO check if we need to import all pages here for navigation
		// AboutPage,
		// ContactPage,
		// HomePage,
		// TabsPage,
		AgendaPage,
		AgendaDetailPage,
		AgendaList,
		ChangePasswordPage,
		LessonFormPage,
		PayFormPage,
		StudentFormPage,
		AddPopover,
		AuthFormPage,
		UnverifiedEmailPopover,
		StudentsPage,
		StudentDetailPage,
	],
	providers: []
})
export class AppModule {
}
