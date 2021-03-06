import {checkControllerAction} from "../common/check_controller_action";

$(document).on("turbolinks:load", function () {
    if (!checkControllerAction(['brainstorming', 'mandarat'], ['edit'])) return

    //チャット欄の設定
    let $chat = $('.chat')
    let chat_original_position
    let chat_original_size
    $chat
        .draggable({
            containment: "#wrap",
            handle: ".header-text",
            opacity: 0.5,
            create: function (event, ui) {
                chat_original_position = $chat.position()
            }
        })
        .resizable({
            minHeight: 300,
            minWidth: 150,
            handles: "e,s,w,se,sw,ne,nw",
            start: function (event, ui) {
                chat_original_size = chat_original_size ?? ui.originalSize
            }
        });

    $('#reset_chat_position').on('click', function () {
        $('.chat').animate({
            height: (!chat_original_size) ? "auto" : chat_original_size.height,
            width: (!chat_original_size) ? "auto" : chat_original_size.width,
            top: (!chat_original_position) ? "auto" : chat_original_position.top,
            left: (!chat_original_position) ? "auto" : chat_original_position.left,
        })
    })

    let timerId = setInterval(showClock2, 1000);
    showClock2(timerId)

    $('#copy_invite_link').on('click', function (e) {
        // 空div 生成
        var tmp = document.createElement("div");
        // 選択用のタグ生成
        var pre = document.createElement('pre');

        // 親要素のCSSで user-select: none だとコピーできないので書き換える
        pre.style.userSelect = 'auto';

        tmp.appendChild(pre).textContent = $(e.target).val();

        // 要素を画面外へ
        var s = tmp.style;
        s.position = 'fixed';
        s.right = '200%';

        // body に追加
        document.body.appendChild(tmp);
        // 要素を選択
        document.getSelection().selectAllChildren(tmp);

        // クリップボードにコピー
        if (document.execCommand("copy")) {
            $('body')
                .toast({
                    title: 'COPIED INVITE LINK!',
                    message: '招待リンクをコピーしました！友達に送ろう！',
                    showProgress: 'bottom',
                    classProgress: 'blue'
                });
        }
        // 要素削除
        document.body.removeChild(tmp);
    });

    //modalの設定
    if (location.href.match(/brainstorming/)) {
        $('body').append('<div class="modal js-modal">\n' +
            '        <div class="modal__bg js-modal-close"></div>\n' +
            '        <div class="modal__content">\n' +
            '          <p>ブレインストーミングとは、' +
            'アレックス・F・オズボーンによって考案された会議方式のひとつ。' +
            '集団思考、集団発想法、課題抽出ともいう。' +
            '1941年に良いアイデアを生み出す状態の解析が行われた後、' +
            '1953年に発行した著書 Applied Imagination の中で、' +
            '会議方式の名称として使用された。</p>\n' +
            '          <a class="js-modal-close" href="">閉じる</a>\n' +
            '        </div><!--modal__inner-->\n' +
            '      </div><!--modal-->')
    } else if (location.href.match(/mandarat/)) {
        $('body').append('<div class="modal js-modal">\n' +
            '        <div class="modal__bg js-modal-close"></div>\n' +
            '        <div class="modal__content">\n' +
            '          <p>マンダラートは、発想法の一種。' +
            '紙などに9つのマスを用意し、' +
            'それを埋めていくという作業ルールを設けることにより、' +
            'アイデアを整理・外化し、思考を深めていくことができる。' +
            '今泉浩晃によって1987年に考案された。</p>\n' +
            '          <a class="js-modal-close" href="">閉じる</a>\n' +
            '        </div><!--modal__inner-->\n' +
            '      </div><!--modal-->')
    }

    $('.js-modal-open').on('click', function () {
        $('.js-modal').fadeIn();
        return false;
    });
    $('.js-modal-close').on('click', function () {
        $('.js-modal').fadeOut();
        return false;
    });
});

function set2fig(num) {
    // 桁数が1桁だったら先頭に0を加えて2桁に調整する
    var ret;
    if (num < 10) {
        ret = "0" + num;
    } else {
        ret = num;
    }
    return ret;
}

function showClock2(timerId) {
    var nowTime = new Date();
    var nowHour = set2fig(nowTime.getHours());
    var nowMin = set2fig(nowTime.getMinutes());
    var nowSec = set2fig(nowTime.getSeconds());
    var msg = nowHour + ":" + nowMin + ":" + nowSec;
    if ($('#RealtimeClockArea2').length === 0) {
        clearInterval(timerId)
    } else {
        document.getElementById("RealtimeClockArea2").innerHTML = msg;
    }
}
