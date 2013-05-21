class Display < ActiveRecord::Base
	# attr_accessible :title, :body
	belongs_to :object_property
	attr_accessible :obj_file, :texture_file, :image_file, :blocks, :category, :block_num

	# Needs validation:
		# Obj File:		Exists in the correct folder (doesn't exist yet)
		# Texture File:	Exists in the correct folder (doesn't exist yet)
		# Image File:	Exists in the correct folder (assets/images? perhaps)
		# Blocks: 		Array of points, each of which are an array of 3 ints.
		# Category: 	One of the valid categories.

end
