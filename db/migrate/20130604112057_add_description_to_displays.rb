class AddDescriptionToDisplays < ActiveRecord::Migration
  def change
    add_column :displays, :description, :text
  end
end
