class CreateBonds < ActiveRecord::Migration
  def change
    create_table :bonds do |t|

      t.timestamps
    end
  end
end
