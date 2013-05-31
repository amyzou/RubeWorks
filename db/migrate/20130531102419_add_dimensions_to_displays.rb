class AddDimensionsToDisplays < ActiveRecord::Migration
  def change
    add_column :displays, :dimensions, :text
  end
end
