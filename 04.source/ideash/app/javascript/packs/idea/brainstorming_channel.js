import consumer from "../../channels/consumer"
import {checkControllerAction} from "../common/check_controller_action";


$(document).on("turbolinks:load", function () {
    if (!checkControllerAction(['brainstorming'], ['edit'])) return

    let targetTimerInterval;
    let isUnlimitedMode;

    if ($('.websocket').length > 0) {
        consumer.task = consumer.subscriptions.create({
            channel: 'IdeaChannel',
            idea: $('#idea_logs').data('idea_id')
        }, {
            connected() {
                // Called when the subscription is ready for use on the server
                this.perform('join_user');
                return this.perform('pause');
            },

            disconnected() {
                // Called when the subscription has been terminated by the server
            },

            received(json_idea_log) {
                let query = json_idea_log['idea_logs']
                if (query['mode'] === 'join') {
                    let user_id = 'participant_' + query['user_id']
                    if ($('#' + user_id).length === 0) {
                        $('.users').append(`<li id="participant_${query['user_id']}"><i class="user circle icon"></i>${query['join']['user_name']}</li>`)
                    }
                } else if (query['mode'] === 'add') {
                    let add = query["add"]
                    const idea_text = escapeHTML(add["content"]);

                    if (idea_text === null || idea_text === "") {
                        return false;
                    }

                    let id = parseInt(localStorage.getItem('card_id')) + 1;
                    let div = $(
                        '<div class="teal card idea none square-card" id="' + id + '">\n' +
                        '      <div class="content">\n' +
                        idea_text +
                        '      </div>\n' +
                        '    </div>'
                    );
                    $("#ideas").prepend(div);
                    $('#' + id).show('slide', '', 500);
                    localStorage.setItem('card_id', id);
                    let object_id = "object_id_" + query['add']['object_id']
                    let p3_div = $(
                        `<div class="idea" id=${object_id} draggable="true" ondragstart="dragstart_handler(event)">\n` +
                        '       <div class="ui teal large label">\n' +
                        idea_text +
                        '       </div>\n' +
                        '</div>'
                    );
                    $("#p3_ideas").prepend(p3_div);
                } else if (query['mode'] === 'chat') {
                    let user_id = 'chatuser_' + query['user_id']
                    let user_name = escapeHTML(query['chat']['user_name'])
                    let chat_text = escapeHTML(query['chat']['content']);
                    let chat_div;
                    if ($('#user_id').val() === query['user_id']) {
                        chat_div = `<div class="ui right pointing label chat_message">${chat_text}</div>`
                    } else {
                        chat_div = `<div class="ui left pointing label chat_message">${chat_text}</div>`
                    }
                    if (user_id !== $('.chat_content').first().attr('name')) {
                        $('.chat_contents').first().prepend(`
                        <div class="chat_content" name="chatuser_${query['user_id']}">
                            <h6 class="chat_username">${user_name}</h6>
                        </div>
                    `)
                    }
                    $('.chat_username').first().after(chat_div)

                } else if (query['mode'] === 'system') {
                    if (query['system']['operation'] === 'stop') {
                        if (query['system']['option'] === 'process1') {
                            $('body')
                                .toast({
                                    title: 'プロセス2に移行します!!',
                                    message: 'メンバー内でアイデアを共有し、\n' +
                                        '質問やアイデアの結合を行いましょう!!',
                                    showProgress: 'bottom',
                                    classProgress: 'blue'
                                });
                            $('#idea_add').prop('disabled', true)
                        } else if (query['system']['option'] === 'process2') {
                            $('body')
                                .toast({
                                    title: 'プロセス3に移行します!!',
                                    showProgress: 'bottom',
                                    classProgress: 'blue'
                                });
                            $('#process_1').hide()
                            $('#process_3').show()
                            $('#idea_add').prop('disabled', false)
                            $('#change_button').prop('disabled', false)
                        } else if (query['system']['option'] === 'process3') {
                            $('body')
                                .toast({
                                    title: '終了!!\n' +
                                        'お疲れ様でした!!',
                                    showProgress: 'bottom',
                                    classProgress: 'blue'
                                });
                        }
                    } else if (query['system']['operation'] === 'group_rename') {
                        let id = '#brain_rename_' + query['system']['option']['group_id'].toString()
                        let name = query['system']['option']['name']
                        $(id).attr('placeholder', name)
                    } else if (query['system']['operation'] === 'grouping') {
                        let object_id = 'object_id_' + query['system']['option']['object_id']
                        let group_id = 'group_id_' + query['system']['option']['group_id']
                        let div = $(
                            `<div class="idea ui teal large label" id=${object_id} draggable="true" ondragstart="dragstart_handler(event)">\n` +
                            query['system']['option']['content'] +
                            '</div>'
                        );
                        $('#' + object_id).remove();
                        $('#' + group_id).append(div);
                    } else if (query['system']['operation'] === 'get_process_time') {
                        let process_times = query['system']['process_times'];
                        let process_words = ['アイデア出し：', '意見だし　　：', 'グルーピング：'];
                        for (let i = 0; i < 3; i++) {
                            $('#time' + i).text(process_words[i] + Math.floor(process_times[i]['time']/60) + '分');
                        }
                        let process1_time = process_times[0]['time'];
                        isUnlimitedMode = process1_time === 0;
                    }
                } else if (query['mode'] === 'group') {
                    let group_id = escapeHTML(query['group']['group_id'])
                    let group_name = escapeHTML(query['group']['name'])
                    $('.group-contents').append(`
                        <div class="ui stacked segments group hidden_group" id="group_id_${group_id}" ondrop="drop_handler(event)" ondragover="dragover_handler(event)">
                            <div class="group_name ui transparent input">
                                <input type="text" name="brain_rename_${group_id}" id="brain_rename_${group_id}" placeholder="${group_name}" data-behavior="idea_speaker"}>
                            </div>
                        </div>
                    `)
                } else if (query['mode'] === 'settime') {
                    let row_target_times = query['settime']['target_times'];
                    let target_times = []
                    for (let i in row_target_times) {
                        target_times.push(new Date(row_target_times[i]));
                    }
                    startTimer(target_times)
                }

            },
            add: function (json_idea_log) {
                return this.perform('add',
                    json_idea_log
                );
            },
            chat: function (json_idea_log) {
                return this.perform('chat_send',
                    json_idea_log
                );
            },
            group_add: function () {
                return this.perform('group_add');
            },
            group_rename: function (json_idea_log) {
                return this.perform('group_rename',
                    json_idea_log
                );
            },
            grouping: function (json_idea_log) {
                return this.perform('grouping',
                    json_idea_log
                );
            }
        });

        $(document).on('keypress', '[data-behavior~=idea_speaker]', function (event) {
            if (event.keyCode === 13) {
                if (!event.target.value.match(/\S/g)) return false
                let content = {
                    content: event.target.value
                };
                if (event.target.id === 'idea_add') {
                    consumer.task.add(content);
                } else if (event.target.id === 'idea_chat') {
                    consumer.task.chat(content);
                } else if (event.target.id.startsWith('brain_rename_')) {
                    content = {
                        content: {
                            group_id: event.target.id.replace(/[^0-9]/g, ''),
                            name: event.target.value
                        }
                    }
                    consumer.task.group_rename(content);
                }
                event.target.value = '';
                return event.preventDefault();
            }
        });

        $('#group_add').on('click', function () {
            consumer.task.group_add();
        });

        $('.group-contents').on("drop", function (event) {
            console.log("ドラッグしたアイデアの内容:" + event.target.lastChild.innerText)
            console.log(event.target.id.indexOf('group_id'))
            if (event.target.id.indexOf('group_id') === 0) {
                event.preventDefault();
                let content = {
                    content: {
                        object_id: event.target.lastChild.id.replace(/[^0-9]/g, ''),
                        group_id: event.target.id.replace(/[^0-9]/g, ''),
                        content: event.target.lastChild.innerText
                    }
                }
                consumer.task.grouping(content);
            }
        });
    } else {
        if (consumer.task) {
            consumer.task.unsubscribe()
        }
    }

    function startTimer(target_times) {
        target_times.sort();
        targetTimerInterval = setInterval(showTimer, 1000, target_times)
    }

    function showTimer(target_times = []) {
        //ひとつ目がない
        if (target_times.length === 0) {
            clearInterval(targetTimerInterval);
            return
        }
        let targetDate = new Date(target_times[0]);
        targetDate.setHours(targetDate.getHours() + 9);
        let nowDate = new Date();
        let showNowDate = nowDate.getHours() + ':'
            + nowDate.getMinutes() + ':'
            + nowDate.getSeconds();
        let diffTime = targetDate - nowDate;
        //あるので表示
        if (diffTime > 0) {
            let dMin = diffTime / (1000 * 60);   // 分
            diffTime = diffTime % (1000 * 60);
            let dSec = diffTime / 1000;   // 秒
            let msg = Math.floor(dMin) + "分"
                + Math.floor(dSec) + "秒";
            $('#time_title').text('残り時間');
            $('#remaining').text(msg);
        } else if (isUnlimitedMode) {
            $('#time_title').text('現在時刻');
            $('#remaining').text(showNowDate);
        } else {
            clearInterval(targetTimerInterval);
            target_times.shift()
            targetTimerInterval = setInterval(showTimer, 1000, target_times)
            if (target_times.length === 0) {
                $('#time_title').text('残り時間');
                $('#remaining').text('終了');
            }

        }
    }

// NOTE: エスケープ処理
    const escapeHTML = function (val) {
        return $('<div />').text(val).html();
    };

});