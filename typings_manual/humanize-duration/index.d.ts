
declare module "humanize-duration" {
	interface HumanizeDuration {
		(momentDuration:any):string;
		humanizer: (defaultOptions:any) => HumanizeDuration
	}
	var humanizeDuration:HumanizeDuration;
	export = humanizeDuration;
}
