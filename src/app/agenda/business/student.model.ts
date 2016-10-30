export interface Student {
	$key?:string;
    name:string;
    price: number;
	paymentHistory:PaymentDetail[];
	paidUntil:string;

	// Display
	paidUntilReadable?:string;

	// To remove
	startBilling?:string; // Date.toJSON()
	paid?:number;
	startBillingReadable?:string;
}

export interface PaymentDetail {
	date:string;
	amount:number;
}
