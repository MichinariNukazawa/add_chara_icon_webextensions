
const getHashFromTitle = async (title) => {
	return new Promise((resolve) => {
		// TODO FireFoxではchrome.storage.local.*()でpromise構文が通用しない様子
		// (FireFox127.0.2, 2024/07, Ubuntu 24.04)
		chrome.storage.local.get(null, (hash) => {
			//console.log('src', hash);
			const filterHashFromTitle = (title, hash) => {
				let res = {};
				for(let key in hash){
					if(hash[key].title == title){
						res[key] = hash[key];
					}
				}
				return res;
			}			
			const res = filterHashFromTitle(title, hash);
			resolve(res);
		});
	});
};

const showIconsByKey = async (infoE, elem, title) => {
	const hash = await getHashFromTitle(title);
	//console.log('hash', title, hash);

	if(Object.keys(hash).length === 0){
		elem.textContent = '(none)';
		infoE.textContent = '辞書データなし';
		return;
	}

	const createBlock = (charaName, imgSrc) => {
		let blockE = document.createElement('span');
		let imgE = document.createElement('img');
		blockE.append(charaName, imgE, ', ');

		imgE.src = imgSrc;
		imgE.width = '16';
		imgE.height = '16';
		imgE.style = 'object-fit: contain;'
		imgE.classList.add('daisy-at-chara-icon_item')
		imgE.classList.add('daisy-at-chara-icon_image')
		imgE.classList.add('daisy-at-chara-icon_show')

		return blockE;
	}
	for(let key in hash){
		const blockE = createBlock(key, hash[key]['icon_data']);
		elem.appendChild(blockE);
	}

	infoE.textContent = `${Object.keys(hash).length}項目`;
}

const showIcons = () => {
	// ** erase childs
	document.getElementById('icon_showground_bluearchive').textContent = '';
	document.getElementById('icon_showground_arknights').textContent = '';
	// **
	showIconsByKey(
		document.getElementById('info_bluearchive'),
		document.getElementById('icon_showground_bluearchive'),
		'BlueArchive');
	showIconsByKey(
		document.getElementById('info_arknights'),
		document.getElementById('icon_showground_arknights'),
		'ArkNights');
}

window.addEventListener( 'load', function(e){
	document.getElementById('delete_button').addEventListener('click', function(e) {
		chrome.storage.local.clear(() => {
			window.alert('削除しました');
			console.log('removed ALL');
		});
	});

	document.getElementById('initialize_button_bluearchive').addEventListener('click', async function(e) {
		const hash = await getHashFromTitle('BlueArchive');
		chrome.storage.local.remove(
			Object.keys(hash),
			() => {
				chrome.tabs.create({
					url: 'https://bluearchive.wikiru.jp/?キャラクター一覧',
				});	
				console.log('removed BA');
			}
		);
	});
	document.getElementById('initialize_button_arknights').addEventListener('click', async function(e) {
		const hash = await getHashFromTitle('ArkNights');
		chrome.storage.local.remove(
			Object.keys(hash),
			() => {
				chrome.tabs.create({
					url: 'https://arknights.wikiru.jp/?キャラクター一覧',
				});
				console.log('removed AN');
			}
		);
	});

	chrome.storage.onChanged.addListener((changes, namespace) => {
		console.log('strage changed', namespace, Object.keys(changes).length);
		//for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
		//	console.log(
		//	`Storage key "${key}" in namespace "${namespace}" changed.`,
		//	`Old value was "${oldValue}", new value is "${newValue}".`
		//	);
		//}
		showIcons();
	});

	showIcons();
});
