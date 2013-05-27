class ObjectProperty < ActiveRecord::Base
	has_one :display
	serialize :blocks
	serialize :roamer_position_nodes
	serialize :compatible_roamers
  	attr_accessible :name, :category, :block_num, :blocks, :mass, :elasticity, :change_in_height, :io_map, :compatible_roamers, :roamer_position_nodes

  	def updateDisplay
		setRotations
		display.update_attributes(:category => category, :block_num => block_num, :blocks => blocks)
		save!
	end

	# Changes blocks to an array of block lists if there is more than one block.
	def setRotations
		if blocks.size != 1
			rotations = Array.new
			rotations.push(blocks)
			for i in 1..3
				new_blocks = Array.new
				rotations[i-1].each do |point|
					new_point = Array.new(3)
					new_point[0] = point[1]
					new_point[1] = -point[0]
					new_point[2] = point[2]
					new_blocks.push(new_point)
				end
				rotations.push(new_blocks)
			end
			update_attributes(:blocks => rotations)
			save!
		end
	end
end