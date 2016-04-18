import {Page, NavController, NavParams} from 'ionic-angular';

interface Item {
	title:string;
	note:string;
	icon:string
}

@Page({
	templateUrl: 'build/pages/list/list.html'
})
export class ListPage {
	selectedItem:any;
	icons:string[];
	items:Item[];

	constructor(private nav:NavController, navParams:NavParams) {
		try {
			// If we navigated to this page, we will have an item available as a nav param
			this.selectedItem = navParams.get('item');

			this.icons = ['flask', 'wifi', 'beer', 'football', 'basketball', 'paper-plane',
				'american-football', 'boat', 'bluetooth', 'build'];

			this.items = [];
			for (let i = 1; i < 11; i++) {
				this.items.push(<Item>{
					title: 'Item ' + i,
					note: 'This is item #' + i,
					icon: this.icons[Math.floor(Math.random() * this.icons.length)]
				});
			}
		} catch (err) {console.error(err.stack || err);}
	}

	itemTapped(event:any, item:Item) {
		this.nav.push(ListPage, {
			item: item
		});
	}
}
