class CreateDisplays < ActiveRecord::Migration
  def up
    create_table :displays do |t|
    	t.column :object_id,	:integer
    	t.column :obj_file,		:string
    	t.column :texture_file,	:string
    	t.column :blocks,		:text
    end    
  end
  
  def down
    drop_table :displays
  end
end
