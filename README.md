# MessageViewJS
Talking Scene JavaScript Library
HTML5, WebGame etc...

![](https://github.com/webcyou/MessageViewJS/blob/master/demo/img/screen_shot.png)

### これは何？
「MessageViewJS」はゲーム内でよくある会話シーンを簡単実装できる、JavaScriptライブラリです


### demo
[デモページ](http://webcyou.com/message_view_js/demo/)

### Install

#### Bower
```
bower install message_view.js
```

### The Basics

```
<!doctype html>
    <head>
        <script src="/js/message_view.js" type="text/javascript"></script>
        <script>
            document.addEventListener("DOMContentLoaded", function() {
                var message = new MessageViewer({
                    "data": [{
                        "name": "生方 すみれ",
                        "message": "はじめまして！",
                        "img_url": "/img/character_0001.png"
                    }]
                });
            }, false);
        </script>
    </head>
</html>
```

### Multi

```
var message = new MessageViewer({
    "data": [{
        "name": "生方 すみれ",
        "message": "はじめまして！",
        "img_url": "/img/character_0001.png"
    },
    {
        "message": "こんにちは！"
    }]
});
```

### Character Change
```
var message = new MessageViewer({
    "data": [{
        "name": "生方 すみれ",
        "message": "はじめまして！",
        "img_url": "/img/character_0001.png"
    },
    {
        "name": "高山 大介",
        "message": "こんにちは！"
        "img_url": "/img/character_0002.png"
    }]
});
```

### Multi Class Change

```
var message = new MessageViewer({
    "data": [{
        "side_class": "right",
        "name": "生方 すみれ",
        "message": "はじめまして！",
        "img_url": "/img/character_0001.png"
    },
    {
        "side_class": "left",
        "name": "高山 大介",
        "message": "こんにちは！"
        "img_url": "/img/character_0002.png"
    },
    {
        "side_class": "right",
        "name": "生方 すみれ",
        "message": "今日はいい天気ですね！",
        "img_url": "/img/character_0001.png"
    }]
});
```

### CallBack Function

```
var message = new MessageViewer({
    "data": [{
        "name": "生方 すみれ",
        "message": "はじめまして！",
        "img_url": "/img/character_0001.png"
    }]
}, function() {
   console.log("callBack");
});
```

### Options

```
var message = new MessageViewer({
    "data": [{
        "name": "生方 すみれ",
        "message": "はじめまして！",
        "img_url": "/img/character_0001.png"
    }],
    "option": {
        "loop": true,
        "speed": "fast"
    }
});
```

# Options Reference

| OptionName        | DefaultValue         | SetValue                 | OptionDetail|
| --------------- |:---------------:| -------------------- | -------:|
| view | .messageView#default | className, idName, element        | MessageViewの大枠となる要素     |
| contents | .messageView#default .mv-contents | className, idName, element | MessageViewのcontentsとなる要素     |
| character | .messageView#default .mv-contents .mv-image.character  | className, idName, element|MessageViewのcharacterとなる要素|
| characterImg | .messageView#default .mv-contents .mv-image.character img| img element|MessageViewのcharacterのimg要素|
| messageView | .messageView#default .mv-contents .mv-comment|className, idName, element|メッセージ表示する親要素|
| message | .messageView#default .mv-contents .mv-comment .val|className, idName, element|メッセージを挿入する要素|
| name | .messageView#default .mv-contents .mv-name|className, idName, element|characterの名前表示する要素|
| pointer | .messageView#default .mv-contents .mv-comment .pointer|className, idName, element|メッセージのポインタ要素|
| messageOpenClass | in |className ( string )|MessageViewを表示する際、追加するクラス名|
| messageCloseClass | hide |className ( string )|MessageViewを非表示する際（終了後）、追加するクラス名|
| page | 0 |Number|Messageを開始するページナンバー|
| speed | normal |"normal", "fast", "slow", Number|Messageを表示するスピード|
| ignoreSkip | false |boolean|Messageのスキップを無効|
| loop | false |boolean|Messageをループさせるか|
| isPointer | false |boolean| Messageのポインター表示 |
| isClose | true |boolean| MessageView終了後のView表示 |

### Author
Daisuke Takayama
[Web帳](http://www.webcyou.com/)


### License
Copyright (c) 2015 Daisuke Takayama
Released under the [MIT license](http://opensource.org/licenses/mit-license.php)


### Thanks
素材提供：株式会社ブリリアントサービス
『星宝転生ジュエルセイバー』[http://www.jewel-s.jp/](http://www.jewel-s.jp/)
