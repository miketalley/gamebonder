class CreateBonds < ActiveRecord::Migration
  def change
    create_table :bonds do |t|
      t.references :source
      t.references :target
      t.integer :strength

      t.timestamps
    end
  end
end
