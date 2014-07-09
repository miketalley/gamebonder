class CreateReasons < ActiveRecord::Migration
  def change
    create_table :reasons do |t|
      t.text :description, unique: true
      t.integer :strength, default: 1
      t.references :bond

      t.timestamps
    end
  end
end
