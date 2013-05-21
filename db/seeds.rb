# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

# Categories are: inert/gadget/roamer/carrier
Display.create(
	object_id: 1, 
	category:'inert', 
	image_file: 'block.png', 
	obj_file: 'null', 
	texture_file: 'null', 
	block_num: 1, 
	blocks: '1'
)

Display.create(
	object_id: 2, 
	category:'roamer',
	image_file: 'dominoes.png', 
	obj_file: 'null', 
	texture_file: 'null', 
	block_num: 1, 
	blocks: '1'
)

Display.create(
	object_id: 3, 
	category:'gadget', 
	image_file: 'fan.png', 
	obj_file: 'null', 
	texture_file: 'null', 
	block_num: 1, 
	blocks: '1'
)

Display.create(
	object_id: 4, 
	category:'carrier', 
	image_file: 'ramp.png', 
	obj_file: 'null', 
	texture_file: 'null', 
	block_num:1, 
	blocks:'1'
)

Display.create(
	object_id: 5, 
	category:'roamer', 
	image_file: 'sphere.png', 
	obj_file: 'sphere.obj', 
	texture_file: 'sphere', 
	block_num: 1, 
	blocks:'[[0,0,0]]'
)

Display.create(
	object_id: 6, 
	image_file: 'tramp.png', 
	category:'carrier', 
	obj_file: 'null', 
	texture_file: 'null', 
	block_num: 1, 
	blocks:'1'
)
