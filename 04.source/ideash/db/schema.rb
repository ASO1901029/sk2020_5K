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

ActiveRecord::Schema.define(version: 2020_06_23_040554) do

  create_table "idea_categories", force: :cascade do |t|
    t.string "idea_category_name", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "idea_logs", force: :cascade do |t|
    t.integer "idea_id"
    t.string "idea_log"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["idea_id"], name: "index_idea_logs_on_idea_id"
  end

  create_table "ideas", force: :cascade do |t|
    t.integer "idea_category_id"
    t.string "idea_name"
    t.string "idea_description"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["idea_category_id"], name: "index_ideas_on_idea_category_id"
  end

  create_table "user_ideas", force: :cascade do |t|
    t.integer "user_id"
    t.integer "idea_id"
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
    t.string "user_name", null: false
    t.string "user_mail", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  add_foreign_key "idea_logs", "ideas"
  add_foreign_key "ideas", "idea_categories"
  add_foreign_key "user_ideas", "ideas"
  add_foreign_key "user_ideas", "users"
  add_foreign_key "user_logs", "users"
end
