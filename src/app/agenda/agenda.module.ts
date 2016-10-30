import {NgModule} from "@angular/core";
import {SharedModule} from "../shared/shared.module";
import {AgendaPage} from "./pages/agenda/agenda";
import {AgendaList} from "./pages/agenda/agenda-list";
import {AgendaDetailPage} from "./pages/agenda/agenda-detail";
import {ChangePasswordPage} from "./pages/forms/change-password";
import {LessonFormPage} from "./pages/forms/lesson";
import {PayFormPage} from "./pages/forms/pay";
import {StudentFormPage} from "./pages/forms/student";
import {AddPopover} from "./pages/pop/add-popover";
import {AuthFormPage} from "./pages/pop/auth";
import {UnverifiedEmailPopover} from "./pages/pop/UnverifiedEmailPopover";
import {StudentsPage} from "./pages/students/students";
import {StudentDetailPage} from "./pages/students/student-detail";

/**
 * Contains the components and services used in the agenda page.
 * Shorthand: `ag` (prefix for component selectors)
 */
@NgModule({
	imports: [SharedModule],
	declarations: [
		AgendaPage, AgendaList, AgendaDetailPage,
		ChangePasswordPage, LessonFormPage, PayFormPage, StudentFormPage,
		AddPopover, AuthFormPage, UnverifiedEmailPopover,
		StudentsPage, StudentDetailPage
	],
	exports: [],
	providers: []
})
export class AgendaModule {
}
