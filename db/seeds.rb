# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

# Categories are: inert/gadget/roamer/carrier

# Block
block = ObjectProperty.create(
	name: 					'block',
    category: 				'inert', 
    block_num: 				1, 
	blocks: 				[[0,0,0]],
    mass:					1.0,
    elasticity:				1.0,
    change_in_height:		0,
    io_map:					'map',
    compatible_roamers:		'array',
    roamer_position_nodes:	'array'
    # animation_map: ;
)
block.display = Display.create(
	image_file: 			'block.png', 
	obj_file: 				'null', 
	texture_file: 			'null', 
)
block.updateDisplay

# Domino
domino = ObjectProperty.create(
	name: 					'domino',
    category: 				'roamer', 
    block_num: 				1, 
	blocks: 				[[0,0,0]],
    mass:					1.0,
    elasticity:				1.0,
    change_in_height:		0,
    io_map:					'map',
    compatible_roamers:		'array',
    roamer_position_nodes:	'array'
)
domino.display = Display.create(
	image_file: 			'dominoes.png', 
	obj_file: 				'null', 
	texture_file: 			'null', 
)
domino.updateDisplay

# Fan
fan = ObjectProperty.create(
	name: 					'fan',
    category: 				'gadget', 
    block_num: 				1, 
	blocks: 				[[0,0,0]],
    mass:					1.0,
    elasticity:				1.0,
    change_in_height:		0,
    io_map:					'map',
    compatible_roamers:		'array',
    roamer_position_nodes:	'array'
)
fan.display = Display.create(
	image_file: 			'fan.png', 
	obj_file: 				'null', 
	texture_file: 			'null', 
)
fan.updateDisplay

# Ramp
ramp = ObjectProperty.create(
	name: 					'ramp',
    category: 				'carrier', 
    block_num: 				3, 
	blocks: 				[[0,0,0], [0,1,0], [0,1,1]],
    mass:					1.0,
    elasticity:				1.0,
    change_in_height:		0,
    io_map:					'map',
    compatible_roamers:		'array',
    roamer_position_nodes:	'array'
)
ramp.display = Display.create(
	image_file: 			'ramp.png', 
	obj_file: 				'null', 
	texture_file: 			'null', 
)
ramp.updateDisplay

# Sphere
sphere = ObjectProperty.create(
	name: 					'sphere',
    category: 				'roamer', 
    block_num: 				1, 
	blocks: 				[[0,0,0]],
    mass:					1.0,
    elasticity:				1.0,
    change_in_height:		0,
    io_map:					'map',
    compatible_roamers:		'array',
    roamer_position_nodes:	'array'
)
sphere.display = Display.create(
	image_file: 			'sphere.png', 
	obj_file: 				'sphere.obj', 
	texture_file: 			'null', 
)
sphere.updateDisplay

# Trampoline
trampoline = ObjectProperty.create(
	name: 					'trampoline',
    category: 				'carrier', 
    block_num: 				1, 
	blocks: 				[[0,0,0]],
    mass:					1.0,
    elasticity:				1.0,
    change_in_height:		0,
    io_map:					'map',
    compatible_roamers:		'array',
    roamer_position_nodes:	'array'
)
trampoline.display = Display.create(
	image_file: 			'tramp.png', 
	obj_file: 				'trampoline.obj', 
	texture_file: 			'null', 
)
trampoline.updateDisplay

