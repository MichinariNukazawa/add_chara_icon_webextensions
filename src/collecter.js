
const collectImage = async (icon_src_url) => {
	return new Promise((resolve, reject) => {
		const img = document.createElement('img');

		const loaded = (img) => {
			// canvasを作ってimg elementの画像を描画
			const canvas = document.createElement('canvas');
			
			/*
			// 元画像サイズそのままの場合
			canvas.width = img.width;
			canvas.height = img.height;
			canvas.getContext('2d').drawImage(img, 0, 0);	
			*/

			// 縮小する場合 // (16x16あれば十分な気もするが一応少し大きめに指定)
			const PIX = 64;
			canvas.width = PIX;
			canvas.height = PIX;
			canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height, 0,0,canvas.width,canvas.height);	

			// dataURL を取得
			const dataUrl = canvas.toDataURL('image/png');
			//console.log('collected', img.width, img.height, dataUrl);
			resolve(dataUrl);
		}

		img.src = icon_src_url;
		if(img.complete){
			//console.log('img completed', icon_src_url);
			loaded(img);
		}else{
			//console.log('img need load', icon_src_url);
			img.addEventListener('load', () => {
				loaded(img)
			});
			img.addEventListener('error', () => {
				console.error('image can not loaded', icon_src_url);
				reject(`image can not loaded:${icon_src_url}`);
			});
		}
	});
} 

const collector = async (title, dictionary_data) => {
	for(let key in dictionary_data){
		let data = dictionary_data[key];
		
		try{
			const dataUrl = await collectImage(data['icon_src_url']);
			dictionary_data[key]['icon_data'] = dataUrl;
			dictionary_data[key]['title'] = title;	
		}catch(error){
			console.error('can not collected', key, error);
			delete dictionary_data[key];
		}
	}

	console.log('collected all', chrome.runtime.getManifest().name);

	return dictionary_data;
}
