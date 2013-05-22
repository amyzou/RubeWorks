class Display < ActiveRecord::Base
	# attr_accessible :title, :body
	belongs_to :object_property
	serialize :blocks
	attr_accessible :obj_file, :texture_file, :image_file, :blocks, :category, :block_num

	# Needs validation:
		# Obj File:		Exists in the correct folder (doesn't exist yet)
		# Texture File:	Exists in the correct folder (doesn't exist yet)
		# Image File:	Exists in the correct folder (assets/images? perhaps)
		# Blocks: 		Array of points, each of which are an array of 3 ints.
		# Category: 	One of the valid categories.

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
