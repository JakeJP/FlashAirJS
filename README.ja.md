FlashAir Javascript Client Library
===================

WiFiを通したファイル転送に対応した TOSHIBA FlashAir(TM) SDメモリカードのためのJavascriptライブラリです。FlashAirに用意されたAPIに接続するための HTTP接続、FlashAirの状態変更の通知機能をカプセルしています。

- FlashAir(TM) TOSHIBA に対応
- API(CGI）呼び出しと状態変更通知に対応
- TypeScript(ts) と Javascript(js) の両方で提供。ECMAScript 3 互換。
- jQuery に依存しています。
- MIT license で商法・非商用にかかわらず自由に再利用していただけます。

#簡単な使い方
**./js** ディレクトリに生成済みの javascript ファイルがあります。どちらか１つを使用します。

-  **flashAirClient.js**  TypeScriptからコンパイルされた圧縮されていない javascript ファイルです。
- **flashAirClient.min.js**  TypeScriptからコンパイルされた圧縮されたファイルです。デバッグとソースコードの参照のために `flashAirClient.min.js.map` ファイルも利用可能です。

使用を開始するには `jQuery` と`flashAirClient.js` ファイルを参照します。

FlashAirのディレクトリ一覧をとるだけの簡単なサンプルです。

```ts
<script src="js/jquery-[version].js"></script>
<script src="js/flashAirClient.js"></script>
<script>
	var fa = new FlashAir.FlashAirClient("http://flashair/");
	fa.Command.FileList("/")
		.done( function(list){
			$.each(list, function(i, file){
			console.log( file );
			// file is in a form of FileInfoRaw { r_uri, fname, ... }
		});
</script>
```

ライブラリのリファレンスは **doc** ディレクトリ以下にHTMLとして格納されています。

#TypeScript ソースファイルからのコンパイル

**gulp** を使います。

####前提
- **NodeJS** が使える環境
- **tsd** TypeScriptの定義ファイルの管理アプリ（ `npm install -g tsd` でインストールできます。）

####依存している node モジュールをインストールします。. 
```
npm install
```
####TypeScript の定義ファイルをインストールします。(ここでは jquery に関してのみ)
```
tsd update
```

####gulp コマンドで、**ts** のコンパイルと、**doc** の出力を行います。
```
gulp
```

## 利用例
このライブラリを使ったアプリを公開しています。

- Yokin's FlashAir Sync for Google Chrome.  Google Chrome が利用可能なWindowsや Linux、 MacOSで動作する、ファイル転送同期ツールです。Google WebStoreから入手できます。 https://chrome.google.com/webstore/detail/yokins-flashair-sync/cmeohdjjopjjlfbiegcikeiioanainmb
- List.htm カスタマイズ。SDカードの隠しディレクトリにセットすることでブラウザ経由のデザインが今風にカスタマイズできます。https://github.com/JakeJP/FlashAirList

##互換性
FlashAir(TM) 型番W-03で検証されています。

##Version History

-  0.9.4 (2015.6.20)
  initial release

##License
(c) 2015 Yokinsoft Jake.Y.Yoshimura http://www.yo-ki.com
MIT License

https://github.com/JakeJP/FlashAirJS
