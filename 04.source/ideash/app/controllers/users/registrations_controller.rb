# frozen_string_literal: true

class Users::RegistrationsController < Devise::RegistrationsController
  layout 'head_left_layout', only: [:profile_edit, :profile_update]
  # before_action :configure_sign_up_params, only: [:create]
  # before_action :configure_account_update_params, only: [:update]

  # GET /resource/sign_up
  # def new
  #   super
  # end

  # POST /resource
  # def create
  #   super
  # end

  # GET /resource/edit
  # def edit
  #   super
  # end

  # PUT /resource
  # def update
  #   super
  # end

  # DELETE /resource
  # def destroy
  #   super
  # end

  # GET /resource/cancel
  # Forces the session data which is usually expired after sign
  # in to be expired now. This is useful if the user wants to
  # cancel oauth signing in/up in the middle of the process,
  # removing all OAuth session data.
  # def cancel
  #   super
  # end

  # protected

  # If you have extra params to permit, append them to the sanitizer.
  # def configure_sign_up_params
  #   devise_parameter_sanitizer.permit(:sign_up, keys: [:attribute])
  # end

  # If you have extra params to permit, append them to the sanitizer.
  # def configure_account_update_params
  #   devise_parameter_sanitizer.permit(:account_update, keys: [:attribute])
  # end

  # The path used after sign up.
  def after_sign_up_path_for(resource)
    # super(resource)
    logger.debug("after_sign_up")
    idea_home_path
  end

  # The path used after sign up for inactive accounts.
  def after_inactive_sign_up_path_for(resource)
    # super(resource)
    account_signin_path
  end

  # サインイン時にサインアップを開いたときのリダイレクト先
  def after_sign_in_path_for(resource)
    idea_home_path
  end

  def profile_edit
    render('ideas/account')
  end

  def profile_update
    params[:user][:user_name] = params[:user][:user_name].gsub(/[[:space:]]/, '')
    current_user.assign_attributes(account_update_params)
    @is_updated = current_user.save
    render('ideas/account')
  end

  protected

  before_action :configure_account_update_params
  def configure_account_update_params
    devise_parameter_sanitizer.permit(:account_update, keys: [:user_name])
  end
end