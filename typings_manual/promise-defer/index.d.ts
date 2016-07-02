
interface Deferred<T> {
	promise:Promise<T>;
	resolve:(value?:any)=>void;
	reject:(error:any)=>void;
	Deferred:Deferred<T>;
}

declare module "promise-defer" {
	interface DeferredConstructor {
		<T>(PromiseClass?:any):Deferred<T>;
	}
	// export default function defer<T>(PromiseClass?:any):Deferred<T>;
	// function defer<T>(PromiseClass?:any):Deferred<T>;
	var defer:DeferredConstructor;
	export = defer;
}
