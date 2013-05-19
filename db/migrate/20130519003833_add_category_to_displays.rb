class AddCategoryToDisplays < ActiveRecord::Migration
  def change
    add_column :displays, :category, :string
  end
end
