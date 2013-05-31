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
    name:                   'block',
    category:               'inert', 
    block_num:              1, 
    blocks:                 [[0,0,0]],
    mass:                   1.0,
    elasticity:             1.0,
    change_in_height:       0,
    io_map:                 [],
    compatible_roamers:     'array',
)
block.display = Display.create(
    image_file:             'block.png', 
    obj_file:               'null', 
    texture_file:           'null', 
)
block.updateDisplay

# Dominos Gadget
dominos = ObjectProperty.create(
    name:                   'dominos',
    category:               'gadget', 
    block_num:              2, 
    blocks:                 [[0,0,0],[1,0,0]],
    #Animation data... what is it?
    mass:                   1.0,
    elasticity:             1.0,
    change_in_height:       0,
    io_map:                 [[[0,0,0,3],[1,0,0,5]]],
    compatible_roamers:     'null',
)
dominos.display = Display.create(
    image_file:             'dominoes.png', 
    obj_file:               'dominos.js', 
    texture_file:           'dominosTex.jpg', 
)
dominos.updateDisplay

# Ramp
#Can we rename 'ramp' to 'low wood ramp'?
ramp = ObjectProperty.create(
    name:                   'ramp',
    category:               'carrier', 
    block_num:              6, 
    blocks:                 [[0,0,0], [1,0,0], [2,0,0], [0,0,1], [1,0,1]], 
    mass:                   4.3,
    elasticity:             0.5,
    change_in_height:       3,
    #IO_Map: [Block position (offset by controller in canvas), in face]=> [Block position, out face]
    #In this example, block 5 (at (0,0,2)) received the ball at face 3.  It will return to the controller
    # the index in the block list "2", which correlates to block (2,0,0), and the face. 
    #This key, value represents rolling down the ramp.
    io_map:                 [
                             [[0,0,2,3],[2,0,0,1],"linear",[0,0,2],[3,0,0]],
                             [[2,0,0,1],[0,0,2,3],"linear",[3,0,0],[0,0,2]],
                             [[0,0,2,5],[2,0,0,1],"linear",[0,0,2],[3,0,0]],
                             [[0,0,2,5],[2,0,0,1],"linear",[0,0,2],[3,0,0]],
                             [[0,0,1,5],[2,0,0,1],"linear",[0.5,0,1.5],[3,0,0]],
                             [[1,0,1,5],[2,0,0,1],"linear",[1.5,0,1],[3,0,0]],
                             [[1,0,0,5],[2,0,0,1],"linear",[1.5,0,1],[3,0,0]],
                             [[2,0,0,5],[2,0,0,1],"linear",[2.5,0,0.5],[3,0,0]]
                             ],
    compatible_roamers:     [5],
    #The idea behind this would be
    # roamer_position_nodes: Hash[[5,3]=>[[0,0,2],[0.25,0,1.833],[0.5,0,1.666],[0.75,0,1.5]......]
    # in this way, we would have an input consisting of inface and inblock, and then translate that into the array of 
    # animation for the controller. 
)
ramp.display = Display.create(
    image_file:             'ramp.png', 
    obj_file:               'WoodRamp30.js', 
    texture_file:           'null',
)
ramp.updateDisplay

# Sphere
sphere = ObjectProperty.create(
    name:                   'sphere',
    category:               'roamer', 
    block_num:              1, 
    blocks:                 [[0,0,0]],
    mass:                   1.0,
    elasticity:             1.0,
    change_in_height:       0,
    io_map:                 [],
    compatible_roamers:     'array',
)
sphere.display = Display.create(
    image_file:             'sphere.png', 
    obj_file:               'sphere.obj', 
    texture_file:           'null', 
)
sphere.updateDisplay

# Trampoline
trampoline = ObjectProperty.create(
    name:                   'trampoline',
    category:               'carrier', 
    block_num:              1, 
    blocks:                 [[0,0,0]],
    mass:                   1.0,
    elasticity:             1.0,
    change_in_height:       0,
    io_map:                 [],
    compatible_roamers:     'array',
)
trampoline.display = Display.create(
    image_file:             'tramp.png', 
    obj_file:               'trampoline.obj', 
    texture_file:           'null', 
)
trampoline.updateDisplay

#Starter Object
arrow = ObjectProperty.create(
    name:                   'arrow',
    category:               'starter',
    block_num:              1,
    blocks:                 [[0,0,0]],
    #Initial momentum
    mass:                   1.0,
    elasticity:             1.0, 
    change_in_height:       0,
    io_map:                 [[[0,0,0,3],[0,0,0,1]]],
    compatible_roamers:     'array',
)
arrow.display = Display.create(
    image_file:             'arrow-png.png',
    obj_file:               'StarterArrow.js',
    texture_file:           'null',
)
arrow.updateDisplay

#Straight Rail Object
straightRail = ObjectProperty.create(
    name:                   'straight rail',
    category:               'carrier',
    block_num:              2,
    blocks:                 [[0,0,0],[0,0,1]],
    mass:                   6.0,
    elasticity:             1.0, 
    change_in_height:       0,
    #Relative Animation Information
    io_map:                 [[[0,0,1,3],[0,0,1,1]], [[0,0,1,1],[0,0,1,3]]]
    compatible_roamers:     [5],
)
straightRail.display = Display.create(
    image_file:             'straightRail.png',
    obj_file:               'StraightRail.js',
    texture_file:           'null',
)
strailRail.updateDisplay

