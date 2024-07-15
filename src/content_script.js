/**
 * Substitutes do into text nodes.
 */
const replaceText = async (node) => {
	if (node.nodeType === Node.TEXT_NODE) {
		if (node.parentNode && node.parentNode.nodeName === 'TEXTAREA') {
			return;
		}

		doCharaNoterForNode(node);
	}
	else {
		// for (let i = node.childNodes.length - 1; 0 <= i; i--) {
		for (let i = 0; i < node.childNodes.length; i++) {
			await replaceText(node.childNodes[i]);
		}
	}
}

// memo: twitterなどの一部環境では同じNodeに対して２度コールされることがある模様
// （最初の１回はページ読み込み時の通常呼び出しかもしれず、挙動の理由の詳細は追ってもいないが、
// 少なくともtextContentの内容は変わらないままでも、ともかくそういうことが起こる）
//
// Now monitor the DOM for additions and substitute wareki into new nodes.
// @see https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver.
const observer = new MutationObserver((mutations) => {
	mutations.forEach(async (mutation) => {
		if (mutation.addedNodes && mutation.addedNodes.length > 0) {
			// This DOM change was new nodes being added. Run our substitution
			// algorithm on each newly added node.
			for (let i = 0; i < mutation.addedNodes.length; i++) {
				const newNode = mutation.addedNodes[i];
				console.log('new', newNode);
				await replaceText(newNode);
			}
		}
	});
});
observer.observe(document.body, {
	childList: true,
	subtree: true
});

const initialize = (title, scraper) => {
	console.log('initialize target url:', document.URL);

	const dictionary_data = scraper();
	console.log('scraped', title, dictionary_data);

	let count = 0; // 汚いカウンタ
	const callback = (key, dataUrl) => {
		//console.log('collected', key, dataUrl);
		if(dataUrl){
			dictionary_data[key]['icon_data'] = dataUrl;
			dictionary_data[key]['title'] = title;

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

			window.alert(`${chrome.runtime.getManifest().name} 拡張機能：\n${title}の辞書設定が完了しました`);

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
	const collectTargets = {
		'BlueArchive':
		{
			'scraper': scrapeCharacterListPage_BlueArchive,
			'urls': [
				'https://bluearchive.wikiru.jp/?キャラクター一覧',
				'https://bluearchive.wikiru.jp/?%E3%82%AD%E3%83%A3%E3%83%A9%E3%82%AF%E3%82%BF%E3%83%BC%E4%B8%80%E8%A6%A7',
			],
		},
		'ArkNights':
		{
			'scraper': scrapeCharacterListPage_ArkNights,
			'urls': [
				'https://arknights.wikiru.jp/?キャラクター一覧',
				'https://arknights.wikiru.jp/?%E3%82%AD%E3%83%A3%E3%83%A9%E3%82%AF%E3%82%BF%E3%83%BC%E4%B8%80%E8%A6%A7',
			]
		}
	};
	let isInit = false;
	for(let title in collectTargets){
		const urls = collectTargets[title].urls;
		const inited = await dictionary_initialized(title);
		if(urls.includes(document.URL) && (! inited)){
			initialize(title, collectTargets[title].scraper);
			isInit = true;
		}
	}

	if(! isInit){
		replaceText(document.body);
	}
}
main();
