/*
 * Author: Daisuke Takayama
 */
'use strict';
(function(global) {
    var document = global.document;

    /**
     * Utility Class
     * @public
     * @param option
     */
    var Utility = (function() {
        function Utility(option) {
            this.support = {
                touch: ("ontouchstart" in window)
            };
            this.vendor = {
                defultEvent: "click",
                transitionend: this.whichTransitionEvent(),
                animationend: this.whichAnimationEvent()
            };
            if(this.support.touch) {
                this.vendor.defultEvent = 'touchend';
            }
        }
        Utility.prototype.whichAnimationEvent = function() {
            var t,
                el = document.createElement("fakeelement");
            var animations = {
                "animation"      : "animationend",
                "OAnimation"     : "oAnimationEnd",
                "MozAnimation"   : "animationend",
                "WebkitAnimation": "webkitAnimationEnd"
            };
            for(t in animations) {
                if (el.style[t] !== undefined){
                    return animations[t];
                }
            }
        };
        Utility.prototype.whichTransitionEvent = function() {
            var t,
                el = document.createElement("fakeelement");
            var transitions = {
                "transition"      : "transitionend",
                "OTransition"     : "oTransitionEnd",
                "MozTransition"   : "transitionend",
                "WebkitTransition": "webkitTransitionEnd"
            };
            for (t in transitions){
                if (el.style[t] !== undefined){
                    return transitions[t];
                }
            }
        };
        return Utility;
    })();


    /**
     * MessageView constructor
     * @public
     * @param {{data: params}} args
     */
    function MessageView(data, args) {
        this.view = document.querySelector(args.view);
        this.contents = document.querySelector(args.contents);
        this.character = document.querySelector(args.character);
        this.characterImg = document.querySelector(args.characterImg);
        this.messageView = document.querySelector(args.messageView);
        this.message = document.querySelector(args.message);
        this.name = document.querySelector(args.name);
        this.init.apply(this, arguments);
    }
    MessageView.prototype = {
        init: function() {
        },

        isSet: function(args) {
            if(args !== undefined && args !== void 0) {
                return true;
            } else {
                return false;
            }
        },

        open: function() {
            if(this.view.classList.contains('hide')) {
                this.view.classList.remove("hide");
            }
        },

        close: function() {
            this.view.classList.add("hide");
            this.message.classList.add("in");
            this.character.classList.add("in");
        },

        commentChange: function(data) {
            this.message.innerHTML = '';
            this.message.innerHTML = data;
            this.messageView.classList.remove("in");
        },

        commentClear: function() {
            this.message.innerHTML = '';
        },

        characterChange: function(data) {
            var that = this;
            if (data && data.img_url) {
                this.characterImg.src = data.img_url;
                setTimeout(function() {
                    that.character.className = "img character";
                    that.character.addEventListener('webkitTransitionEnd', function character() {
                        that.messageView.className = "comment";
                        this.removeEventListener("webkitTransitionEnd", character, false);
                    });
                }, 80);
            } else {
                that.character.className = "img character";
            }
        },

        nameChange: function(data) {
            this.name.innerHTML = data.name;
        },

        sideChange: function(sideClassName) {
            if(this.isSet(sideClassName) && sideClassName !== null){
                if(this.view.classList.contains(sideClassName)) {
                    this.view.classList.remove(sideClassName);
                }
            }
            this.view.classList.add(sideClassName);
        }
    };


    /**
     *	Message constructor
     *	@public
     */
    function Message(args, fn) {
        var that = this,
            option = args.option;

        this.option = {
            view: ".messageView#default",
            contents: ".messageView#default .mv-contents",
            character: ".messageView#default .mv-contents .mv-image.character",
            characterImg: ".messageView#default .mv-contents .mv-image.character img",
            messageView: ".messageView#default .mv-contents .mv-comment",
            message: ".messageView#default .mv-contents .mv-comment .val",
            name: ".messageView#default .mv-contents .mv-name",
            messageOpenClass: "",
            messageCloseClass: "",
            page: 0,
            speed: 'normal',
            ignoreSkip: false
        };
        this.addTime = 30;

        // メッセージ読み込み中のタップをはじくためのフラグ
        this.loading = false;

        // Option Speed
        if(option !== undefined) {
            for (var property in option) {
                this.option[property] = option[property];
            }
            switch (this.option.speed) {
                case 'normal':
                    that.addTime = 30;
                    break;
                case 'fast':
                    that.addTime = 10;
                    break;
                case 'slow':
                    that.addTime = 80;
                    break;
                default:
                    that.addTime = 30;
                    break;
            }
        }

        // Message Value JSON
        if(args !== undefined) {
            this.data = args.data;
            this.selectedNum = this.option.page;
            this.selectedData = args.data[0];
            this.maxNum = args.data.length;
        }

        this.set = function(source){
            for (var property in source) {
                this.option[property] = source[property];
            }
            return this;
        };

        this.messageView = document.querySelector(this.option.view);

        that.onClick = function (e) {
            // 下の要素のtouchendが反応するのを抑制する
            // preventDefaultが必須
            e.stopPropagation();
            e.preventDefault();
            that.next.call(that);
        };

        this.utility = new Utility(this.option);
        this.messageView.addEventListener(this.utility.vendor.defultEvent, that.onClick, true);

        if(args.data !== undefined) {
            this.init.apply(this, [args.data]);
        }

        this.callBack = function() {
            if(fn !== void 0) {
                fn();
            }
        };

        // メッセージスキップの判定
        this.skip = false;
    }
    Message.prototype = {
        init: function(val) {
            var that = this;
            this.View = new MessageView(this.data, this.option);
            if(this.maxNum > 0) {
                that.open(val.data);
            }
        },

        isSet: function(args) {
            if(args !== undefined && args !== void 0) {
                return true;
            } else {
                return false;
            }
        },

        open: function(data) {
            if(this.isSet(this.selectedData.side_class)) {
                this.sideChange();
            }
            if(this.isSet(this.selectedData.name)) {
                this.nameChange();
            }
            if(this.isSet(this.selectedData.img_url)) {
                this.characterChange();
            } else {
                this.characterReset();
            }
            if(this.isSet(this.selectedData.message)) {
                this.commentChange();
            }
            this.View.open(data);
        },

        close: function() {
            this.messageView.removeEventListener(this.utility.vendor.defultEvent, this.onClick, true);
            this.View.close();
        },

        next: function() {
            // 読み込み中はメッセージに対する操作を許容しない
            if (this.loading === true) {
                // ignoreSkipが設定されていなければスキップ
                if (!this.option.ignoreSkip) {
                    this.skip = true;
                }
                return;
            }
            this.commentClear();
            this.selectedNum += 1;
            if(this.maxNum > this.selectedNum) {
                this.selectedData = this.data[this.selectedNum];
                if(this.selectedData.side !== undefined) {
                    this.sideChange();
                }
                if(this.selectedData.name) {
                    this.nameChange();
                }
                if(this.selectedData.img_url) {
                    this.characterChange();
                } else {
                    this.characterReset();
                }
                if(this.selectedData.message) {
                    this.commentChange();
                }
            } else if (this.maxNum <= this.selectedNum) {
                this.end();
                this.close();
            }
        },

        end: function() {
            this.callBack();
        },

        characterChange: function() {
            this.View.characterChange(this.selectedData);
        },

        characterReset: function() {
            this.View.characterChange(null);
        },

        sideChange: function() {
            this.View.sideChange(this.selectedData.side_class);
        },

        commentChange: function() {
            var that = this,
                str = this.selectedData.message.split(/<br(?:[ \t][^\/>]*)?\/?>/g),
                splitComment = [],
                setComment = '',
                interval = this.addTime;

            for(var i in str) {
                if (splitComment.length > 0) {
                    splitComment.push('<br>');
                }
                splitComment.push(str[i].split(''));
            }

            // 平坦化
            splitComment = that.flatten(splitComment);

            that.skip = false;
            that.loading = true;

            var addChar = function() {
                var c = splitComment.shift();

                // 残りの文字がないので終了
                if (!c) {
                    that.loading = false;
                    return false;
                }

                setComment += c;

                // 途中でクリックされたときは残りをいっぺんに表示する
                if (that.skip) {
                    interval = 0;
                    setComment += splitComment.join('');
                    splitComment = [];
                    // 終了処理を集約するためにもう一度addCharを呼ぶようにしておく
                }
                that.View.commentChange(setComment);
                setTimeout(addChar, interval);
            };

            addChar();
        },

        flatten: function(val) {
            var mixMessage = [];
            for(var i = 0; val.length > i; i++) {
                if(val[i] instanceof Array) {
                    for(var n = 0; val[i].length > n; n++) {
                        mixMessage.push(val[i][n]);
                    }
                } else {
                    mixMessage.push(val[i]);
                }
            }
            return mixMessage;
        },

        commentClear: function() {
            clearTimeout(this.timer);
            this.selectedData.message = '';
            this.View.commentClear();
        },

        nameChange: function() {
            this.View.nameChange(this.selectedData);
        },

        setData: function(data) {
            this.data = data;
        },

        getData: function() {
            return this.data;
        }

    };

    // namespaceにexport
    if (global.MessageViewer === void 0) {
        global.MessageViewer = {};
    }
    global.MessageViewer = Message;
})(this);