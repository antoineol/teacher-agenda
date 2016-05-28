import {ViewChild} from "@angular/core";
import {Page, NavController, Slides} from "ionic-angular";
import {AgendaEntry} from "../../model/Lesson";
import {LessonFormPage} from "../forms/lesson";
import {AgendaList} from "./agenda-list";
import {AgendaRange} from "../../model/AgendaRange";
import {AgendaService} from "../../business/AgendaService";
import {AgendaConfig} from "../../config/AgendaConfig";


@Page({
	templateUrl: 'build/pages/agenda/agenda.html',
	directives: [AgendaList]
})
export class AgendaPage {

	private ranges:AgendaRange[]/* = AgendaPage.initRanges(AgendaPage.defaultRange, AgendaPage.cachedSlidesOnOneSide)*/;

	dayReadable:string = AgendaConfig.defaultRange.start.format('L');

	agenda:AgendaEntry[];

	slideOptions = {initialSlide: AgendaConfig.cachedSlidesOnOneSide}; // used in template

	@ViewChild('slider') slider:Slides;

	constructor(private nav:NavController, private agendaService:AgendaService) {
		this.ranges = agendaService.initRanges();
	}

	// ngAfterViewInit() {
		// let swiper = this.slider.getSlider();
	// 	console.log("Slider:", this.slider);
	// }

	rangesPreview():string {
		return this.ranges.map((range:AgendaRange) => range.start.format('L')).join(' ');
	}

	// Workaround because the swipe to change of slide has bugs
	slideNext() {
		this.dayReadable = this.agendaService.updateSlideRange(this.ranges, this.slider, false, AgendaConfig.cachedSlidesOnOneSide + 1, false);
		// The user is automatically positioned to the new slide. So we manually create a sliding effect.
		this.slider.slideTo(AgendaConfig.cachedSlidesOnOneSide - 1, 0, false);
		setTimeout(() => {
			this.slider.slideNext(300, false);
		}, 50);
	}

	// Workaround because the swipe to change of slide has bugs
	slidePrev() {
		this.dayReadable = this.agendaService.updateSlideRange(this.ranges, this.slider, true, AgendaConfig.cachedSlidesOnOneSide - 1, false);
		// The user is automatically positioned to the new slide. So we manually create a sliding effect.
		this.slider.slideTo(AgendaConfig.cachedSlidesOnOneSide + 1, 0, false);
		setTimeout(() => {
			this.slider.slidePrev(300, false);
		}, 50);

	}

	updateSlideRange(swiper:any) {
		let back = swiper.swipeDirection === 'prev';
		let newIndex = this.slider.getActiveIndex();
		this.dayReadable = this.agendaService.updateSlideRange(this.ranges, this.slider, back, newIndex);
	}

	// updateSlideRangeEnd(swiper:any) {
	// 	console.log("Did change");
	// }

	addEntry() {
		this.nav.push(LessonFormPage);
	}


	// Internal utils

	// private static initRanges():AgendaRange[] {
	// 	let defaultRange:AgendaRange = AgendaConfig.defaultRange;
	// 	let cachedSlidesOnOneSide:number = AgendaConfig.cachedSlidesOnOneSide;
	// 	let length = 2 * cachedSlidesOnOneSide + 1;
	// 	let ranges = new Array(length);
	// 	ranges[cachedSlidesOnOneSide] = defaultRange;
	// 	let pushedRange = defaultRange;
	// 	for (let i = cachedSlidesOnOneSide - 1; i >= 0; i--) {
	// 		pushedRange = AgendaRange.prevDay(pushedRange);
	// 		ranges[i] = pushedRange;
	// 	}
	// 	pushedRange = defaultRange;
	// 	for (let i = cachedSlidesOnOneSide + 1; i < length; i++) {
	// 		pushedRange = AgendaRange.nextDay(pushedRange);
	// 		ranges[i] = pushedRange;
	// 	}
	// 	return ranges;
	// }
}
