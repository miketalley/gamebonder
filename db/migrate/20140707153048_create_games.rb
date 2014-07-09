class CreateGames < ActiveRecord::Migration
  def change
    create_table :games do |t|
      t.string :name
      t.string :icon_url
      t.string :thumb_url

      t.timestamps
    end
  end
end
