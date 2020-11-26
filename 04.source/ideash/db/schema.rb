# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2020_07_28_025739) do

  create_table "idea_categories", force: :cascade do |t|
    t.string "idea_category_name", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "manage_name"
    t.index ["idea_category_name"], name: "index_idea_categories_on_idea_category_name", unique: true
  end

  create_table "idea_logs", force: :cascade do |t|
    t.string "idea_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.boolean "is_active", default: false, null: false
    t.json "query"
    t.index ["idea_id"], name: "index_idea_logs_on_idea_id"
  end

  create_table "ideas", id: :string, force: :cascade do |t|
    t.integer "idea_category_id"
    t.string "idea_name"
    t.string "idea_description"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.json "option"
    t.string "hash_link"
    t.index ["idea_category_id"], name: "index_ideas_on_idea_category_id"
  end

  create_table "user_ideas", force: :cascade do |t|
    t.integer "user_id"
    t.string "idea_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["idea_id"], name: "index_user_ideas_on_idea_id"
    t.index ["user_id"], name: "index_user_ideas_on_user_id"
  end

  create_table "user_logs", force: :cascade do |t|
    t.integer "user_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["user_id"], name: "index_user_logs_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "user_name"
    t.string "email", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string "current_sign_in_ip"
    t.string "last_sign_in_ip"
    t.string "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string "unconfirmed_email"
    t.integer "failed_attempts", default: 0, null: false
    t.string "unlock_token"
    t.datetime "locked_at"
    t.index ["confirmation_token"], name: "index_users_on_confirmation_token", unique: true
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
    t.index ["unlock_token"], name: "index_users_on_unlock_token", unique: true
  end

  add_foreign_key "idea_logs", "ideas"
  add_foreign_key "ideas", "idea_categories"
  add_foreign_key "user_ideas", "ideas"
  add_foreign_key "user_ideas", "users"
  add_foreign_key "user_logs", "users"
end
