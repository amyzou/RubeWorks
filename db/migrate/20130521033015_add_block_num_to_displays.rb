class AddBlockNumToDisplays < ActiveRecord::Migration
  def change
    add_column :displays, :block_num, :integer
  end
end
