// !https://bluearchive.wikiru.jp/?キャラクター一覧

const scrapeCharacterListPage_BlueArchive = () => {
	// 生徒を取得
	let rowsElements = document.querySelectorAll('#sortabletable1 > tbody > tr');

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

		let rd = [rowData[2], {'icon_src_url' : 'https://bluearchive.wikiru.jp/'+ rowData[1]}];
		rowsData.push(rd);
	}

	let dictionary_data = {};
	rowsData.forEach((row) => {
		dictionary_data[row[0]] = row[1];
	});

	// ** BlueArchive固有のエイリアスを追加
	const aliases = {
		'カジコ' : {
			'title': 'BlueArchive',
			'alias': 'シロコ（水着）',
		},
		'ドヒナ' : {
			'title': 'BlueArchive',
			'alias': 'ヒナ（ドレス）',
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
	
	return dictionary_data;
}
