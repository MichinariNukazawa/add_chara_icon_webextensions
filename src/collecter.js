
const collectImages = (dictionary_data, callback) => {
	for(let key in dictionary_data){
		let data = dictionary_data[key];
		const img = document.createElement('img');

		const loaded = (key, img) => {
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
			console.log('collected', key, img.width, img.height, dataUrl);
			callback(key, dataUrl);
		}

		img.src = data['icon_src_url'];
		if(img.complete){
			//console.log('img completed', key);
			loaded(key, img);
		}else{
			console.log('img need load', key);
			img.addEventListener('load', () => {loaded(key, img)});
			img.addEventListener('error', function() {
				//alert('error')
				console.error('image can not loaded', key);
				callback(key, null);
			});
		}
	}
} 
