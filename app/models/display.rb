class Display < ActiveRecord::Base
	# attr_accessible :title, :body
	attr_accessible :object_id, :obj_file, :texture_file, :image_file, :blocks, :category
	serialize :blocks 
	set_primary_key :object_id

	# Needs validation:
		# Object ID: 	Needs to be unique, and refer to an ID within object table (doesn't exist yet)
		# Obj File:		Exists in the correct folder (doesn't exist yet)
		# Texture File:	Exists in the correct folder (doesn't exist yet)
		# Image File:	Exists in the correct folder (assets/images? perhaps)
		# Blocks: 		Array of points, each of which are an array of 3 ints.
		# Category: 	One of the valid categories.
end
