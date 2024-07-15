
/*
内部保持データ（返すデータとはまた異なる）
const dictionary_data = {
	'シロコ（水着）':{
		'title', 'BlueArchive',
		'icon_src_url':'https://bluearchive.wikiru.jp/attach2/696D67_E382B7E383ADE382B3EFBC88E6B0B4E79D80EFBC895F69636F6E2E706E67.png'
		'icon_data': 'data:image/png;base64,iVBORw0KGgoAAAANS~'
	},
	'カジコ':{
		'title', 'BlueArchive',
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

	// ** aliasなitemがある場合、元名itemを引いて中身を置き換える(ex. "カジコ"から"シロコ(水着)"を引く)
	let aliasSrcs = [];
	let aliasDsts = [];
	for(let key in items){
		if(items[key].hasOwnProperty('alias')){
			aliasSrcs.push(key);
			aliasDsts.push(items[key]['alias']);
		}
	}
	if(0 < aliasDsts.length){
		const unaliasedItems = await chrome.storage.local.get(aliasDsts);
		for(let i = 0; i < aliasDsts.length; i++){
			if(! unaliasedItems.hasOwnProperty(aliasDsts[i])){
				// 念の為
				// (将来的にaliasだけ残るなどの状態があることを想定)
				console.error('BUG: invalid aliasKey', aliasDsts[i]);
				continue;
			}
			// このあと呼び出し元でも辞書keyマッチして使用する想定なので、
			// alias元名(ex."カジコ")を引き続きkeyとする
			items[aliasSrcs[i]] = unaliasedItems[aliasDsts[i]];
			items[aliasSrcs[i]]['alias'] = aliasDsts[i];
		}	
	}

	return items;
}
