
const doCharaNoterForNode = (node) => {
	const data = dictionary_queryWord(node.textContent, (data) => {
		if(! data){
			return;
		}
	
		//console.log('detected.', data.name, node);
	
		let img = document.createElement("img");
		img.src = data['icon_data'];
		img.width = '16'
		img.height = '16'
		img.style = 'object-fit: contain;'
		img.classList.add('daisy-at-chara-icon_item')
		img.classList.add('daisy-at-chara-icon_image')
		node.parentNode.append(img);	
	});
}
