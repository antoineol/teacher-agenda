import * as moment from "moment";

export class AgendaConfigClass {

	private today = moment();

	defaultDate = this.today.format().substr(0, 10);
	defaultStartBillingDate = this.today.clone().startOf('day').format();
	defaultDuration = 45;

	// private defaultStart:Moment = today.clone().startOf('day');
	// private defaultEnd:Moment = today.clone().endOf('day');
	//
	// defaultRange:AgendaRange = {start: this.defaultStart, end: this.defaultEnd};

	// defaultRange:AgendaRange = AgendaRange.fromDate(this.defaultDate);

		/**
	 * Also serves as the index of the currently displayed range: should always be centered in the list of slides.
	 */
	cachedSlidesOnOneSide = 1;

}
export const AgendaConfig = new AgendaConfigClass();
