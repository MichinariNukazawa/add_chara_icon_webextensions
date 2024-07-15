
/*
内部保持データ（返すデータとはまた異なる）
const dictionary_data = {
	'シロコ（水着）':{
		//'title', 'BlueArchive', // 将来的に(これは付いていない可能性がある？)
		'icon_src_url':'https://bluearchive.wikiru.jp/attach2/696D67_E382B7E383ADE382B3EFBC88E6B0B4E79D80EFBC895F69636F6E2E706E67.png'
		'icon_data': 'data:image/png;base64,iVBORw0KGgoAAAANS~'
	},
	'カジコ':{
		//'title', 'BlueArchive', // 将来的に(これは付いていない可能性がある？)
		'alias': 'シロコ（水着）'
	},
};
*/

const dictionary_initialized = async (title) => {
	const hash = await chrome.storage.local.get(null);
	let res = {};
	for(let key in hash){
		if(hash[key].title == title){
			res[key] = hash[key];
		}
	}
	return Object.keys(res).length !== 0;
}

const dictionary_queryWords = async (words) => {
	//let data = dictionary_data[word];

	let items = await chrome.storage.local.get(words);

//	// aliasなitemがある場合、元名itemを引いて中身を置き換える(ex. "カジコ"から"シロコ(水着)"を引く)
//	let aliasKays = []
//	for(let key in items){
//		if(items[key].hasOwnProperty('alias')){
//			aliasKays.push(items[key]['alias']);
//		}
//	}
//	if(0 < aliasKays.length){
//		const unaliasedItems = await chrome.storage.local.get(aliasKays);
//		for(let aliasKay in aliasKays){
//			if(! unaliasedItems.hasOwnProperty(aliasKay)){
//				// 念の為
//				// (将来的にaliasだけ残るなどの状態があることを想定)
//				console.error('BUG: invalid aliasKey', aliasKay);
//				continue;
//			}
//			// このあと呼び出し元でも辞書keyマッチして使用する想定なので、
//			// alias元名(ex."カジコ")は保持する
//			items[aliasKay] = unaliasedItems[aliasKay];
//		}	
//	}

	return items;
}
