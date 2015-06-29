FlashAir Javascript client library
===================
- supports FlashAir(TM) TOSHIBA, WiFi capable SD memory card.
- compatible with ECMAScript 3
- wraps HTTP and CGI calls as class methods.
- written in TypeScript(.ts) and also available compiled results in .js files.
- library depends on jQuery (ajax connection and deferred handling)
- free to use and reuse under MIT license

## What you need.

#### jquery

#### flashAirClient.js (flashAirClient.min.js )

- contains definitions for predefined values and enum values for CGI access.
- wrapping ajax(http) calls with easy-to-read method calls and structured returned values.
- command results are returned asynchronously by jQueryPromise object.
- event notifies connection status, host change (update) and others
-  can dynamically change and switch host

## Get started!
After including jQuery, only starting point is {@link FlashAirClient FlashAir.FlashAirClient} class.

## Examples
Simple use in HTML
```
<script src="js/jquery-[version].js"></script>
<script src="js/flashAirClient.js"></script>
<script>
	var fa = new FlashAir.FlashAirClient("http://flashair/");
	// ... API calls
</script>
```

Just to list all files in the root directory
```ts
var fa = new FlashAir.FlashAirClient("http://flashair/");
fa.Command.FileList("/")
.done( function(list){
	$.each(list, function(i, file){
		console.log( file );
		// file is in a form of FileInfoRaw { r_uri, fname, ... }
	});
});
```
monitor file and directory changes
```ts
var fa = new FlashAir.FlashAirClient("http://flashair/");
fa.on('fa.updated', function(){
	// SD card status has been changed. Do something.
});
```

##Compatilibity
Tested with FlashAir(TM) model W-03.

##Version History

-  0.9.4 (2015.6.20)
  initial release

##License
(c) 2015 Yokinsoft Jake.Y.Yoshimura http://www.yo-ki.com
MIT License

https://github.com/JakeJP/FlashAirApp
