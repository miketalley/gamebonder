class CreateReasons < ActiveRecord::Migration
  def change
    create_table :reasons do |t|
      t.references :bond
      t.text :description, unique: true
      t.integer :strength, default: 1

      t.timestamps
    end
  end
end
