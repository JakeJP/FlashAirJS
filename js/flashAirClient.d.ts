/// <reference path="typings/jquery/jquery.d.ts" />
/**
 * Yokin's FlashAir Javascript client library
 * (c) 2015 Yokinsoft Jake.Y.Yoshimura http://www.yo-ki.com
 *
 * @version 0.9.4
 * @author Yokinsoft Jake.Y.Yoshimura
 * @license MIT License
 */
declare module FlashAir {
    enum FileAttribute {
        ReadOnly = 1,
        Hidden = 2,
        System = 4,
        Volume = 8,
        Directory = 16,
        Archive = 32,
    }
    /**
     * Raw file data from FlashAir host which is given in `wlansd` global array object in *List.htm*.
     * This is also a container of the data returned by `command.cgi?op=100` call, where CSV format is converted in to this interface.
     */
    interface FileInfoRaw {
        r_uri: string;
        fname: string;
        fsize: number;
        attr: number;
        fdate: number;
        ftime: number;
    }
    /**
     * Class expression of FileInfoRaw. Extra useful methods are available.
     */
    class FileInfo implements FileInfoRaw {
        r_uri: string;
        fname: string;
        fsize: number;
        attr: number;
        fdate: number;
        ftime: number;
        Directory(): string;
        Name(): string;
        Size(): number;
        Time(): Date;
        Attributes(): FileAttribute;
        IsDirectory(): boolean;
        /**
         * convert FDATE, FTIME internal datetime value to javascript Date object.
         *
         * FlashAir 内部形式の FDATE FTIME を Date オブジェクトに変換します。
         */
        static FTIMEtoDateTime(_date: number, _time: number): Date;
        /**
         * convert javascript Date object to internal FDATE format.
         *
         * Javascript の Date を FDATE 数値形式に変換します。
         */
        static DateTimeToFDATE(date: Date): number;
        /**
         * convert javascript Date object to internal FTIME format.
         *
         * Javascript の Date を FTIME 数値形式に変換します。
         */
        static DateTimeToFTIME(date: Date): number;
    }
    interface FreeSectorInfo {
        Free: number;
        Total: number;
        SectorSize: number;
    }
    enum WebDAVStatus {
        Disabled = 0,
        ReadOnly = 1,
        ReadWrite = 2,
    }
    interface ExifInfo {
        Width: number;
        Height: number;
        Orientation: ExifOientation;
    }
    enum ExifOientation {
        Horizontal = 1,
        MirrorHorizontal = 2,
        Rotate180 = 3,
        MirrorVertical = 4,
        MirrorHhorizontalAndRotate270CW = 5,
        Rotate90CW = 6,
        MirrorHorizontalAndRotate90CW = 7,
        Rotate270CW = 8,
    }
    enum WiFiOperationMode {
        /**
         *  「無線起動画面」のライトプロテクト解除操作で無線LAN機能を起動します。無線LANモードはAPモードです。
         */
        AccessPointDeferred = 0,
        /**
         *  「無線起動画面」のライトプロテクト解除操作で無線LAN機能を起動します。無線LANモードはSTAモードです。
         */
        StationDeferred = 2,
        /**
         *  「無線起動画面」のライトプロテクト解除操作で無線LAN機能を起動します。無線LANモードはインターネット同時接続モードです。 (ファームウェア 2.00.02以上)
         */
        BridgeDeferred = 3,
        /**
         * 	カード電源投入時に無線LAN機能を起動します。無線LANモードはAPモードです。
         */
        AccessPoint = 4,
        /**
         *  カード電源投入時に無線LAN機能を起動します。無線LANモードはSTAモードです。
         */
        Station = 5,
        /**
         *  カード電源投入時に無線LAN機能を起動します。無線LANモードはインターネット同時接続モードです。 (ファームウェア 2.00.02以上)
         */
        Bridge = 6,
    }
    /**
     * internal use only.
     * to make class object event emittable.
     */
    class eventEmitter {
        private _callbacks;
        on(event: any, fn: any): eventEmitter;
        addEventListener(event: any, fn: any): void;
        once(event: any, fn: any): eventEmitter;
        off(event: any, fn: any): eventEmitter;
        removeListener(event: any, fn: any): void;
        removeAllListeners(event: any, fn: any): void;
        removeEventListener(event: any, fn: any): void;
        trigger(event: any, ...args: any[]): eventEmitter;
    }
}
/**
 * Yokin's FlashAir Javascript client library
 * (c) 2015 Yokinsoft Jake.Y.Yoshimura http://www.yo-ki.com
 *
 * @version 0.9.4
 * @author Yokinsoft Jake.Y.Yoshimura http://www.yo-ki.com
 * @license MIT License
 */
/**
 * FlashAir module contains all classes which are needed for FlashAir client access.
 * Only entry point of FlashAir API access is {@link FlashAirClient FlashAir.FlashAirClient} class.
 * @see {@link FlashAirClient}
 * @preferred
 */
declare module FlashAir {
    /**
     * Options for FlashAirClient constructor.
     *
     */
    interface FlashAirClientConfig {
        /**
         * `true` : enable polling with the default interval setting (2 seconds).
         *
         * `false` : disables polling.
         *
         * `number` larger than 0 : sets polling interval in miliseconds.
         */
        polling?: boolean | number;
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
    class FlashAirClient extends eventEmitter {
        /**
         * URL for FlashAir host device like "http://flashair/".
         * url always ends with /.
         */
        baseUrl: string;
        /**
         * This is set when the connecting client has a right mastercode.
         */
        isAdministrator: boolean;
        mastercode: string;
        /**
         * holds current language. This value comes from user's browser's language setting, otherwise is obtained by command.cgi accept language.
         */
        lang: string;
        /**
         * @param urlBase an address to FlashAir host, "http://flashair/". If omitted, proper host address is infered.
         * @param options specify options. Available options are defined in {@link FlashAirClientConfig FlashAirClientConfig}
         */
        constructor(urlBase?: string, options?: FlashAirClientConfig);
        /**
         * @param newUrl new host URL of FlashAir, which may be like "http://flashair/" or "http://192.168.0.100/"
         * @param verify If true, this method tries to verify the existence of the host address by calling command.cgi
         * @returns jQuery promise object.
         */
        setHostAddress(newUrl: string, verify?: boolean): JQueryPromise<any>;
        protected initWithHost(): void;
        /**
         * represents command.cgi.
         * command.cgi のオブジェクト表現
         */
        Command: Command;
        /**
         * represents thumbnail.cgi
         *  thumbnail.cgi のオブジェクト表現
         */
        Thumbnail: Thumbnail;
        /**
         * represents config.cgi
         * config.cgi のオブジェクト表現
         */
        Config: Config;
        /**
         * represents upload.cgi
         * upload.cgi のオブジェクト表現
         */
        Upload: Upload;
        /**
         * Not implemented.
         * @param path
         * @returns
         */
        GetFile(path: string | FileInfo): void;
        GetFileUrl(path: string | FileInfo | FileInfoRaw): string;
        protected onHostChanged(): void;
        protected onHostReady(): void;
        protected onHostFailure(): void;
        photoShareMode: boolean;
        private timer;
        private timestamp;
        private pollingInterval;
        private _pausePolling;
        startPolling(): void;
        pausePolling(): void;
        resumePolling(): void;
        stopPolling(): void;
        private poll();
        private browserLanguage();
    }
    /**
     * base class of CGI.
     * This class contains utility methods for CGI call, HTTP GET/POST etc.
     */
    class CgiHost {
        protected Client: FlashAirClient;
        CgiPath: string;
        protected GetBaseUrl(): string;
        /**
         * internal use only
         */
        constructor(fa: FlashAirClient);
        protected getTimestamp(): number;
        /**
         * helper function to call host CGI with GET method
         * @param qs query string with name:value
         * @param ajaxOption
         */
        protected GetMethod(qs?: Object, ajaxOption?: Object): JQueryXHR;
        private ajax(o);
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
    class Command extends CgiHost {
        CgiPath: string;
        /**
         * internal use only
         */
        constructor(fa: FlashAirClient);
        /**
         * utility method of HTTP GET with explicit `op` number.
         * returned content is parsed as TResult type.
         * @param op `op` number for command.cgi call.
         * @param qs other query strings. op and qs are mixed when it calls command.cgi
         * @returns jQuery promise object.
         */
        protected Get<TResult>(op: number, qs?: Object, ajaxOptions?: Object): JQueryPromise<any>;
        /**
         * regular expression pattern to parse WLANSD_FILELIST which is returned from OP=100 CGI call.
         */
        private static reColumns;
        /**
         * List files in a directory.
         * ```OP=100&DIR=/DCIM```
         * command.cgi?OP=100 operation.
         * @param dir directory path to list
         * @returns jQuery promise for `FileInfoRaw`
         */
        FileList(dir: string): JQueryPromise<FileInfoRaw[]>;
        /**
         * ```op=101&DIR=/DCIM```
         */
        FileCount(dir: String): JQueryPromise<number>;
        /**
         * ```op=102```
         */
        IsUpdated(): JQueryPromise<boolean>;
        /**
         * ```op=104```
         */
        NetworkSSID(): JQueryPromise<string>;
        /**
         * ```op=105```
         */
        NetworkPassword(): JQueryPromise<string>;
        /**
         * ```op=106```
         * MACアドレスの取得
         */
        MAC(): JQueryPromise<string>;
        /**
         * ```op=107```
         * ブラウザ言語の取得
         */
        AcceptLanguage(): JQueryPromise<string>;
        /**
         * ```op=108```
         * ファームウェアバージョン情報の取得
         */
        FirmwareVersion(): JQueryPromise<string>;
        /**
         * ```op=109```
         * 制御イメージの取得
         */
        ControlImagePath(): JQueryPromise<string>;
        /**
         * ```op=110```
         * 無線LANモードの取得
         */
        OperationMode(): JQueryPromise<WiFiOperationMode>;
        /**
         * ```op=111```
         * 無線LANタイムアウト時間の設定
         */
        DeviceTimeout(): JQueryPromise<number>;
        /**
         * ```op=117```
         * アプリケーション独自情報の取得
         */
        AppCustomInfo(): JQueryPromise<string>;
        /**
         * ```op=118```
         * アップロード機能の有効状態の取得
         */
        UploadEnabled(): JQueryPromise<boolean>;
        /**
         * ```op=120```
         * CIDの取得
         */
        CID(): JQueryPromise<string>;
        /**
         * ```op=121```
         * アップデート情報の取得 (タイムスタンプ形式)
         * @param timeout timeout of CGI call in millisecond. In purpose of avoiding long lasting connection to CGI server to reduce unnecessary load.
         */
        LastUpdatedTimestamp(timeout?: number): JQueryPromise<number>;
        GetAvailableSectorInfo(): JQueryPromise<FreeSectorInfo>;
        TurnOnPhotoShare(dir: string, date: Date): JQueryPromise<boolean>;
        TurnOffPhotoShare(): JQueryPromise<boolean>;
        IsPhotoShareEnabled(): JQueryPromise<boolean>;
        PhotoShareSSID(): JQueryPromise<string>;
        WebDAVStatus(): JQueryPromise<WebDAVStatus>;
        TimeZone(): JQueryPromise<number>;
    }
    class Thumbnail extends CgiHost {
        CgiPath: string;
        constructor(fa: FlashAirClient);
        /**
         * get a URL address for the thumbnail image.
         * @param file FlashAir.FileInfoRaw object which is returned from op=100 call.
         */
        GetUrl(file: FileInfoRaw | string): string;
    }
    interface ConfigDefinition {
        APPINFO?: string;
        APPMODE?: WiFiOperationMode;
        APPNETWORKKEY?: string;
        APPSSID?: string;
        BRGNETWORKKEY?: string;
        BRGSSID?: string;
        CIPATH?: string;
        CLEARCODE?: number;
        TIMEZONE?: number;
        WEBDAV?: WebDAVStatus;
        APPAUTOTIME?: number;
    }
    class Config extends CgiHost {
        CgiPath: string;
        CONFIG: ConfigDefinition;
        constructor(fa: FlashAirClient);
        Get<TResult>(qs: any): JQueryPromise<TResult>;
        Submit(masterCode: string): JQueryPromise<boolean>;
        Clear(): void;
        setDeviceTimeout(value: any): void;
    }
    class Upload extends CgiHost {
        constructor(fa: FlashAirClient);
    }
}
