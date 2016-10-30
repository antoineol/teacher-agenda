import {Pipe, PipeTransform} from "@angular/core";
import {Utils} from "./utils";

@Pipe({name: 'currency'})
export class CurrencyPipe implements PipeTransform {
	transform(price:number):string {
		return Utils.formatCurrency(price);
	}
}
