class CreateReasons < ActiveRecord::Migration
  def change
    create_table :reasons do |t|

      t.timestamps
    end
  end
end
