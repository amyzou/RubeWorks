class RemoveObjectIdFromDisplays < ActiveRecord::Migration
  def up
    remove_column :displays, :object_id
      end

  def down
    add_column :displays, :object_id, :integer
  end
end
