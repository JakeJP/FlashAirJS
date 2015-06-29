/**
 * Yokin's FlashAir Javascript client library
 * (c) 2015 Yokinsoft Jake.Y.Yoshimura http://www.yo-ki.com
 *
 * @version 0.9.4
 * @author Yokinsoft Jake.Y.Yoshimura http://www.yo-ki.com
 * @license MIT License
 */
/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="../ts/flashAirTypes.ts" />
/**
 * FlashAir module contains all classes which are needed for FlashAir client access.
 * Only entry point of FlashAir API access is {@link FlashAirClient FlashAir.FlashAirClient} class.
 * @see {@link FlashAirClient}
 * @preferred
 */
module FlashAir {
    /**
     * Options for FlashAirClient constructor.
     * 
     */
    export interface FlashAirClientConfig {
        /**
         * `true` : enable polling with the default interval setting (2 seconds). 
         * 
         * `false` : disables polling.
         * 
         * `number` larger than 0 : sets polling interval in miliseconds.
         */
        polling? : boolean | number;
    }
    /**
     * HTTP client for FlashAir.
     * **Command**, **Config**, **Thumbnail** properties are corresponding to each CGI API on FlashAir.
     * On the creation of this object, some APIs are automatically called to obtain the host version and status.
     * It starts polling automatically soon after the initialization.
     * Polling interval can be specified in constructor's option parameter.
     * Host ( FlashAir network address ) can be provided in the constructor or you can change the host address any time later by calling [`setHostAddress`]{@link setHostAddress}.
     * 
     * ## How to start
     * Instantiating FlashAirClient object is the simplest start.
     * ```
     * var fa = new FlashAir.FlashAirClient();
     * ```
     * Available options are defined in {@link FlashAirClientConfig FlashAirClientConfig}.
     * 
     * ##Events
     * This class supports DOM like event system. Changes of host SD card status and some more can be monitored by handling those events.
     * Event attach/detach methos are just same as jQuery's on/off/once
     * ```
     * var fa = new FlashAir.FlashAirClient();
     * fa.on('fa.hostready', function(){
     *     // custom initialization
     * });
     * ```
     * 
     * 
     * ###```fa.updated```
     * is triggered when /command.cgi?op=121 host timestamp returns updated number. You can take any action like getting a updated file list.
     * 
     * ###```fa.hostchanged```
     * is triggered when the host name or IP address is changing to another. During the initial connection, this event doesn't fire.
     * 
     * ###```fa.hostready```
     * After the initial connection or fireing ```fa.hostchanged```, this class tries to obtain some host status by some API calls.
     * This event is triggered when those initial calls are all done.
     * 
     * ###```fa.hostfailure```
     * After calling [setHostAddress]{@link setHostAddress}, if connection failed, this event is triggered.
     * 
     * ###```fa.polling```
     * reports polling status every *n* milliseconds interval which is configured with options for constructor.
     * The polling status has a status value:
     * ```
     * fa.on('fa.polling', function( status ){
     *     // check the status
     * });
     * ```
     * 
     * status value can be:
     * - **connecting** Trying to connect to the host SD card.
     * - **connected** Connection to the host SD card has been confirmed.
     * - **disconnected**  Connection to the host SD card has been lost.
     * 
     * ###```fa.photosharemode```
     * is triggered when the host SD card is currently in PHOTOSHARE mode.
     *  
     * 
     */
    export class FlashAirClient extends eventEmitter
    {
        /**
         * URL for FlashAir host device like "http://flashair/".
         * url always ends with /.
         */
        baseUrl : string;
        /**
         * This is set when the connecting client has a right mastercode.
         */
        isAdministrator : boolean;
        mastercode : string;
        /**
         * holds current language. This value comes from user's browser's language setting, otherwise is obtained by command.cgi accept language.
         */
        lang: string;
        /**
         * @param urlBase an address to FlashAir host, "http://flashair/". If omitted, proper host address is infered.
         * @param options specify options. Available options are defined in {@link FlashAirClientConfig FlashAirClientConfig}
         */
        constructor(urlBase? : string, options? : FlashAirClientConfig )
        {
            super();
            var me = this;
            me.Command = new Command(this);
            me.Thumbnail = new Thumbnail(this);
            me.Command = new Command(this);
            me.mastercode = sessionStorage.getItem("administrator");
            // options
            me.pollingInterval = !options.polling ? me.pollingInterval :  options.polling === true ? me.pollingInterval : options.polling === false ? 0 : <number>options.polling ;
            this.setHostAddress( urlBase || "", false);
        }
        /**
         * @param newUrl new host URL of FlashAir, which may be like "http://flashair/" or "http://192.168.0.100/"
         * @param verify If true, this method tries to verify the existence of the host address by calling command.cgi
         * @returns jQuery promise object. 
         */
        setHostAddress(newUrl : string, verify : boolean = true ) : JQueryPromise<any>{
            var me = this;
            me.stopPolling();
            if( verify ){
                return $.ajax({
                    url : newUrl + "/command.cgi?op=108&TIME=" + Date.now(),
                    timeout: 3000 
                })
                .done(set)
                .fail(function(){
                    me.onHostFailure();
                })
                .always(function(){
                });
            } else {
                set();
                var d = $.Deferred();
                d.resolve();
                return d;
            }
            function set(){
                if( ! /\/$/.test( this.baseUrl ) ) newUrl = newUrl + "/";
                me.baseUrl = newUrl;
                me.onHostChanged();
                me.initWithHost();
            }
        }
        protected initWithHost()
        {
            var me = this;
            var inits = [];
            inits.push(this.browserLanguage());
            inits.push(
                this.Command.IsPhotoShareEnabled()
                    .done(function(result:boolean){
                         me.photoShareMode = result;
                         me.trigger("fa.photosharemode"); 
                     }));
                
            if (me.mastercode) {
                inits.push( 
                    $.ajax({ type: 'GET', cache: false, url: '/config.cgi?MASTERCODE=' + me.mastercode })
                    .done(function (result) {
                        if (result == "SUCCESS") {
                            // I am administrator
                            $("#setBtn").show();
                            me.isAdministrator = true;
                        }
                    }));
            }
            $.when.apply($,inits)
                .then(function () {
                    me.onHostReady();
                }, function(){
                    me.onHostFailure();
                });
           
        }
        /**
         * represents command.cgi.
         * command.cgi のオブジェクト表現
         */
		Command : Command;
        /**
         * represents thumbnail.cgi
         *  thumbnail.cgi のオブジェクト表現
         */
        Thumbnail : Thumbnail;
        /**
         * represents config.cgi
         * config.cgi のオブジェクト表現
         */
        Config : Config;
        /**
         * represents upload.cgi
         * upload.cgi のオブジェクト表現
         */
        Upload :  Upload;
        /**
         * Not implemented.
         * @param path
         * @returns 
         */
        GetFile( path : string | FileInfo )
        {
            throw "not implemented";
        }
        GetFileUrl( path : string | FileInfo | FileInfoRaw ) : string
        {
            var p : string;
            if( typeof path == "string" ) p = <string> path;
            else p = ( (<FileInfoRaw> path).r_uri || (<FileInfo>path).Directory) + "\\" + ((<FileInfoRaw> path).fname || (<FileInfo> path).Name );
            return this.baseUrl + p.replace("\\", "/");
        }
        protected onHostChanged()
        {
            this.trigger("fa.hostchanged");
        }
        protected onHostReady()
        {
            this.trigger("fa.hostready");    
            this.startPolling();
        }
        protected onHostFailure(){
            this.trigger("fa.hostfailure");
        }
        photoShareMode: boolean;
        // Polling
        //event pollingStatusChanged
        private timer; 
        private timestamp;
        /// milisecond
        private pollingInterval = 2000;
        private _pausePolling = false;
        startPolling() : void {
            if ( ! this.photoShareMode && this.pollingInterval > 0 && !this.timer )  this.poll();
        }
        pausePolling(){ this._pausePolling = true; }
        resumePolling(){ this._pausePolling = false; }
        stopPolling() : void {
            if (this.timer) {
                clearTimeout(this.timer); this.timer = null;
            }
        }
        private poll() {
            var me = this;
            if( me._pausePolling ){
                me.timer = setTimeout( $.proxy( me.poll, me), me.pollingInterval);
                return;
            }
            var eventName = "fa.polling";
            me.trigger(eventName, "connecting");
            this.Command.LastUpdatedTimestamp( this.pollingInterval/3 )
                .done(function (timestamp) {
                    me.trigger(eventName, "connected");
                    if (me.timestamp && timestamp > me.timestamp) {
                        me.trigger("fa.updated");
                    }
                    me.timestamp = timestamp;
                }).fail(function () {
                    me.trigger(eventName, "disconnected");
                }).always(function () {
                    if( me.pollingInterval > 0 ){
                        me.timer = setTimeout( $.proxy( me.poll, me), me.pollingInterval);
                    } else me.timer = null;
                });
        }
        //
        private browserLanguage(){
            var me = this;
            try {
                var lang;
                lang = (navigator.browserLanguage || navigator.language || navigator.userLanguage).substr(0, 2);
    
                if (lang == 'en' ) {
                    return me.Command.AcceptLanguage() // language
                        .done(function (result) {
                            var lang;
                            if (result.substr(17, 2) == 'zh') {
                                lang = result.substr(17, 5);
                                lang = lang.toLowerCase();
    
                                if ((lang == 'zh-cn') || (lang == 'zh-tw')) {
                                    return lang;
                                }
                                else {
                                    lang = result.substr(17, 10);
                                    lang = lang.toLowerCase();
    
                                    if (lang == 'zh-hans-cn') {
                                        lang = 'zh-cn';
                                    }
                                    else if (lang == 'zh-hant-tw') {
                                        lang = 'zh-tw';
                                    }
                                    else {
                                        lang = 'zh';
                                    }
    
                                    return lang;
                                }
                            } else {
                                lang = result.substr(17, 2);
                            }
                            me.lang = lang;
                        });
                } else if (lang == 'zh') {
                    me.lang = (navigator.browserLanguage || navigator.language || navigator.userLanguage);
                } else me.lang = lang;
            }
            catch (e) {
                me.lang = 'en';
            }
            var d = $.Deferred();
            d.resolve();
            return d;
        }
       
    }

    /**
     * base class of CGI.
     * This class contains utility methods for CGI call, HTTP GET/POST etc.
     */
    class CgiHost
    {
        protected Client : FlashAirClient;
        CgiPath : string;
        protected GetBaseUrl(){
            return this.Client.baseUrl;
        }
        /**
         * internal use only
         */
        constructor( fa : FlashAirClient )
        {
            this.Client = fa;
        }
        protected getTimestamp() : number {
            return Date.now();
        }
        /**
         * helper function to call host CGI with GET method
         * @param qs query string with name:value
         * @param ajaxOption 
         */
        protected GetMethod( qs? : Object, ajaxOption? : Object ) : JQueryXHR
        {
            if( qs ) qs["TIME"] = this.getTimestamp();
            var a = {
                type: "GET",
                url: this.GetBaseUrl() + this.CgiPath,
                data: qs
            };
            if( ajaxOption ) $.extend(a, ajaxOption);
            return $.ajax(a);
        }
        private ajax( o ) : JQueryXHR
        {
            return $.ajax(o);
        }
    }
    /**
     * represents /command.cgi API.
     * Every API method is asynchronous with JQueryPromise object. You can get the result in number, string and predefined enum or object
     * by calling .done/fail/always... promise methods.
     * 
     * ###example of listing files
     * 
     * ```
     * var fa = new FlashAir.FlashAirClient();
     * fa.Command.FileList( "/DCIM" )
     *   .done(function (list) {
     *       // list is an array of FlashAir.FileInfoRaw   
     *      
     *   });
     * ```
     */
    class Command extends CgiHost
    {
        CgiPath = "command.cgi";
        /**
         * internal use only
         */
        constructor(fa : FlashAirClient )
        {
			super( fa );
        }
        /**
         * utility method of HTTP GET with explicit `op` number.
         * returned content is parsed as TResult type.
         * @param op `op` number for command.cgi call.
         * @param qs other query strings. op and qs are mixed when it calls command.cgi
         * @returns jQuery promise object.
         */
        protected Get<TResult>(op : number, qs? : Object, ajaxOptions? : Object) : JQueryPromise<any>
        {
            var data = $.extend( {}, qs || {}, {op:op} );
            return this.GetMethod( data, ajaxOptions ).pipe(function(result){ return <TResult> result; } );
        }

        /**
         * regular expression pattern to parse WLANSD_FILELIST which is returned from OP=100 CGI call.
         */
        private static reColumns = /^(.+),(\d+),(\d+),(\d+),(\d+)/;

        /**
         * List files in a directory.
         * ```OP=100&DIR=/DCIM```
         * command.cgi?OP=100 operation.
         * @param dir directory path to list
         * @returns jQuery promise for `FileInfoRaw` 
         */
        FileList(dir : string) : JQueryPromise<FileInfoRaw[]> 
        {
            return this.Get<string>(100, { "DIR" : dir })
                .pipe( function(result){
                    // parse HTML content for the "LIST"
                    dir = dir == "/" ? "" : dir;
                    var lines = result.split(/\r?\n/);
                    if (lines[0] != "WLANSD_FILELIST") throw "First line is not WLANSD_FILELIST.";
                    var list : FileInfoRaw[] = [];
                    for (var i = 1; i < lines.length; i++) {
                        var m = Command.reColumns.exec(lines[i]);
                        if( m){
                            list.push({ r_uri: dir, fname: m[1].substring(dir.length+1), fsize: Number(m[2]), attr: Number(m[3]), fdate: Number(m[4]), ftime: Number(m[5]) });
                        }
                    }
                    return list;
                });
        }
        /**
         * ```op=101&DIR=/DCIM```
         */
        FileCount(dir : String) : JQueryPromise<number>
        {
            return this.Get<number>(101, { "DIR": dir } );
        }
        /**
         * ```op=102```
         */
        IsUpdated() :JQueryPromise<boolean>  {  return this.Get<number>(102).pipe( function(v){ return v == 1}); }
        /**
         * ```op=104```
         */
        NetworkSSID() : JQueryPromise<string> { return this.Get<string>(104); }
        /**
         * ```op=105```
         */
        NetworkPassword() : JQueryPromise<string> { return this.Get<string>(105); }
        /**
         * ```op=106```
         * MACアドレスの取得
         */
        MAC() : JQueryPromise<string> { return this.Get<String>(106); }
        /**
         * ```op=107```
         * ブラウザ言語の取得
         */
        AcceptLanguage() : JQueryPromise<string> { return this.Get<String>(107); }
        /**
         * ```op=108```
         * ファームウェアバージョン情報の取得
         */
        FirmwareVersion() : JQueryPromise<string> { return this.Get<String>(108); }
        /**
         * ```op=109```
         * 制御イメージの取得
         */
        ControlImagePath() : JQueryPromise<string> { return this.Get<string>(109); }
        /**
         * ```op=110```
         * 無線LANモードの取得
         */
        OperationMode() : JQueryPromise<WiFiOperationMode> { return this.Get<WiFiOperationMode>(110); }
        /**
         * ```op=111```
         * 無線LANタイムアウト時間の設定
         */
        DeviceTimeout() : JQueryPromise<number> { return this.Get<number>(111); }
        /**
         * ```op=117```
         * アプリケーション独自情報の取得
         */
        AppCustomInfo() : JQueryPromise<string> { return this.Get<string>(117); }
        /**
         * ```op=118```
         * アップロード機能の有効状態の取得
         */
        UploadEnabled() : JQueryPromise<boolean> { return this.Get<string>(118).pipe(function(v){ v == "1" }); }
        /**
         * ```op=120```
         * CIDの取得
         */
        CID() : JQueryPromise<string> { return this.Get<string>(120); }
        /**
         * ```op=121```
         * アップデート情報の取得 (タイムスタンプ形式)
         * @param timeout timeout of CGI call in millisecond. In purpose of avoiding long lasting connection to CGI server to reduce unnecessary load.
         */
        LastUpdatedTimestamp( timeout?:number ) : JQueryPromise<number> { return this.Get<number>(121, null, {timeout:timeout}); }

        /*
        byte[] ReadExtensionRegisterSingleBlockCommand(int addr, int len)
        {
            throw new NotImplementedException();
        }
        bool WriteExtensionRegisterSingleBlockCommand(int addr, int len, byte[] data)
        {
            throw new NotImplementedException();
        }
        */
        
        GetAvailableSectorInfo() : JQueryPromise<FreeSectorInfo>
        {
            return this.Get<string>(140).pipe(function(result){
                var line = result.split(/[\/\,]/);
                return { Free: parseInt(line[0]), Total: parseInt(line[1]), SectorSize: parseInt(line[2]) };
            });
        }

        TurnOnPhotoShare(dir : string, date : Date ) : JQueryPromise<boolean>
        {
            var qs = {
                "DIR": dir,
                "DATE": FileInfo.DateTimeToFDATE(date)
            };
            return this.Get<String>(200, qs).pipe(function(result){ return result == "OK";});
        }
        TurnOffPhotoShare() : JQueryPromise<boolean>
        {
            return this.Get<String>(201).pipe(function(result){ return result== "OK"; }); 
        }
        IsPhotoShareEnabled() : JQueryPromise<boolean>
        {
            return this.Get<String>(202).pipe(function(result){ return result == "SHAREMODE";}); 
        }
        PhotoShareSSID() : JQueryPromise<string>
        {
            return this.Get<string>(203);
        }
        WebDAVStatus() : JQueryPromise<WebDAVStatus>
        {
            return this.Get<number>(220).pipe(function(result){return result; });
        }
        /// minutes
        TimeZone() : JQueryPromise<number>
        {
            return this.Get<number>(221).pipe(function(result){ return result * 15; });
        }
    }
	class Thumbnail extends CgiHost
    {
        CgiPath = "thumbnail.cgi";
        constructor(fa : FlashAirClient )
        {
			super( fa );
        }
        /**
         * get a URL address for the thumbnail image.
         * @param file FlashAir.FileInfoRaw object which is returned from op=100 call.
         */
        GetUrl(file : FileInfoRaw | string) : string
        {
            if( typeof file == "string ") return this.GetBaseUrl()  + this.CgiPath + "?" + <string> file;
            return this.GetBaseUrl() + this.CgiPath + "?" + (<FileInfoRaw>file).r_uri + "/" + (<FileInfoRaw>file).fname;
        }
        /*
        Get( file : FileInfo | string, exif? : ExifInfo ) 
        {
            return typeof(file) == "string" ? this.Get<Stream>( this.BaseUrl + "?" + path) : this.Get(file.Directory + "/" + file.Name);
        }*/
        /*
            var xWidth = response.Headers.GetValues("X-exif-WIDTH").FirstOrDefault();
            var xHeight = response.Headers.GetValues("X-exif-HEIGHT").FirstOrDefault();
            var xOrientation = response.Headers.GetValues("X-exif-ORIENTATION").FirstOrDefault();
            if( !String.IsNullOrEmpty(xWidth) &&!String.IsNullOrEmpty(xHeight) &&!String.IsNullOrEmpty(xOrientation) )
            {
                exif = new ExifInfo { Height = int.Parse(xHeight), Width = int.Parse(xWidth), Orientation = (ExifOientation)int.Parse(xOrientation) };
            }
            else
            {
                exif = null;
            }
            return response.Content.ReadAsStreamAsync().Result;
        }*/
    }
    interface ConfigDefinition {
        APPINFO? : string;
        APPMODE? : WiFiOperationMode;
        APPNETWORKKEY? : string;
        APPSSID? :string;
        BRGNETWORKKEY? : string;
        BRGSSID? : string;
        CIPATH? : string;
        CLEARCODE? : number;
        TIMEZONE? : number;
        WEBDAV? : WebDAVStatus;
        APPAUTOTIME? : number;
        
    }
    class Config extends CgiHost
    {
        CgiPath = "config.cgi";
        CONFIG : ConfigDefinition = {};
        constructor(fa : FlashAirClient )
        {
			super( fa );
        }
        Get<TResult>( qs ) : JQueryPromise<TResult>
        {
            return this.GetMethod( qs );
        }
        /// <summary>
        /// Configオブジェクトに対して設定した情報を FlashAir にまとめて送信します。
        /// </summary>
        /// <param name="masterCode"></param>
        /// <returns></returns>
        Submit( masterCode : string) : JQueryPromise<boolean>
        {
            this.CONFIG["MASTERCODE"] = masterCode;
            return this.Get<string>(this.CONFIG).pipe(function(result){ return result == "SUCCESS"; });
        }
        /// <summary>
        /// ローカルで設定したCONFIG情報をすべてクリアします。
        /// </summary>
        Clear() : void
        {
            this.CONFIG = {};
        }
        /// <summary>
        /// 無線LAN機能の自動タイムアウト時間を設定します。単位はミリ秒です。 設定可能な値は、60000から4294967294で、デフォルト値は300000(5分)です。
        /// 0を指定すると自動停止しない設定になります。ただし、ホスト機器のスリープでカードへの電源供給が遮断された場合などに、停止することがあります。
        /// </summary>
        /*
        getDeviceTimeout() : TimeSpan {
            return new TimeSpan( GetCONFIG<number>("APPAUTOTIME") );
        }*/
        setDeviceTimeout(value) {
            var ms = value;
            if (ms < 60000 || ms > 4294967294) throw "value must be between 60000 and 4294967294.";
            this.CONFIG.APPAUTOTIME = ms;
        }
        /*
        // CONFIG entries
        GetCONFIG<TResult>( key : string ) : TResult { return <TResult>this.CONFIG[key]; }
        get AppCustomInfo() { return this.CONFIG["APPINFO"]; } set AppCustomInfo(value){ this.CONFIG["APPINFO"] = value; }
        get OperationMode() : WiFiOperationMode { return this.CONFIG["APPMODE"]; } set OperationMode(value){ this.CONFIG["APPMODE"] = Number(value); }
        get NetworkPassword() :string { return this.CONFIG["APPNETWORKKEY"]; } set NetworkPassword(value) { this.CONFIG["APPNETWORKKEY"] = value; }
        get NetworkSSID() : string { return this.CONFIG["APPSSID"]; } set NetworkSSID(value){ this.CONFIG["APPSSID"] = value; }
        get BridgeNetworkPassword() : string { return this.CONFIG["BRGNETWORKKEY"]; } set BridgeNetworkPassword(value){ this.CONFIG["BRGNETWORKKEY"] = value; }
        get BridgeNetworkSSID() : string  { return this.CONFIG["BRGSSID"]; } set BridgeNetworkSSID(value) { this.CONFIG["BRGSSID"] = value; }
        get ControlImagePath() : string { return this.CONFIG["CIPATH"]; } set ControlImagePath(value){ this.CONFIG["CIPATH"] = value; }
        get ClearMasterCode() : boolean { return this.CONFIG["CLEARCODE"] == "1"; } set ClearMasterCode(value) { this.CONFIG["CLEARCODE"] = value ? "1" : ""; }
        get TimeZone() : TimeSpan { return TimeSpan.FromMinutes( this.GetCONFIG<number>("TIMEZONE") * 15); } set TimeZone(value) { this.CONFIG["TIMEZONE"] = Math.floor(( value.TotalMinutes / 15 )); }
        get WebDAVStatus() : WebDAVStatus { return this.GetCONFIG<number>("WEBDAV"); } set WebDAVStatus(value){ this.CONFIG["WEBDAV"] = value; }
        */
        //public String MasterCode { get { return CONFIG["APPINFO"]; } set { CONFIG["APPINFO"] = value; } }

    }
	
    class Upload extends CgiHost
    {
        constructor(fa : FlashAirClient )
        {
			super( fa );
        }
/*
        UploadFile( fileStream : Stream, filename : string )
        {
            throw "not implemented."
        }
        DeleteFile( path : string )
        {
            return this.Get<string>( { "DEL" : path } ) == "SUCCESS";
        }
        SetUploadDirectory( dir : string )
        {
            return this.Get<string>( { "UPDIR" : dir } ) == "SUCCESS";
        }
        SetSystemTime( time : Date )
        {
            return this.Get<string>( { "FTIME" : "0x" + ((FileInfo.DateTimeToFDATE(time) << 16) + FileInfo.DateTimeToFTIME(time)).ToString("X") } ) == "SUCCESS";
        }
        SetWriteProtect()
        {
            return this.Get<string>( { "WRITEPROTECT" : "ON" } ) == "SUCCESS";
        }
    */
    }
}
 

