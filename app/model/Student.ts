export interface Student {
	$key?:string;
    name:string;
    price: number;
	startBilling:string; // Date.toJSON()

	// To display
	startBillingReadable?:string;
}
