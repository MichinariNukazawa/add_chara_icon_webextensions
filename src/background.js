
// ******** Core ********

chrome.runtime.onInstalled.addListener( async (details) => {
	console.log('installed', details.reason);

	// インストール時に初期設定を行う

	// TODO なぜかこれをするとこのあとのcreateやログが呼ばれない
	//const inited = await dictionary_initialized();
	//if(inited){
	//	// web-ext debug中くらいしか発生しないと思われる
	//	console.log('already initialised', details.reason);
	//	return;
	//}

	//const dictionary_initialized = async () => {
	//	const item = await chrome.storage.local.get(null);
	//	return Object.keys(item).length !== 0;
	//}

	chrome.tabs.create({
		url: 'https://bluearchive.wikiru.jp/?キャラクター一覧',
	})
	console.log('initialized', details.reason);
});

console.log('called');
