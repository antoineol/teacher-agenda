import {ViewChild} from '@angular/core';
import {Page, NavController, Slide, Slides, Swiper} from "ionic-angular";
import {AgendaEntry} from "../../model/Lesson";
import {AgendaService} from "../../business/AgendaService";
import moment = require("moment");
import {AgendaDetailPage} from "./agenda-detail";
import {LessonFormPage} from "../forms/lesson";
import {TranslateService} from "ng2-translate/ng2-translate";
import {ErrorService} from "../../framework/ErrorService";
import {AgendaList} from "./agenda-list";


interface SlideOptions {
	initialSlide: number;
	loop:boolean;
}

@Page({
	templateUrl: 'build/pages/agenda/agenda.html',
	directives: [AgendaList]
})
export class AgendaPage {

	agenda:AgendaEntry[];
	slideOptions = {initialSlide: 1, loop: true};

	@ViewChild('slider') slider: Slides;
	@ViewChild('slide1') slide1: Slide;
	@ViewChild('slide2') slide2: Slide;
	@ViewChild('slide3') slide3: Slide;

	constructor(private nav:NavController, agendaService:AgendaService, error:ErrorService) {
		try {
			agendaService.getFormattedAgenda().subscribe((agenda:AgendaEntry[]) => {
				// console.log("Formatted agenda:", agenda);
				this.agenda = agenda;
			}, error.handler("agenda.error.loadAgenda"));
		} catch(err) {
			error.handler("agenda.error.loadAgenda")(err);
		}
	}

	// ngAfterViewInit() {
	// 	console.log("Slider:", this.slider);
	// 	console.log("Slide 1:", this.slide1);
	// 	console.log("Slide 2:", this.slide2);
	// 	console.log("Slide 3:", this.slide3);
	// }

	// onSlideChanged(event:any) {
	// 	console.log("getSlider:", this.slider.getSlider());
	// 	console.log("onTransitionStart:", this.slider.onTransitionStart);
	// 	console.log("Slide changed:", event);
	// }

	onSlideWillChange(swiper:any) {
		let back = swiper.swipeDirection === 'prev';
		console.log("Slide will change:", back);


	}

	entryTapped(event:any, entry:AgendaEntry) {
		this.nav.push(AgendaDetailPage, {entry: entry});
	}

	addEntry() {
		this.nav.push(LessonFormPage);
	}
}
