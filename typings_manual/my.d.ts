
declare module 'humanize-duration' {
	interface HumanizeDuration {
		(momentDuration:any):string;
		humanizer: (defaultOptions:any) => HumanizeDuration
	}
	var humanizeDuration:HumanizeDuration;
	export = humanizeDuration;
}

declare module 'promise-defer' {
	export interface Deferred<T> {
		promise:Promise<T>;
		resolve:(value?:any)=>void;
		reject:(error:any)=>void;
		Deferred:Deferred<T>;
	}
	export default function defer<T>(PromiseClass?:any):Deferred<T>;
	// function defer<T>(PromiseClass?:any):Deferred<T>;
	// export = defer;
}

// Add window.Intl to let typescript recognize it. It is standard, but maybe too recent.
interface Window { Intl: any; }
