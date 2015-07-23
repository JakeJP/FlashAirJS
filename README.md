FlashAir Javascript Client Library
===================

TOSHIBA FlashAir(TM) is a SD memory card which is capable of serving the contents of SD memory card to the remote devices through WiFi. Connection methods are prepared in several ways.

1. Direct access form web browser. Any modern web browsers can browse the files in directories by typing the host URL( http://flashair/ )
2. API access. FlashAir also provides API as a form of CGI calls. This is the method that this library utilizes.



- supports FlashAir(TM) TOSHIBA, WiFi capable SD memory card.
- wraps all CGI calls, HTTP connections and change notifications.
- available in TypeScript(ts), Javascript(js) compatible with ECMAScript 3
- only depends on jQuery (for ajax connection and deferred handling)
- free to use and reuse under MIT license

#Simply to use
**./js** directory contains compiled javascript files in 2 styles.

-  **flashAirClient.js**   Non-minified version javascript file, which is compiled from TypeScript source files.
- **flashAirClient.min.js**  minified version of `flashAirClient.js` . Source map file is available in conjunction with this.

Include jQuery and `flashAirClient.js` file in your project.

The simplest example is like this
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

API documentation is located under **doc** directory.

#How to compile TypeScript source files

**gulp** to compile TypeScript source files.

####Requirement
- **NodeJS** anyways.
- **tsd** can be installed by `npm install -g tsd`

####install node modules. 
```
npm install
```
####install TypeScript definition files ( just for jquery )
```
tsd update
```

####gulp to compile **ts** sources and **doc** files.
```
gulp
```

## Applications
Applications that use this library are published:

- **Yokin's FlashAir Sync for Google Chrome**.  Auto downloader software that runs on Windows, Linux, ChromeOS and Mac OS X where Google Chrome is already installed. https://chrome.google.com/webstore/detail/yokins-flashair-sync/cmeohdjjopjjlfbiegcikeiioanainmb
- **Yokin's FlashAir Sync for Windows Store**. The same application for Windows 8.1, Windows 10 Store App. https://www.microsoft.com/store/apps/yokins-flashair-sync/9nblggh1mtvm
- **List.htm customization**. You can customize the web browser design by placing List.htm in a hidden directory of FlashAir SD. https://github.com/JakeJP/FlashAirList

##Compatilibity
Tested with FlashAir(TM) model W-03.

##Version History

- 0.9.5 to make v1 firmware compatible.
- 0.9.4 (2015.6.20)
  initial release

##License
(c) 2015 Yokinsoft Jake.Y.Yoshimura http://www.yo-ki.com
MIT License

https://github.com/JakeJP/FlashAirJS
