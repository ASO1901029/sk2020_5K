import consumer from "../../channels/consumer"

$(document).on("turbolinks:load", function () {
    if ($('.websocket').length > 0) {
        consumer.task = consumer.subscriptions.create({
            channel: 'IdeaChannel',
            idea: $('#idea_logs').data('idea_id')
        }, {
            connected() {
                // Called when the subscription is ready for use on the server
                return this.perform('join_user');
            },

            disconnected() {
                // Called when the subscription has been terminated by the server
            },

            received(json_idea_log) {
                let query = json_idea_log['idea_logs']
                if (query['mode'] == 'join') {
                    var user_id = 'participant_' + query['user_id']
                    if ($('#' + user_id).length === 0) {
                        $('.users').append(`<li id="participant_${query['user_id']}"><i class="user circle icon">${query['join']['user_mail']}</i></li>`)
                    }
                } else if (query['mode'] == 'add') {
                    // let query = idea_log['idea_logs']
                    let add = query["add"]
                    var escapeHTML = function (val) {
                        return $('<div />').text(val).html();
                    };
                    const idea_text = escapeHTML(add["content"]);

                    if (idea_text == null || idea_text == "") {
                        return false;
                    }

                    var id = parseInt(localStorage.getItem('card_id')) + 1;
                    var div = $(
                        '<div class="teal card idea none" id="' + id + '">\n' +
                        '      <div class="content">\n' +
                        idea_text +
                        '      </div>\n' +
                        '    </div>'
                    );
                    $("#ideas").prepend(div);
                    $('#' + id).show('slide', '', 500);
                    localStorage.setItem('card_id', id);
                }
            },
            add: function (json_idea_log) {
                return this.perform('add',
                    json_idea_log
                );
            }
        });

        $(document).on('keypress', '[data-behavior~=idea_speaker]', function (event) {
            if (event.keyCode === 13) {
                if (event.target.value === "") return false
                let add = {
                    content: event.target.value
                };
                consumer.task.add(add);
                event.target.value = '';
                return event.preventDefault();
            }
        });
    } else {
        if (consumer.task) {
            consumer.task.unsubscribe()
        }
    }
});
