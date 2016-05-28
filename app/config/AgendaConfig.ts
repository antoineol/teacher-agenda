import {Moment} from "moment";
import moment = require("moment");
import {AgendaRange} from "../model/AgendaRange";

// let today = moment();
let today = moment("2016-05-18T07:00:00.000Z");

export class AgendaConfig {

	private static defaultStart:Moment = today.clone().startOf('day');
	private static defaultEnd:Moment = today.clone().endOf('day');
	
	static defaultRange:AgendaRange = {start: AgendaConfig.defaultStart, end: AgendaConfig.defaultEnd};
	
	/**
	 * Also serves as the index of the currently displayed range: should always be centered in the list of slides.
	 */
	static cachedSlidesOnOneSide = 1;

}
