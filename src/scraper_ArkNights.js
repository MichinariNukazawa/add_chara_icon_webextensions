// !https://arknights.wikiru.jp/?キャラクター一覧

const scrapeCharacterListPage_ArkNights = () => {
	const readTable = (rowsElements) => {
		let rowsData = [];
		for (let i = 0; i < rowsElements.length; i++) {
			let row = rowsElements[i];
			let rowData = [];
			row.querySelectorAll('td').forEach(function(cell) {
				let imgs = cell.getElementsByTagName('img');
				if((0 < imgs.length) && (! imgs[0].classList.contains('daisy-at-chara-icon_image'))){
					rowData.push(imgs[0].getAttribute('src'))
				}else{
					rowData.push(cell.innerText.trim().replace(/\r?\n/g, ''));
				}
			});
			if(7 > rowData.length){
				continue;
			}
	
			let rd = [rowData[1], {'icon_src_url' : 'https://arknights.wikiru.jp/'+ rowData[0]}];
			rowsData.push(rd);
		}

		return rowsData;
	};

	// オペレータを取得
	const selecters = [
		'#sortabletable1 > tbody > tr', 	//★6
		'#sortabletable3 > tbody > tr', 	//★5キャラ
		'#sortabletable5 > tbody > tr',		// 統合戦略・保全駐在限定キャラ 
		'#sortabletable6 > tbody > tr', 	//★4
		'#sortabletable8 > tbody > tr',		//★3キャラ
		'#sortabletable10 > tbody > tr',	//★2キャラ 
		'#sortabletable11 > tbody > tr',	//★1キャラ 
	];

	let rowsData = [];
	selecters.forEach((selecter) => {
		const rowsElements = document.querySelectorAll(selecter);
		let rds = readTable(rowsElements);
		rowsData = rowsData.concat(rds);
	});

	let dictionary_data = {};
	rowsData.forEach((row) => {
		dictionary_data[row[0]] = row[1];
	});

	// ** ArkNights固有のエイリアスを追加
	const aliases = {
		'エイヤ' : {
			'title': 'ArkNights',
			'alias': 'エイヤフィヤトラ',
		},
	};
	for(const [key, value] of Object.entries(aliases)){
		if(dictionary_data.hasOwnProperty(key)){
			console.warn('already exist', key);
			continue;
		}
		if(! dictionary_data.hasOwnProperty(value['alias'])){
			console.warn('not exist alias', key, value['alias']);
			continue;
		}
		dictionary_data[key] = value;
	}

	//console.table(dictionary_data);
	return dictionary_data;
}
