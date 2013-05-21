class AddObjectPropertyIdToDisplays < ActiveRecord::Migration
  def change
    add_column :displays, :object_property_id, :integer
  end
end
