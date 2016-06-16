import {Pipe, PipeTransform} from '@angular/core';
import {Utils} from "../../business/Utils";

@Pipe({name: 'currency'})
export class CurrencyPipe implements PipeTransform {
	transform(price:number):string {
		return Utils.formatCurrency(price);
	}
}
