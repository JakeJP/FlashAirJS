/**
 * Yokin's FlashAir Javascript client library
 * (c) 2015 Yokinsoft Jake.Y.Yoshimura http://www.yo-ki.com
 *
 * @version 0.9.4
 * @author Yokinsoft Jake.Y.Yoshimura
 * @license MIT License
 */

module FlashAir 
{
    export enum FileAttribute
    {
        ReadOnly =1,
        Hidden=2,
        System=4,
        Volume = 8,
        Directory = 16,
        Archive = 32
    }	

    /**
     * Raw file data from FlashAir host which is given in `wlansd` global array object in *List.htm*.
     * This is also a container of the data returned by `command.cgi?op=100` call, where CSV format is converted in to this interface.
     */
    export interface FileInfoRaw {
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
    export class FileInfo implements FileInfoRaw {
        r_uri: string;
        fname: string;
        fsize: number;
        attr: number;
        fdate: number;
        ftime: number;

        Directory() : string { return this.r_uri; }
        Name() : string { return this.fname; }
        Size() : number { return this.fsize; }
        Time() : Date { return FileInfo.FTIMEtoDateTime( this.fdate, this.ftime ); }
        Attributes() : FileAttribute { return <FileAttribute> this.attr; }
        IsDirectory() : boolean { return !!(this.attr & FileAttribute.Directory); }
        
        /**
         * convert FDATE, FTIME internal datetime value to javascript Date object.
         * 
         * FlashAir 内部形式の FDATE FTIME を Date オブジェクトに変換します。
         */
        static FTIMEtoDateTime( _date : number, _time : number) : Date
        {
            return new Date(1980 + ((_date >> 9) & 0x7F), ((_date >> 5) & 0xF) - 1, _date & 0x1F, (_time >> 11) & 0x1F, (_time >> 5) & 0x3F, ( _time << 1) & 0x3F );
        }
        /**
         * convert javascript Date object to internal FDATE format.
         * 
         * Javascript の Date を FDATE 数値形式に変換します。
         */
        static DateTimeToFDATE( date : Date ) : number
        {
            return (((date.getUTCFullYear() - 1980) << 9) + ((date.getMonth() - 1) << 5) + date.getDay() );
        }
        /**
         * convert javascript Date object to internal FTIME format.
         * 
         * Javascript の Date を FTIME 数値形式に変換します。
         */
        static DateTimeToFTIME( date : Date ) : number
        {
            return (date.getHours() << 11) + (date.getMinutes() << 5) + (date.getSeconds() >> 1 );
        }
    }
    export interface FreeSectorInfo 
    {
        Free : number;
        Total : number;
        SectorSize : number;
    }

    export enum WebDAVStatus
    {
        Disabled = 0,
        ReadOnly = 1,
        ReadWrite = 2
    }

    export interface ExifInfo
    {
        Width : number;
        Height : number;
        Orientation : ExifOientation
    }

    export enum ExifOientation
    {
        Horizontal = 1, //=> 'Horizontal (normal)',
        MirrorHorizontal = 2, // => 'Mirror horizontal',
        Rotate180 = 3, // => 'Rotate 180',
        MirrorVertical = 4,// => 'Mirror vertical',
        MirrorHhorizontalAndRotate270CW = 5,// => 'Mirror horizontal and rotate 270 CW',
        Rotate90CW = 6, // => '',
        MirrorHorizontalAndRotate90CW = 7, // => 'Mirror horizontal and rotate 90 CW',
        Rotate270CW = 8 // => 'Rotate 270 CW',
    }

    export enum WiFiOperationMode
    {
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
        Bridge = 6
    }
    /**
     * internal use only.
     * to make class object event emittable.
     */
    export class eventEmitter
    {
        private _callbacks;
        on( event, fn )
        {
            this._callbacks = this._callbacks || {};
            (this._callbacks[event] = this._callbacks[event] || []).push(fn);
            return this;
        }
        addEventListener(event,fn){}
        once(event, fn)
        {
            function on(){
                this.off(event, on);
                fn.apply(this,arguments);
            }
            this.on(event, on);
            return this;
        }
        off( event, fn )
        {
            this._callbacks = this._callbacks || {};
            // all
            if (0 == arguments.length) {
                this._callbacks = {};
                return this;
            }
            // specific event
            var callbacks = this._callbacks[event];
            if (!callbacks) return this;
            
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
        }
        removeListener(event,fn){}
        removeAllListeners(event,fn){}
        removeEventListener(event,fn){}
        
        trigger(event,...args)
        {
            this._callbacks = this._callbacks || {};
            var callbacks = this._callbacks[event];
            if (callbacks) {
                callbacks = callbacks.slice(0);
                for (var i = 0, len = callbacks.length; i < len; ++i) {
                    callbacks[i].apply(this, args);
                }
            }
            return this;   
        }
    }
    eventEmitter.prototype.addEventListener = eventEmitter.prototype.on;
    eventEmitter.prototype.removeListener = eventEmitter.prototype.removeAllListeners = eventEmitter.prototype.removeEventListener = eventEmitter.prototype.off; 
/*    export class TimeSpan {
        
    }*/
}
