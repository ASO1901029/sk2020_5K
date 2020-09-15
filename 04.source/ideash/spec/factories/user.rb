# FactoryBot.define do
#   factory :user_test do
#     user_name{'test'}
#     email{'example@email.com'}
#     encrypted_password{'password'}
#     sign_in_count{1}
#   end
# end

FactoryBot.define do

  factory :user do
    pass = Faker::Internet.password(min_length: 8)
    user_name {Faker::Name.name}
    email {Faker::Internet.email}
    encrypted_password {pass}
  end
end

#  id                     :integer          not null, primary key
#  user_name              :string
#  email                  :string           not null
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  encrypted_password     :string           default(""), not null
#  reset_password_token   :string
#  reset_password_sent_at :datetime
#  remember_created_at    :datetime
#  sign_in_count          :integer          default(0), not null
#  current_sign_in_at     :datetime
#  last_sign_in_at        :datetime
#  current_sign_in_ip     :string
#  last_sign_in_ip        :string
#  confirmation_token     :string
#  confirmed_at           :datetime
#  confirmation_sent_at   :datetime
#  unconfirmed_email      :string
#  failed_attempts        :integer          default(0), not null
#  unlock_token           :string
#  locked_at              :datetime