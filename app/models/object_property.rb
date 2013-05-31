class ObjectProperty < ActiveRecord::Base
	has_one :display
	serialize :blocks
	serialize :compatible_roamers
	serialize :io_map
  	attr_accessible :name, :category, :block_num, :blocks, :mass, :elasticity, :change_in_height, :io_map, :compatible_roamers, :roamer_position_nodes

  	def updateDisplay
		setDimensions
		setRotations
		display.update_attributes(
			:category => category, 
			:block_num => block_num, 
			:blocks => blocks, 
		)
		save!
	end

	# Changes blocks to an array of block lists if there is more than one block.
	def setRotations
		rotateBlocks
		rotateIOMaps
	end

	def rotateBlocks
		if blocks.size != 1
			rotations = Array.new
			rotations.push(blocks)
			for i in 1..3
				new_blocks = Array.new
				rotations[i-1].each do |point|
					new_blocks.push(rotatePoint(point))
				end
				rotations.push(new_blocks)
			end
			update_attributes(:blocks => rotations)
			save!
		end
	end

	# [["0,0,0,3","0,0,0,1"],["0,0,0,0","0,0,0,2"],["0,0,0,1","0,0,0,3"],["0,0,0,2","0,0,0,0"]]
	# [["0,0,2,3","2,0,0,1","linear",	[0,0,2],[3,0,0]]	,["2,0,0,1","0,0,2,3","linear",[3,0,0],[0,0,2]]]
	# [["0,0,2,0","0,-2,0,2","linear",	[0,0,2],[0,-3,0]]	,["0,-2,0,2","0,0,2,0","linear",[0,-3,0],[0,0,2]]]
	# [["0,0,2,1","-2,0,0,3","linear",	[0,0,2],[-3,0,0]]	,["-2,0,0,3","0,0,2,1","linear",[-3,0,0],[0,0,2]]]
	# [["0,0,2,2","0,2,0,0","linear",	[0,0,2],[0,3,0]]	,["0,2,0,0","0,0,2,2","linear",[0,3,0],[0,0,2]]]
	def rotateIOMaps
		if io_map.size > 0
			rotations = Array.new
			rotations.push(io_map)
			for i in 1..3
				io_map_array = Array.new
				rotations[i-1].each do |iomap|
					new_io_map = iomap.clone
					new_io_map[0] = rotatePoint(iomap[0])
					new_io_map[1] = rotatePoint(iomap[1])
					if new_io_map.size > 2
						new_io_map[3] = rotatePoint(iomap[3])
						new_io_map[4] = rotatePoint(iomap[4])
					end
					io_map_array.push(new_io_map)
				end
				rotations.push(io_map_array)
			end
			update_attributes(:io_map => rotations)
			save!
		end
	end

	def rotatePoint(point)
		new_point = point.clone
		tempx = point[0]
		new_point[0] = new_point[1]
		new_point[1] = -tempx
		return new_point
	end

	def nextFace(face_num)
		face_num += 1
		if face_num > 3
			face_num = 0
		end
		return face_num
	end


	def setDimensions
		x = 0
		y = 0
		z = 0
		blocks.each do |block|
			if block[0].to_s.to_i > x
				x = block[0].to_s.to_i
			end
			if block[1].to_s.to_i > y
				y = block[1].to_s.to_i
			end
			if block[2].to_s.to_i > z
				z = block[2].to_s.to_i
			end
		end
		display.update_attributes(:dimensions => [x+1, y+1, z+1])
		save!
	end
end