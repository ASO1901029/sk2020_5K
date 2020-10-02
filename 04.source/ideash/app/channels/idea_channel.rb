class IdeaChannel < ApplicationCable::Channel
  def subscribed
    stream_from "idea_channel_#{params[:idea]}"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def speak(data)
    # ActionCable.server.broadcast 'idea_channel', idea_log: data['idea_log']
    IdeaLog.create! idea_id: params[:idea], query: {'user_id': current_user.id, 'mode': 'add', 'add': data['idea_log']}
  end

  def add(data)
    res = ActiveRecord::Base.connection.execute("select count(*) from idea_logs where idea_id = '#{params[:idea]}' and JSON_EXTRACT(query, '$.mode') = 'add' ")
    # TODO Timeを保存する処理を追加する
    IdeaLog.create! idea_id: params[:idea], query: {'user_id': current_user.id, 'mode': 'add', 'add': {'object_id': res[0]['count(*)'], 'content': data["content"]}, 'time': DateTime.now}
  end

  def join_user()
    res = ActiveRecord::Base.connection.execute("select count(*) from idea_logs where idea_id = '#{params[:idea]}' and JSON_EXTRACT(query, '$.mode') = 'join' and JSON_EXTRACT(query, '$.user_id') = #{current_user.id}")
    if res[0]['count(*)'] > 0
      return
    end
    IdeaLog.create! idea_id: params[:idea], query: {'user_id': current_user.id, 'mode': 'join', 'join': {'user_mail': current_user.email}}
  end

  def set_timer()
    IdeaLog.create! idea_id: params[:idea], query: {'user_id': current_user.id, 'mode': 'system', 'system': {'operation': 'sample_operation', 'option': 'sample_option'}}
  end
end