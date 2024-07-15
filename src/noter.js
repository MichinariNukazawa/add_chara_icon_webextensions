
const existIconChildOneLevel = (node) => {
	for(let i = 0; i < node.children.length; i++){
		if(node.children[i].classList.contains('daisy-at-chara-icon_image')){
			return true;
		}
	}
	return false;
};

const doCharaNoterForNode = async (node) => {
	const addImg = (node, data) => {
		// 非同期な箇所が多く、複数のimg追加の呼び出しが重なる場合があるため、ここでチェックする
		// すでに後ろにアイコンを付与していた場合、抜ける
		if(existIconChildOneLevel(node.parentNode)){
				console.log('already in Noter');
				return;
		}

		let img = document.createElement("img");
		img.src = data['icon_data'];
		img.width = '16'
		img.height = '16'
		img.style = 'object-fit: contain;'
		img.classList.add('daisy-at-chara-icon_item')
		img.classList.add('daisy-at-chara-icon_image')
		node.parentNode.append(img);
	};

	// 異様に長い場合、とりあえず人物名ではないと判断し全体マッチは行わない
	if(32 < node.textContent.length){
		return false;
	}
	// ** key文字列の候補を切り出していく
	let queryWords = [node.textContent];
	// ** タグ表記(またはタグ表記でなくともリンク)から、氏名部分を抽出して(末尾の括弧を取り除いて)マッチ候補に追加する
	const foundTag = /#?([^#(]+)(\(.+\))?$/.exec(node.textContent)
	if(foundTag && 2 <= foundTag[1].length){ // マッチしても１文字なら使わない
		queryWords.push(foundTag[1]);
	}
	// ** 漢字とカタカナの組み合わせ（"名字ナマエ"）を氏名として扱い、名前の部分だけでのマッチも行う
	// pixivのタグは見た目上"#"付きだが、実際には"::before"を"#"で表示しているため文字列的には付いていない
	const foundName = /^#?\p{sc=Han}+([\p{sc=Katakana}ー]+)(\(.+\))?$/u.exec(node.textContent)
	if(foundName && 2 <= foundName[1].length){
		/*
		BlueArchiveでは実装生徒のバリエーションを後置括弧で表現するが、
		pixivタグなどでは作品名が付く場合がある。
		- 実装生徒名 ex."シロコ(水着)"
		- pixivタグ ex."#伊落マリー(ブルーアーカイブ)"
		ここでは名前を引ければ実装生徒と厳密にマッチする必要はないので、括弧は単に取り除く
		 */
		queryWords.push(foundName[1]);
	}
	// ** 末尾
	// (https://bluearchive.wikiru.jp)の左側の"コメント/モモイ（メイド）"などに対応する意図
	// このあたりは将来的に字句解析が実装されると不要になるかもしれないが...
	const foundLast = /.+[-\/\s](.+)$/.exec(node.textContent)
	if(foundLast && 2 <= foundLast[1].length){ // マッチしても１文字なら使わない
		queryWords.push(foundLast[1]);
	}
	//
	//console.log('querys', queryWords, node);

	const hash = await dictionary_queryWords(queryWords);
	if(0 < Object.keys(hash).length){
		//console.log('detected.', data.name, node);
		// ここでは２つ共マッチしていても最初にフルマッチが入っているかつ
		// 実質同じ人物を指しているはずなので、単に先頭のデータを使う
		const key = Object.keys(hash)[0];
		addImg(node, hash[key]);
		return;
	}
	return;
}
