class BrainstormingController < ApplicationController
  layout 'head_left_layout'
  def replay
    check_idea_category
  end

  def edit
    check_idea_category
    @idea = Idea.find_by(id: params[:id])
    @idea_logs = @idea.idea_logs
    @idea_users = @idea.user
    # 既に登録されているかどうか
    is_added_user = @idea_users.where(id: current_user.id).exists?
    unless is_added_user
      #TODO: 公開状態でない場合はアクセスしてきたユーザを蹴る(公開状態の実装後)
      # redirect_to idea_home_path
      user = User.find_by(id: current_user.id)
      user_idea = user.user_idea.new do |idea|
        idea.user_id = user.id
        idea.idea_id = @idea.id
      end
      user_idea.save
    end

    @grouping_contents = @idea_logs.get_group_object_id(@idea.id)
  end

  def create
    user = User.find_by(id: current_user.id)
    new_idea = user.idea.new do |idea|
      idea.idea_category_id = 2
      idea.idea_name = params[:theme]
    end

    if new_idea.save!
      if !params[:is_unlimited]
        IdeaLog.create! idea_id: new_idea.id, query: {'user_id': current_user.id, 'mode': 'system', 'system': {'operation': 'process1', 'option': '0'}}
        IdeaLog.create! idea_id: new_idea.id, query: {'user_id': current_user.id, 'mode': 'system', 'system': {'operation': 'process2', 'option': '0'}}
        IdeaLog.create! idea_id: new_idea.id, query: {'user_id': current_user.id, 'mode': 'system', 'system': {'operation': 'process3', 'option': '0'}}
      else
        if Rails.env.development?
          # テスト用(秒単位)
          IdeaLog.create! idea_id: new_idea.id, query: {'user_id': current_user.id, 'mode': 'system', 'system': {'operation': 'process1', 'option': (params[:process1].to_i).to_s}}
          IdeaLog.create! idea_id: new_idea.id, query: {'user_id': current_user.id, 'mode': 'system', 'system': {'operation': 'process2', 'option': (params[:process2].to_i).to_s}}
          IdeaLog.create! idea_id: new_idea.id, query: {'user_id': current_user.id, 'mode': 'system', 'system': {'operation': 'process3', 'option': (params[:process3].to_i).to_s}}
        else
          # 本番用(分単位)
          IdeaLog.create! idea_id: new_idea.id, query: {'user_id': current_user.id, 'mode': 'system', 'system': {'operation': 'process1', 'option': (params[:process1].to_i * 60).to_s}}
          IdeaLog.create! idea_id: new_idea.id, query: {'user_id': current_user.id, 'mode': 'system', 'system': {'operation': 'process2', 'option': (params[:process2].to_i * 60).to_s}}
          IdeaLog.create! idea_id: new_idea.id, query: {'user_id': current_user.id, 'mode': 'system', 'system': {'operation': 'process3', 'option': (params[:process3].to_i * 60).to_s}}
        end
      end

      IdeaLog.create! idea_id: new_idea.id, query: {'user_id': current_user.id, 'mode': 'group', 'group': {'group_id': 0, 'name': 'no_grouped'}}
      IdeaLog.create! idea_id: new_idea.id, query: {'user_id': current_user.id, 'mode': 'group', 'group': {'group_id': 1, 'name': 'グループ1'}}
      IdeaLog.create! idea_id: new_idea.id, query: {'user_id': current_user.id, 'mode': 'group', 'group': {'group_id': 2, 'name': 'グループ2'}}

      logger.debug "create new idea: #{new_idea.inspect}"
      redirect_to idea_brainstorming_edit_url(id: new_idea.id)
    else
    end
  end

  def new
  end
end
