/**
 * Substitutes do into text nodes.
 */
function replaceText (node) {
	if (node.nodeType === Node.TEXT_NODE) {
		if (node.parentNode && node.parentNode.nodeName === 'TEXTAREA') {
			return;
		}

		doCharaNoterForNode(node);
	}
	else {
		for (let i = 0; i < node.childNodes.length; i++) {
			replaceText(node.childNodes[i]);
		}
	}
}

/*
// Now monitor the DOM for additions and substitute wareki into new nodes.
// @see https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver.
const observer = new MutationObserver((mutations) => {
	mutations.forEach((mutation) => {
		if (mutation.addedNodes && mutation.addedNodes.length > 0) {
			// This DOM change was new nodes being added. Run our substitution
			// algorithm on each newly added node.
			for (let i = 0; i < mutation.addedNodes.length; i++) {
				const newNode = mutation.addedNodes[i];
				replaceText(newNode);
			}
		}
	});
});
observer.observe(document.body, {
	childList: true,
	subtree: true
});
*/

const initialize = () => {
	console.log('initialize target url:', document.URL);

	const dictionary_data = scrapeCharacterListPage()
	console.log('scraped', dictionary_data);

	let count = 0; // 汚いカウンタ
	const callback = (key, dataUrl) => {
		//console.log('collected', key, dataUrl);
		if(dataUrl){
			dictionary_data[key]['icon_data'] = dataUrl;

			/*
			// debug	
			let img = document.createElement("img");
			img.src = dictionary_data[key]['icon_data']
			img.width = '16'
			img.height = '16'
			img.style = 'object-fit: contain;'
			img.classList.add('daisy-at-chara-icon_item')
			img.classList.add('daisy-at-chara-icon_image')
			document.querySelectorAll('#body > ul:nth-child(7) > li:nth-child(1) > span')[0].append(img);
			console.log('debug',img);
			*/
		}else{
			console.error('can not collected', key);
			delete dictionary_data[key];
		}
		count++;
		if(Object.keys(dictionary_data).length <= count){
			console.log('collected all', chrome.runtime.getManifest().name);
			
			window.alert(`${chrome.runtime.getManifest().name}：拡張機能の初期設定が完了しました`);

			chrome.storage.local.set(dictionary_data).then(() => {
				// firefox not supported?
				// https://stackoverflow.com/questions/40561503/get-size-of-browser-storage-local-in-firefox-via-webextensions
				// https://developer.mozilla.org/ja/docs/Mozilla/Add-ons/WebExtensions/API/storage/StorageArea/getBytesInUse
				//chrome.storage.local.getBytesInUse(null).then((value) => {
				//	console.log('saved (MiB)', value / (1024 * 1024));
				//});
				chrome.storage.local.get(null, function(items) {
					var allKeys = Object.keys(items);
					console.log('allkeys:', allKeys);

					replaceText(document.body);
				});
			}, (error) => {
				console.error('can not saved', error);
			})
		}
	}

	collectImages(dictionary_data, callback);
}

const main = async () => {
	// MDNに明記されていなかったのでBase64エンコーディングもありうる想定でマッチする
	const urls = [
		'https://bluearchive.wikiru.jp/?キャラクター一覧',
		'https://bluearchive.wikiru.jp/?%E3%82%AD%E3%83%A3%E3%83%A9%E3%82%AF%E3%82%BF%E3%83%BC%E4%B8%80%E8%A6%A7',
	];
	const inited = await dictionary_initialized();
	if(urls.includes(document.URL) && (! inited)){
		initialize();
	}else{
		replaceText(document.body);
	}
}
main();
