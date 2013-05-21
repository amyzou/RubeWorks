class CreateObjectProperties < ActiveRecord::Migration
  def up
    create_table :object_properties do |t|
      t.string  :name
      t.string  :category
      t.integer :block_num
      t.text    :blocks
      t.float   :mass
      t.float   :elasticity
      t.integer :change_in_height
      t.text    :io_map
      t.text    :compatible_roamers
      t.text    :roamer_position_nodes
    end    
  end
  
  def down
    drop_table :object_properties
  end
end
