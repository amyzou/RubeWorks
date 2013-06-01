class ObjectProperty < ActiveRecord::Base
	has_one :display
	serialize :blocks
	serialize :compatible_roamers
	serialize :io_map
  	attr_accessible :name, :category, :block_num, :blocks, :mass, :elasticity, :change_in_height, :io_map, :compatible_roamers, :roamer_position_nodes

  	def updateDisplay
		setDimensions
		setRotations
		shiftPoints
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

	# NOT ROBUST. Assumes that the x width is larger than y depth.
	def shiftPoints
		node_delta = getNodesDelta
		for i in 0..3
			if block_num > 1
				blockSet = blocks[i]
				blockSet.each do |block|
					block = shiftPoint(block,i,display.dimensions[0] - 1)
				end
			end

			if io_map.size > 0
				rotation = io_map[i]
				rotation.each do |iomap|
					iomap[0] = shiftPoint(iomap[0],i,display.dimensions[0] - 1)
					iomap[1] = shiftPoint(iomap[1],i,display.dimensions[0] - 1)
					if iomap.size > 2
						iomap[3] = shiftPoint(iomap[3],i,node_delta)
						iomap[4] = shiftPoint(iomap[4],i,node_delta)
					end
				end
			end
		end
	end

	# Gets max x value of in/out nodes. (These are not the same as the blocks.)
	def getNodesDelta
		node_delta = display.dimensions[0] - 1
		io_map.each do |rotation|
			rotation.each do |iomap|
				if iomap.size > 2
					if iomap[3][0] > node_delta
						node_delta = iomap[3][0]
					end
					if iomap[4][0] > node_delta
						node_delta = iomap[4][0]
					end
				end
			end
		end
		return node_delta
	end

	def rotateIOMaps
		if io_map.size > 0
			rotations = Array.new
			rotations.push(io_map)
			for i in 1..3
				io_map_array = Array.new
				rotations[i-1].each do |iomap|
					new_io_map = iomap.clone
					new_io_map[0] = rotatePoint(iomap[0],i)
					new_io_map[1] = rotatePoint(iomap[1],i)
					if new_io_map.size > 2
						new_io_map[3] = rotatePoint(iomap[3],i)
						new_io_map[4] = rotatePoint(iomap[4],i)
					end
					io_map_array.push(new_io_map)
				end
				rotations.push(io_map_array)
			end
			update_attributes(:io_map => rotations)
			save!
		end
	end

	def rotateBlocks
		if block_num > 1
			rotations = Array.new
			rotations.push(blocks)
			for i in 1..3
				new_blocks = Array.new
				rotations[i-1].each do |point|
					new_blocks.push(rotatePoint(point,i))
				end
				rotations.push(new_blocks)
			end
			update_attributes(:blocks => rotations)
			save!
		end
	end


	def rotatePoint(point,direction)
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

	def shiftPoint(point,direction,delta)
		case direction
		when 1
			point[1] += delta
		when 2 
			point[0] += delta
		end
		return point
	end

	def setDimensions
		x = 0
		y = 0
		z = 0
		blocks.each do |block|
			if block[0] > x
				x = block[0]
			end
			if block[1] > y
				y = block[1]
			end
			if block[2] > z
				z = block[2]
			end
		end
		display.update_attributes(:dimensions => [x + 1, y + 1, z + 1])
		save!
	end
end