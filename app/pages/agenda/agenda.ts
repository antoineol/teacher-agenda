import {ViewChild} from "@angular/core";
import {Page, NavController, Slide, Slides} from "ionic-angular";
import {AgendaEntry} from "../../model/Lesson";
import {AgendaService} from "../../business/AgendaService";
import {LessonFormPage} from "../forms/lesson";
import {ErrorService} from "../../framework/ErrorService";
import {AgendaList} from "./agenda-list";
import {AgendaRange} from "../../model/AgendaRange";
import moment = require("moment");


interface SlideOptions {
	initialSlide: number;
	loop:boolean;
}

@Page({
	templateUrl: 'build/pages/agenda/agenda.html',
	directives: [AgendaList]
})
export class AgendaPage {

	private static defaultStart = moment("2016-05-18T07:00:00.000Z").startOf('day');
	private static defaultEnd = moment("2016-05-18T07:00:00.000Z").endOf('day');
	private static defaultRange = {start: AgendaPage.defaultStart, end: AgendaPage.defaultEnd}
	private static initialSlide = 1;

	// private start = AgendaPage.defaultStart;
	// private end = AgendaPage.defaultEnd;

	private ranges:AgendaRange[] = [
		AgendaRange.prevDay(AgendaPage.defaultRange),
		AgendaPage.defaultRange,
		AgendaRange.nextDay(AgendaPage.defaultRange)
	];

	// private range1:AgendaRange = AgendaRange.prevDay(AgendaPage.defaultStart, AgendaPage.defaultEnd);
	// private range2:AgendaRange = {start: AgendaPage.defaultStart, end: AgendaPage.defaultEnd};
	// private range3:AgendaRange = AgendaRange.nextDay(AgendaPage.defaultStart, AgendaPage.defaultEnd);

	// private currentRange:AgendaRange = this.ranges[AgendaPage.initialSlide];
	private currentRange = AgendaPage.initialSlide;

	agenda:AgendaEntry[];

	slideOptions = {initialSlide: AgendaPage.initialSlide, loop: true}; // used in template

	// @ViewChild('slider') slider: Slides;
	// @ViewChild('slide1') slide1: Slide;
	// @ViewChild('slide2') slide2: Slide;
	// @ViewChild('slide3') slide3: Slide;

	constructor(private nav:NavController, agendaService:AgendaService, error:ErrorService) {
		// try {
		// 	agendaService.getFormattedAgenda().subscribe((agenda:AgendaEntry[]) => {
		// 		// console.log("Formatted agenda:", agenda);
		// 		this.agenda = agenda;
		// 	}, error.handler("agenda.error.loadAgenda"));
		// } catch(err) {
		// 	error.handler("agenda.error.loadAgenda")(err);
		// }
	}

	private rangeIncr(increment:number):number {
		let newRange = (this.currentRange + increment) % this.ranges.length;
		while (newRange < 0) {
			newRange += this.ranges.length;
		}
		return newRange;
	}

	private prevPrev():number {
		return this.rangeIncr(-2);
	}
	private prev():number {
		return this.rangeIncr(-1);
	}
	private next():number {
		return this.rangeIncr(1);
	}
	private nextNext():number {
		return this.rangeIncr(2);
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
		if (!back) {
			this.currentRange = this.next();
			let nextRange = this.ranges[this.currentRange];
			this.ranges[this.nextNext()] = AgendaRange.nextDay(nextRange);
		} else {
			this.currentRange = this.prev();
			let prevRange = this.ranges[this.currentRange];
			this.ranges[this.prevPrev()] = AgendaRange.prevDay(prevRange);
		}

		console.log("Slide will change. backward:", back);
	}

	addEntry() {
		this.nav.push(LessonFormPage);
	}
}
