/**
 * Yokin's FlashAir Javascript client library
 * (c) 2015 Yokinsoft Jake.Y.Yoshimura http://www.yo-ki.com
 *
 * @version 0.9.4
 * @author Yokinsoft Jake.Y.Yoshimura
 * @license MIT License
 */
var FlashAir;
(function (FlashAir) {
    (function (FileAttribute) {
        FileAttribute[FileAttribute["ReadOnly"] = 1] = "ReadOnly";
        FileAttribute[FileAttribute["Hidden"] = 2] = "Hidden";
        FileAttribute[FileAttribute["System"] = 4] = "System";
        FileAttribute[FileAttribute["Volume"] = 8] = "Volume";
        FileAttribute[FileAttribute["Directory"] = 16] = "Directory";
        FileAttribute[FileAttribute["Archive"] = 32] = "Archive";
    })(FlashAir.FileAttribute || (FlashAir.FileAttribute = {}));
    var FileAttribute = FlashAir.FileAttribute;
    /**
     * Class expression of FileInfoRaw. Extra useful methods are available.
     */
    var FileInfo = (function () {
        function FileInfo() {
        }
        FileInfo.prototype.Directory = function () {
            return this.r_uri;
        };
        FileInfo.prototype.Name = function () {
            return this.fname;
        };
        FileInfo.prototype.Size = function () {
            return this.fsize;
        };
        FileInfo.prototype.Time = function () {
            return FileInfo.FTIMEtoDateTime(this.fdate, this.ftime);
        };
        FileInfo.prototype.Attributes = function () {
            return this.attr;
        };
        FileInfo.prototype.IsDirectory = function () {
            return !!(this.attr & 16 /* Directory */);
        };
        /**
         * convert FDATE, FTIME internal datetime value to javascript Date object.
         *
         * FlashAir 内部形式の FDATE FTIME を Date オブジェクトに変換します。
         */
        FileInfo.FTIMEtoDateTime = function (_date, _time) {
            return new Date(1980 + ((_date >> 9) & 0x7F), ((_date >> 5) & 0xF) - 1, _date & 0x1F, (_time >> 11) & 0x1F, (_time >> 5) & 0x3F, (_time << 1) & 0x3F);
        };
        /**
         * convert javascript Date object to internal FDATE format.
         *
         * Javascript の Date を FDATE 数値形式に変換します。
         */
        FileInfo.DateTimeToFDATE = function (date) {
            return (((date.getUTCFullYear() - 1980) << 9) + ((date.getMonth() - 1) << 5) + date.getDay());
        };
        /**
         * convert javascript Date object to internal FTIME format.
         *
         * Javascript の Date を FTIME 数値形式に変換します。
         */
        FileInfo.DateTimeToFTIME = function (date) {
            return (date.getHours() << 11) + (date.getMinutes() << 5) + (date.getSeconds() >> 1);
        };
        return FileInfo;
    })();
    FlashAir.FileInfo = FileInfo;
    (function (WebDAVStatus) {
        WebDAVStatus[WebDAVStatus["Disabled"] = 0] = "Disabled";
        WebDAVStatus[WebDAVStatus["ReadOnly"] = 1] = "ReadOnly";
        WebDAVStatus[WebDAVStatus["ReadWrite"] = 2] = "ReadWrite";
    })(FlashAir.WebDAVStatus || (FlashAir.WebDAVStatus = {}));
    var WebDAVStatus = FlashAir.WebDAVStatus;
    (function (ExifOientation) {
        ExifOientation[ExifOientation["Horizontal"] = 1] = "Horizontal";
        ExifOientation[ExifOientation["MirrorHorizontal"] = 2] = "MirrorHorizontal";
        ExifOientation[ExifOientation["Rotate180"] = 3] = "Rotate180";
        ExifOientation[ExifOientation["MirrorVertical"] = 4] = "MirrorVertical";
        ExifOientation[ExifOientation["MirrorHhorizontalAndRotate270CW"] = 5] = "MirrorHhorizontalAndRotate270CW";
        ExifOientation[ExifOientation["Rotate90CW"] = 6] = "Rotate90CW";
        ExifOientation[ExifOientation["MirrorHorizontalAndRotate90CW"] = 7] = "MirrorHorizontalAndRotate90CW";
        ExifOientation[ExifOientation["Rotate270CW"] = 8] = "Rotate270CW"; // => 'Rotate 270 CW',
    })(FlashAir.ExifOientation || (FlashAir.ExifOientation = {}));
    var ExifOientation = FlashAir.ExifOientation;
    (function (WiFiOperationMode) {
        /**
         *  「無線起動画面」のライトプロテクト解除操作で無線LAN機能を起動します。無線LANモードはAPモードです。
         */
        WiFiOperationMode[WiFiOperationMode["AccessPointDeferred"] = 0] = "AccessPointDeferred";
        /**
         *  「無線起動画面」のライトプロテクト解除操作で無線LAN機能を起動します。無線LANモードはSTAモードです。
         */
        WiFiOperationMode[WiFiOperationMode["StationDeferred"] = 2] = "StationDeferred";
        /**
         *  「無線起動画面」のライトプロテクト解除操作で無線LAN機能を起動します。無線LANモードはインターネット同時接続モードです。 (ファームウェア 2.00.02以上)
         */
        WiFiOperationMode[WiFiOperationMode["BridgeDeferred"] = 3] = "BridgeDeferred";
        /**
         * 	カード電源投入時に無線LAN機能を起動します。無線LANモードはAPモードです。
         */
        WiFiOperationMode[WiFiOperationMode["AccessPoint"] = 4] = "AccessPoint";
        /**
         *  カード電源投入時に無線LAN機能を起動します。無線LANモードはSTAモードです。
         */
        WiFiOperationMode[WiFiOperationMode["Station"] = 5] = "Station";
        /**
         *  カード電源投入時に無線LAN機能を起動します。無線LANモードはインターネット同時接続モードです。 (ファームウェア 2.00.02以上)
         */
        WiFiOperationMode[WiFiOperationMode["Bridge"] = 6] = "Bridge";
    })(FlashAir.WiFiOperationMode || (FlashAir.WiFiOperationMode = {}));
    var WiFiOperationMode = FlashAir.WiFiOperationMode;
    /**
     * internal use only.
     * to make class object event emittable.
     */
    var eventEmitter = (function () {
        function eventEmitter() {
        }
        eventEmitter.prototype.on = function (event, fn) {
            this._callbacks = this._callbacks || {};
            (this._callbacks[event] = this._callbacks[event] || []).push(fn);
            return this;
        };
        eventEmitter.prototype.addEventListener = function (event, fn) {
        };
        eventEmitter.prototype.once = function (event, fn) {
            function on() {
                this.off(event, on);
                fn.apply(this, arguments);
            }
            this.on(event, on);
            return this;
        };
        eventEmitter.prototype.off = function (event, fn) {
            this._callbacks = this._callbacks || {};
            // all
            if (0 == arguments.length) {
                this._callbacks = {};
                return this;
            }
            // specific event
            var callbacks = this._callbacks[event];
            if (!callbacks)
                return this;
            // remove all handlers
            if (1 == arguments.length) {
                delete this._callbacks[event];
                return this;
            }
            // remove specific handler
            var cb;
            for (var i = 0; i < callbacks.length; i++) {
                cb = callbacks[i];
                if (cb === fn || cb.fn === fn) {
                    callbacks.splice(i, 1);
                    break;
                }
            }
            return this;
        };
        eventEmitter.prototype.removeListener = function (event, fn) {
        };
        eventEmitter.prototype.removeAllListeners = function (event, fn) {
        };
        eventEmitter.prototype.removeEventListener = function (event, fn) {
        };
        eventEmitter.prototype.trigger = function (event) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            this._callbacks = this._callbacks || {};
            var callbacks = this._callbacks[event];
            if (callbacks) {
                callbacks = callbacks.slice(0);
                for (var i = 0, len = callbacks.length; i < len; ++i) {
                    callbacks[i].apply(this, args);
                }
            }
            return this;
        };
        return eventEmitter;
    })();
    FlashAir.eventEmitter = eventEmitter;
    eventEmitter.prototype.addEventListener = eventEmitter.prototype.on;
    eventEmitter.prototype.removeListener = eventEmitter.prototype.removeAllListeners = eventEmitter.prototype.removeEventListener = eventEmitter.prototype.off;
})(FlashAir || (FlashAir = {}));
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/**
 * Yokin's FlashAir Javascript client library
 * (c) 2015 Yokinsoft Jake.Y.Yoshimura http://www.yo-ki.com
 *
 * @version 0.9.4
 * @author Yokinsoft Jake.Y.Yoshimura http://www.yo-ki.com
 * @license MIT License
 */
/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="./flashAirTypes.ts" />
/**
 * FlashAir module contains all classes which are needed for FlashAir client access.
 * Only entry point of FlashAir API access is {@link FlashAirClient FlashAir.FlashAirClient} class.
 * @see {@link FlashAirClient}
 * @preferred
 */
var FlashAir;
(function (FlashAir) {
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
    var FlashAirClient = (function (_super) {
        __extends(FlashAirClient, _super);
        /**
         * @param urlBase an address to FlashAir host, "http://flashair/". If omitted, proper host address is infered.
         * @param options specify options. Available options are defined in {@link FlashAirClientConfig FlashAirClientConfig}
         */
        function FlashAirClient(urlBase, options) {
            _super.call(this);
            /// milisecond
            this.pollingInterval = 2000;
            this._pausePolling = false;
            var me = this;
            me.Command = new Command(this);
            me.Thumbnail = new Thumbnail(this);
            me.Config = new Config(this);
            me.Upload = new Upload(this);
            me.mastercode = sessionStorage.getItem("administrator");
            // options
            me.pollingInterval = !options.polling ? me.pollingInterval : options.polling === true ? me.pollingInterval : options.polling === false ? 0 : options.polling;
            this.setHostAddress(urlBase || "", false);
        }
        /**
         * @param newUrl new host URL of FlashAir, which may be like "http://flashair/" or "http://192.168.0.100/"
         * @param verify If true, this method tries to verify the existence of the host address by calling command.cgi
         * @returns jQuery promise object.
         */
        FlashAirClient.prototype.setHostAddress = function (newUrl, verify) {
            if (verify === void 0) { verify = true; }
            var me = this;
            me.stopPolling();
            if (verify) {
                return $.ajax({
                    url: newUrl + "/command.cgi?op=108&TIME=" + Date.now(),
                    timeout: 3000
                }).done(set).fail(function () {
                    me.onHostFailure();
                }).always(function () {
                });
            }
            else {
                set();
                var d = $.Deferred();
                d.resolve();
                return d;
            }
            function set() {
                if (!/\/$/.test(this.baseUrl))
                    newUrl = newUrl + "/";
                me.baseUrl = newUrl;
                me.onHostChanged();
                me.initWithHost();
            }
        };
        FlashAirClient.prototype.initWithHost = function () {
            var me = this;
            var inits = [];
            inits.push(this.browserLanguage());
            inits.push(this.Command.IsPhotoShareEnabled().done(function (result) {
                me.photoShareMode = result;
                me.trigger("fa.photosharemode");
            }));
            if (me.mastercode) {
                inits.push($.ajax({ type: 'GET', cache: false, url: '/config.cgi?MASTERCODE=' + me.mastercode }).done(function (result) {
                    if (result == "SUCCESS") {
                        // I am administrator
                        $("#setBtn").show();
                        me.isAdministrator = true;
                    }
                }));
            }
            $.when.apply($, inits).then(function () {
                me.onHostReady();
            }, function () {
                me.onHostFailure();
            });
        };
        /**
         * Not implemented.
         * @param path
         * @returns
         */
        FlashAirClient.prototype.GetFile = function (path) {
            throw "not implemented";
        };
        FlashAirClient.prototype.GetFileUrl = function (path) {
            var p;
            if (typeof path == "string")
                p = path;
            else
                p = (path.r_uri || path.Directory) + "\\" + (path.fname || path.Name);
            return this.baseUrl + p.replace("\\", "/");
        };
        FlashAirClient.prototype.onHostChanged = function () {
            this.trigger("fa.hostchanged");
        };
        FlashAirClient.prototype.onHostReady = function () {
            this.trigger("fa.hostready");
            this.startPolling();
        };
        FlashAirClient.prototype.onHostFailure = function () {
            this.trigger("fa.hostfailure");
        };
        FlashAirClient.prototype.startPolling = function () {
            if (!this.photoShareMode && this.pollingInterval > 0 && !this.timer)
                this.poll();
        };
        FlashAirClient.prototype.pausePolling = function () {
            this._pausePolling = true;
        };
        FlashAirClient.prototype.resumePolling = function () {
            this._pausePolling = false;
        };
        FlashAirClient.prototype.stopPolling = function () {
            if (this.timer) {
                clearTimeout(this.timer);
                this.timer = null;
            }
        };
        FlashAirClient.prototype.poll = function () {
            var me = this;
            if (me._pausePolling) {
                me.timer = setTimeout($.proxy(me.poll, me), me.pollingInterval);
                return;
            }
            var eventName = "fa.polling";
            me.trigger(eventName, "connecting");
            this.Command.LastUpdatedTimestamp(this.pollingInterval / 3).done(function (timestamp) {
                me.trigger(eventName, "connected");
                if (me.timestamp && timestamp > me.timestamp) {
                    me.trigger("fa.updated");
                }
                me.timestamp = timestamp;
            }).fail(function () {
                me.trigger(eventName, "disconnected");
            }).always(function () {
                if (me.pollingInterval > 0) {
                    me.timer = setTimeout($.proxy(me.poll, me), me.pollingInterval);
                }
                else
                    me.timer = null;
            });
        };
        //
        FlashAirClient.prototype.browserLanguage = function () {
            var me = this;
            try {
                var lang;
                lang = (navigator.browserLanguage || navigator.language || navigator.userLanguage).substr(0, 2);
                if (lang == 'en') {
                    return me.Command.AcceptLanguage().done(function (result) {
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
                        }
                        else {
                            lang = result.substr(17, 2);
                        }
                        me.lang = lang;
                    });
                }
                else if (lang == 'zh') {
                    me.lang = (navigator.browserLanguage || navigator.language || navigator.userLanguage);
                }
                else
                    me.lang = lang;
            }
            catch (e) {
                me.lang = 'en';
            }
            var d = $.Deferred();
            d.resolve();
            return d;
        };
        return FlashAirClient;
    })(FlashAir.eventEmitter);
    FlashAir.FlashAirClient = FlashAirClient;
    /**
     * base class of CGI.
     * This class contains utility methods for CGI call, HTTP GET/POST etc.
     */
    var CgiHost = (function () {
        /**
         * internal use only
         */
        function CgiHost(fa) {
            this.Client = fa;
        }
        CgiHost.prototype.GetBaseUrl = function () {
            return this.Client.baseUrl;
        };
        CgiHost.prototype.getTimestamp = function () {
            return Date.now();
        };
        /**
         * helper function to call host CGI with GET method
         * @param qs query string with name:value
         * @param ajaxOption
         */
        CgiHost.prototype.GetMethod = function (qs, ajaxOption) {
            if (qs)
                qs["TIME"] = this.getTimestamp();
            var a = {
                type: "GET",
                url: this.GetBaseUrl() + this.CgiPath,
                data: qs
            };
            if (ajaxOption)
                $.extend(a, ajaxOption);
            return $.ajax(a);
        };
        CgiHost.prototype.ajax = function (o) {
            return $.ajax(o);
        };
        return CgiHost;
    })();
    FlashAir.CgiHost = CgiHost;
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
    var Command = (function (_super) {
        __extends(Command, _super);
        /**
         * internal use only
         */
        function Command(fa) {
            _super.call(this, fa);
            this.CgiPath = "command.cgi";
        }
        /**
         * utility method of HTTP GET with explicit `op` number.
         * returned content is parsed as TResult type.
         * @param op `op` number for command.cgi call.
         * @param qs other query strings. op and qs are mixed when it calls command.cgi
         * @returns jQuery promise object.
         */
        Command.prototype.Get = function (op, qs, ajaxOptions) {
            var data = $.extend({}, qs || {}, { op: op });
            return this.GetMethod(data, ajaxOptions).pipe(function (result) {
                return result;
            });
        };
        /**
         * List files in a directory.
         * ```OP=100&DIR=/DCIM```
         * command.cgi?OP=100 operation.
         * @param dir directory path to list
         * @returns jQuery promise for `FileInfoRaw`
         */
        Command.prototype.FileList = function (dir) {
            return this.Get(100, { "DIR": dir }).pipe(function (result) {
                // parse HTML content for the "LIST"
                dir = dir == "/" ? "" : dir;
                var lines = result.split(/\r?\n/);
                if (lines[0] != "WLANSD_FILELIST")
                    throw "First line is not WLANSD_FILELIST.";
                var list = [];
                for (var i = 1; i < lines.length; i++) {
                    var m = Command.reColumns.exec(lines[i]);
                    if (m) {
                        list.push({ r_uri: dir, fname: m[1].substring(dir.length + 1), fsize: Number(m[2]), attr: Number(m[3]), fdate: Number(m[4]), ftime: Number(m[5]) });
                    }
                }
                return list;
            });
        };
        /**
         * ```op=101&DIR=/DCIM```
         */
        Command.prototype.FileCount = function (dir) {
            return this.Get(101, { "DIR": dir });
        };
        /**
         * ```op=102```
         */
        Command.prototype.IsUpdated = function () {
            return this.Get(102).pipe(function (v) {
                return v == 1;
            });
        };
        /**
         * ```op=104```
         */
        Command.prototype.NetworkSSID = function () {
            return this.Get(104);
        };
        /**
         * ```op=105```
         */
        Command.prototype.NetworkPassword = function () {
            return this.Get(105);
        };
        /**
         * ```op=106```
         * MACアドレスの取得
         */
        Command.prototype.MAC = function () {
            return this.Get(106);
        };
        /**
         * ```op=107```
         * ブラウザ言語の取得
         */
        Command.prototype.AcceptLanguage = function () {
            return this.Get(107);
        };
        /**
         * ```op=108```
         * ファームウェアバージョン情報の取得
         */
        Command.prototype.FirmwareVersion = function () {
            return this.Get(108);
        };
        /**
         * ```op=109```
         * 制御イメージの取得
         */
        Command.prototype.ControlImagePath = function () {
            return this.Get(109);
        };
        /**
         * ```op=110```
         * 無線LANモードの取得
         */
        Command.prototype.OperationMode = function () {
            return this.Get(110);
        };
        /**
         * ```op=111```
         * 無線LANタイムアウト時間の設定
         */
        Command.prototype.DeviceTimeout = function () {
            return this.Get(111);
        };
        /**
         * ```op=117```
         * アプリケーション独自情報の取得
         */
        Command.prototype.AppCustomInfo = function () {
            return this.Get(117);
        };
        /**
         * ```op=118```
         * アップロード機能の有効状態の取得
         */
        Command.prototype.UploadEnabled = function () {
            return this.Get(118).pipe(function (v) {
                v == "1";
            });
        };
        /**
         * ```op=120```
         * CIDの取得
         */
        Command.prototype.CID = function () {
            return this.Get(120);
        };
        /**
         * ```op=121```
         * アップデート情報の取得 (タイムスタンプ形式)
         * @param timeout timeout of CGI call in millisecond. In purpose of avoiding long lasting connection to CGI server to reduce unnecessary load.
         */
        Command.prototype.LastUpdatedTimestamp = function (timeout) {
            return this.Get(121, null, { timeout: timeout });
        };
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
        Command.prototype.GetAvailableSectorInfo = function () {
            return this.Get(140).pipe(function (result) {
                var line = result.split(/[\/\,]/);
                return { Free: parseInt(line[0]), Total: parseInt(line[1]), SectorSize: parseInt(line[2]) };
            });
        };
        Command.prototype.TurnOnPhotoShare = function (dir, date) {
            var qs = {
                "DIR": dir,
                "DATE": FlashAir.FileInfo.DateTimeToFDATE(date)
            };
            return this.Get(200, qs).pipe(function (result) {
                return result == "OK";
            });
        };
        Command.prototype.TurnOffPhotoShare = function () {
            return this.Get(201).pipe(function (result) {
                return result == "OK";
            });
        };
        Command.prototype.IsPhotoShareEnabled = function () {
            return this.Get(202).pipe(function (result) {
                return result == "SHAREMODE";
            });
        };
        Command.prototype.PhotoShareSSID = function () {
            return this.Get(203);
        };
        Command.prototype.WebDAVStatus = function () {
            return this.Get(220).pipe(function (result) {
                return result;
            });
        };
        /// minutes
        Command.prototype.TimeZone = function () {
            return this.Get(221).pipe(function (result) {
                return result * 15;
            });
        };
        /**
         * regular expression pattern to parse WLANSD_FILELIST which is returned from OP=100 CGI call.
         */
        Command.reColumns = /^(.+),(\d+),(\d+),(\d+),(\d+)/;
        return Command;
    })(CgiHost);
    FlashAir.Command = Command;
    var Thumbnail = (function (_super) {
        __extends(Thumbnail, _super);
        function Thumbnail(fa) {
            _super.call(this, fa);
            this.CgiPath = "thumbnail.cgi";
        }
        /**
         * get a URL address for the thumbnail image.
         * @param file FlashAir.FileInfoRaw object which is returned from op=100 call.
         */
        Thumbnail.prototype.GetUrl = function (file) {
            if (typeof file == "string ")
                return this.GetBaseUrl() + this.CgiPath + "?" + file;
            return this.GetBaseUrl() + this.CgiPath + "?" + file.r_uri + "/" + file.fname;
        };
        return Thumbnail;
    })(CgiHost);
    FlashAir.Thumbnail = Thumbnail;
    var Config = (function (_super) {
        __extends(Config, _super);
        function Config(fa) {
            _super.call(this, fa);
            this.CgiPath = "config.cgi";
            this.CONFIG = {};
        }
        Config.prototype.Get = function (qs) {
            return this.GetMethod(qs);
        };
        /// <summary>
        /// Configオブジェクトに対して設定した情報を FlashAir にまとめて送信します。
        /// </summary>
        /// <param name="masterCode"></param>
        /// <returns></returns>
        Config.prototype.Submit = function (masterCode) {
            this.CONFIG["MASTERCODE"] = masterCode;
            return this.Get(this.CONFIG).pipe(function (result) {
                return result == "SUCCESS";
            });
        };
        /// <summary>
        /// ローカルで設定したCONFIG情報をすべてクリアします。
        /// </summary>
        Config.prototype.Clear = function () {
            this.CONFIG = {};
        };
        /// <summary>
        /// 無線LAN機能の自動タイムアウト時間を設定します。単位はミリ秒です。 設定可能な値は、60000から4294967294で、デフォルト値は300000(5分)です。
        /// 0を指定すると自動停止しない設定になります。ただし、ホスト機器のスリープでカードへの電源供給が遮断された場合などに、停止することがあります。
        /// </summary>
        /*
        getDeviceTimeout() : TimeSpan {
            return new TimeSpan( GetCONFIG<number>("APPAUTOTIME") );
        }*/
        Config.prototype.setDeviceTimeout = function (value) {
            var ms = value;
            if (ms < 60000 || ms > 4294967294)
                throw "value must be between 60000 and 4294967294.";
            this.CONFIG.APPAUTOTIME = ms;
        };
        return Config;
    })(CgiHost);
    FlashAir.Config = Config;
    var Upload = (function (_super) {
        __extends(Upload, _super);
        function Upload(fa) {
            _super.call(this, fa);
        }
        return Upload;
    })(CgiHost);
    FlashAir.Upload = Upload;
})(FlashAir || (FlashAir = {}));
