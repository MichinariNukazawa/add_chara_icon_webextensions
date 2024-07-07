
/*
const dictionary_data = {
	'シロコ（水着）':{
		'icon_src_url':'https://bluearchive.wikiru.jp/attach2/696D67_E382B7E383ADE382B3EFBC88E6B0B4E79D80EFBC895F69636F6E2E706E67.png'
		'icon_data': 'data:image/png;base64,iVBORw0KGgoAAAANS~'
	},
};
*/

const dictionary_initialized = async () => {
	const item = await chrome.storage.local.get(null);
	return Object.keys(item).length !== 0;
}

const dictionary_queryWord = async (word) => {
	//let data = dictionary_data[word];

	const item = await chrome.storage.local.get([word]);

	if(Object.keys(item).length === 0){
		return null;
	}

	//console.log('item', item);
	let data = item[word];
	data['name'] = word;

	return data;
}