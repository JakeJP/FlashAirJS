FlashAir Javascript client library
===================
- WiFi対応のSDカードである FlashAir(TM) に対応しています。
- ECMAScript 3 互換でコンパイルされたJavascriptライブラリです。
- AJAXの呼び出しをわかりやすいメソッド呼び出しで結果を取得することができます。
- javascriptのソースコードは TypeScript(.ts)　でかかれています。
- このライブラリは jQuery に依存しています。
- MIT license で商用・非商用自由に使っていただけます。

####flashAirTypes.js (flashAieTypes.min.js | flashAirTypes.ts )
CGIの呼び出し、結果取得をわかりやすく表現するためのオブジェクト定義等を含んでいます。後述のjsファイルの前にいつも読み込んでおく必要があります。

#### flashAirClient.js (flashAirClient.min.js | flashAirClient.ts )
FlashAir.FlashAirClient クラスが定義されています。CGI呼び出しをサポートします。

- ajax(http) 呼び出しと、戻り値のオブジェクト表現への変換をサポートします。
- 戻り値は jQueryPromise オブジェクトによって非同期に取得します。
- イベントをハンドリングすることで、SDカードの状態の変化、SDカードへのWiFi接続状態の変化に応じることができます。
- 接続先のFlashAirを動的に変更することができます。


####requirement
- jQuery
- flashAirTypes.ts
- flashAirClient.ts


### Examples
HTMLページで利用する場合最低限次のような記述が必要です。
```
<script src="js/jquery-[version].js"></script>
<script src="js/flashAirTypes.js"></script>
<script src="js/flashAirClient.js"></script>
<script>
	var fa = new FlashAir.FlashAirClient("http://flashair/");
</script>
```

SDカードのルートディレクトリのファイル一覧を取得するサンプル
```ts
var fa = new FlashAir.FlashAirClient("http://flashair/");
fa.Command.FileList("/")
.done( function(list){
	$.each(list, function(i, file){
		console.log( file );
	});
});
```
SDカードのファイルの増減など変化したときのイベント処理
```ts
var fa = new FlashAir.FlashAirClient("http://flashair/");
fa.on('fa.updated', function(){
	// SD card status has been changed. Do something.
});
```

##互換性
FlashAir(TM) W-03 でテストしました。

##バージョン

-  0.9.4 (2015.6.20)
  最初のリリース

##License
(c) 2015 Yokinsoft Jake.Y.Yoshimura http://www.yo-ki.com
MIT License

https://github.com/JakeJP/FlashAirApp
