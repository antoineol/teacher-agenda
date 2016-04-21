
declare module 'humanize-duration' {
	interface HumanizeDuration {
		(momentDuration:any):string;
	}
	var humanizeDuration:HumanizeDuration;
	export = humanizeDuration;
}
