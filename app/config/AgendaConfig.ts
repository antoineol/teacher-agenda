import moment = require("moment");

export class AgendaConfig {
	
	private static today = moment();

	static defaultDate = AgendaConfig.today.format().substr(0, 10);
	static defaultStartBillingDate = AgendaConfig.today.clone().startOf('day').format();
	static defaultDuration = 45;

	// private static defaultStart:Moment = today.clone().startOf('day');
	// private static defaultEnd:Moment = today.clone().endOf('day');
	//
	// static defaultRange:AgendaRange = {start: AgendaConfig.defaultStart, end: AgendaConfig.defaultEnd};

	// static defaultRange:AgendaRange = AgendaRange.fromDate(AgendaConfig.defaultDate);

		/**
	 * Also serves as the index of the currently displayed range: should always be centered in the list of slides.
	 */
	static cachedSlidesOnOneSide = 1;

}
