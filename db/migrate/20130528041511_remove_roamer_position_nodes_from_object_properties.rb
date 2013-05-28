class RemoveRoamerPositionNodesFromObjectProperties < ActiveRecord::Migration
  def up
    remove_column :object_properties, :roamer_position_nodes
      end

  def down
    add_column :object_properties, :roamer_position_nodes, :text
  end
end
