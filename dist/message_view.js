/*
 * Copyright (c) 2015 Daisuke Takayama
 * Released under the MIT license
 * http://opensource.org/licenses/mit-license.php
 *
 * Author: Daisuke Takayama
 * URL: http://www.webcyou.com/
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
    function MessageView(data, args, util) {
        this.utility = util;
        this.view = document.querySelector(args.view);
        this.contents = document.querySelector(args.contents);
        this.character = document.querySelector(args.character);
        this.characterImg = document.querySelector(args.characterImg);
        this.messageView = document.querySelector(args.messageView);
        this.message = document.querySelector(args.message);
        this.name = document.querySelector(args.name);
        this.pointer = document.querySelector(args.pointer);

        this.MESSAGE_VIEW_CLASS = this.view.className; //default messageView
        this.MESSAGE_CLOSE_CLASS = args.messageCloseClass; //default .hide
        this.MESSAGE_OPEN_CLASS = args.messageOpenClass; //default .in
        this.CHARACTER_CLASS = this.character.className;
        this.MESSAGE_CLASS = this.message.className;

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
            if(this.view.classList.contains(this.MESSAGE_CLOSE_CLASS)) {
                this.view.classList.remove(this.MESSAGE_CLOSE_CLASS);
            }
        },

        close: function() {
            this.view.classList.add(this.MESSAGE_CLOSE_CLASS);
            this.message.classList.add(this.MESSAGE_OPEN_CLASS);
            this.character.classList.add(this.MESSAGE_OPEN_CLASS);
        },

        commentChange: function(data) {
            this.message.innerHTML = '';
            this.message.innerHTML = data;
            this.messageView.classList.remove(this.MESSAGE_OPEN_CLASS);
        },

        commentClear: function() {
            this.message.innerHTML = '';
        },

        characterChange: function(data) {
            var that = this;
            if (data && data.img_url) {
                this.characterImg.src = data.img_url;
                setTimeout(function() {
                    that.character.className = that.CHARACTER_CLASS;
                    that.character.addEventListener(that.utility.vendor.transitionend, function character() {
                        that.messageView.className = that.MESSAGE_CLASS;
                        this.removeEventListener(that.utility.vendor.transitionend, character, false);
                    });
                }, 80);
            } else {
                that.character.className = that.CHARACTER_CLASS;
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
                this.view.className = this.MESSAGE_VIEW_CLASS;
            }
            this.view.classList.add(sideClassName);
        },

        showPointer: function() {
            this.pointer.style.visibility = 'visible';
        },

        hidePointer: function()  {
            this.pointer.style.visibility = 'hidden';
        },

        disablePointer: function() {
            this.pointer.style.display = 'none';
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
            pointer: ".messageView#default .mv-contents .mv-comment .pointer",
            messageOpenClass: "in",
            messageCloseClass: "hide",
            page: 0,
            speed: 'normal',
            ignoreSkip: false,
            loop: false,
            isPointer: true
        };
        this.addTime = 30;
        this.loading = false;

        this.isNumber = function(x) {
            if( typeof(x) != 'number' && typeof(x) != 'string' )
                return false;
            else
                return (x == parseFloat(x) && isFinite(x));
        };

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
            if(this.isNumber(this.option.speed)) {
                that.addTime = Math.abs(Math.round(this.option.speed));
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

        this.onClick = function (e) {
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
            this.View = new MessageView(this.data, this.option, this.utility);
            if(!this.option.isPointer) {
                this.disablePointer();
            }
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
            if (this.loading === true) {
                if (!this.option.ignoreSkip) {
                    this.skip = true;
                }
                return;
            }
            this.commentClear();
            this.selectedNum += 1;
            if(this.maxNum > this.selectedNum) {
                this.selectedData = this.data[this.selectedNum];
                if(this.selectedData.side_class !== undefined) {
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
                // loop
                if(this.option.loop) {
                    this.selectedNum = this.option.page;
                    this.selectedData = this.data[this.selectedNum];
                    this.open(this.data);
                } else {
                    this.end();
                    this.close();
                }
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

            this.hidePointer();
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

                if (!c) {
                    that.loading = false;
                    that.showPointer();
                    return false;
                }
                setComment += c;

                if (that.skip) {
                    interval = 0;
                    setComment += splitComment.join('');
                    splitComment = [];
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
            this.View.commentClear();
        },

        nameChange: function() {
            this.View.nameChange(this.selectedData);
        },

        showPointer: function() {
            if(this.option.isPointer) {
                this.View.showPointer();
            }
        },

        hidePointer: function()  {
            this.View.hidePointer();
        },

        disablePointer: function() {
            this.View.disablePointer();
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