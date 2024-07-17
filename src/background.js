
// ******** Core ********

chrome.runtime.onInstalled.addListener( (details) => {
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
	chrome.tabs.create({
		url: 'https://arknights.wikiru.jp/?キャラクター一覧',
	})

	// FireFoxでは、呼び出し順を一番最後にしてもTabの並び順はこれが最左に並ぶ
	// とはいえ最前面表示(CurrentTab？)にはなるので良しとする
	chrome.runtime.openOptionsPage();

	console.log('initialized', details.reason);
});

console.log('called');
