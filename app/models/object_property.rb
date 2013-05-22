class ObjectProperty < ActiveRecord::Base
	has_one :display

  	attr_accessible :name, :category, :block_num, :blocks, :mass, :elasticity, :change_in_height, :io_map, :compatible_roamers, :roamer_position_nodes

  	def updateDisplay
		display.update_attributes(:category => category, :block_num => block_num, :blocks => blocks)
		display.setRotations
		save!
	end
end