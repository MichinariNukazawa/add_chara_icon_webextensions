
const showIconsByKey = async (elem, title) => {
	const getHashFromKey = async (title) => {
		return new Promise((resolve) => {
			// TODO FireFoxではここでpromise構文が通用しない
			// (FireFox127.0.2, 2024/07, Ubuntu 24.04)
			chrome.storage.local.get(null, (hash) => {
				console.log('src', hash);
				let res = {};
				for(let key in hash){
					if(hash[key].title == title){
						res[key] = hash[key];
					}
				}
				resolve(res);
			});
		});
	};
	const hash = await getHashFromKey(title);
	console.log('hash', title, hash);

	const createBlock = (charaName, imgSrc) => {
		let blockE = document.createElement('span');
		let nameE = document.createElement('span');
		let imgE = document.createElement('img');
		blockE.append(nameE, imgE, ' ');

		nameE.textContent = charaName;
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

	if(Object.keys(hash).length === 0){
		elem.textContent = '(none)';
	}
}

const showIcons = () => {
	// ** erase childs
	document.getElementById('icon_showground_bluearchive').textContent = '';
	document.getElementById('icon_showground_arknights').textContent = '';
	// **
	showIconsByKey(document.getElementById('icon_showground_bluearchive'), 'BlueArchive');
	showIconsByKey(document.getElementById('icon_showground_arknights'), 'ArkNights');
}

window.addEventListener( 'load', function(e){
	let initialize_button_bluearchive = document.getElementById('initialize_button_bluearchive');
	initialize_button_bluearchive.addEventListener('click', function(e) {
		showIcons();
	});

	showIcons();
});
