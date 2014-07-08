class CreateGames < ActiveRecord::Migration
  def change
    create_table :games do |t|
      t.string :name
      t.string :giant_bomb_id, unique: true
      t.string :icon_url

      t.timestamps
    end
  end
end
