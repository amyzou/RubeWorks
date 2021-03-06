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
    obj_file:               '', 
    texture_file:           'null', 
    description:            'Simple building block. 1x1',
)
block.updateDisplay

# Triple block.
tBlock = ObjectProperty.create(
    name:                   'triple block',
    category:               'inert',
    block_num:              3, 
    blocks:                 [[0,0,0],[1,0,0],[2,0,0]],
    mass:                   1.0,
    elasticity:             1.0,
    change_in_height:       0,
    io_map:                 [],
    compatible_roamers:     'array',
)
tBlock.display = Display.create(
    image_file:             '3blocks.png', 
    obj_file:               'ThreeBlock.js', 
    texture_file:           'null', 
    description:            'Blocks. 3x1.',
)
tBlock.updateDisplay


#Archway
archway = ObjectProperty.create(
    name:                   'archway',
    category:               'inert',
    block_num:              5,
    blocks:                 [[0,0,0],[0,2,0],[0,0,1],[0,1,1],[0,2,1]],
    mass:                   6.0,
    elasticity:             1.0, 
    change_in_height:       0,
    #Relative Animation Information
    io_map:                 [],
    compatible_roamers:     [5],
)
archway.display = Display.create(
    image_file:             'archway.png',
    obj_file:               'archway.js',
    texture_file:           'null',
    description:            'Archway. Can be used as a tunnel.',
)
archway.updateDisplay


# Platform
platform = ObjectProperty.create(
    name:                   'platform',
    category:               'inert',
    block_num:              3, 
    blocks:                 [[0,0,0],[1,0,0],[2,0,0]],
    mass:                   1.0,
    elasticity:             1.0,
    change_in_height:       0,
    io_map:                 [],
    compatible_roamers:     'array',
)
platform.display = Display.create(
    image_file:             'platform.png', 
    obj_file:               'Platform.js', 
    texture_file:           'null', 
    description:            'Platform. 3 blocks wide. Use it to bridge between other inerts. Note that objects cannot roll under the gap.',
)
platform.updateDisplay

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
    io_map:                 [[[0,0,0,3],[1,0,0,1]]],
    compatible_roamers:     'null',
)
dominos.display = Display.create(
    image_file:             'dominoes.png', 
    obj_file:               'dominos.js', 
    texture_file:           'dominosTex.jpg', 
    description:            'Set of 3 dominos. Can be knocked over or chained together. Their fall is one directional.',
)
dominos.updateDisplay

# Ramp
#Can we rename 'ramp' to 'low wood ramp'?
ramp = ObjectProperty.create(
    name:                   'ramp',
    category:               'carrier', 
    block_num:              5, 
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
                                [[0,0,1,5],[2,0,0,1],"linear",[0.5,0,1.5],[3,0,0]],
                                [[1,0,1,5],[2,0,0,1],"linear",[1.5,0,1],[3,0,0]],
                                [[1,0,0,5],[2,0,0,1],"linear",[1.5,0,1],[3,0,0]],
                                [[2,0,0,5],[2,0,0,1],"linear",[2.5,0,0.5],[3,0,0]]
                            ],
    compatible_roamers:     [5],
)
ramp.display = Display.create(
    image_file:             'ramp.png', 
    obj_file:               'ramp.js', 
    texture_file:           'ramp.jpg',
    description:            'Ramp. 3x2. Objects cannot be placed directly on these.',
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
    image_file:             'ball.png', 
    obj_file:               'ball.js', 
    texture_file:           'null', 
    description:            'Sphere. Can travel across various other objects. Cannot be placed directly on a carrier.',
)
sphere.updateDisplay

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
    image_file:             'starterarrow.png',
    obj_file:               'StarterArrow.js',
    texture_file:           'null',
    description:            'Initial force! Can be applied to roamers or gadgets to initiate interactions. Recommended to only use one.',
)
arrow.updateDisplay

#Straight Rail Object
straightRail = ObjectProperty.create(
    name:                   'straight rail',
    category:               'carrier',
    block_num:              1,
    blocks:                 [[0,0,0]],
    mass:                   6.0,
    elasticity:             1.0, 
    change_in_height:       0,
    #Relative Animation Information
    io_map:                 [[[0,0,0,3],[0,0,0,1], "linear", [0,0,0],[1,0,0]],
                             [[0,0,0,1],[0,0,0,3], "linear", [1,0,0],[0,0,0]]],
    compatible_roamers:     [5],
)
straightRail.display = Display.create(
    image_file:             'straight_rail.png',
    obj_file:               'StraightRail.js',
    texture_file:           'null',
    description:            'Simple rail. 1 block long.',
)
straightRail.updateDisplay

#Long Straight Rail Object
lstraightRail = ObjectProperty.create(
    name:                   'Long straight rail',
    category:               'carrier',
    block_num:              3,
    blocks:                 [[0,0,0],[1,0,0],[2,0,0]],
    mass:                   12.0,
    elasticity:             1.0, 
    change_in_height:       0,
    #Relative Animation Information
    io_map:                 [
                            [[0,0,0,3],[2,0,0,1], "linear", [0,0,0],[2,0,0]],
                            [[2,0,0,1],[0,0,0,3], "linear", [2,0,0],[0,0,0]]
                            ],
    compatible_roamers:     [5],
)
lstraightRail.display = Display.create(
    image_file:             'longstraightrail.png',
    obj_file:               'LongStraightRail.js',
    texture_file:           'null',
    description:            'Simple rail. 3 blocks long. Make sure to add inert support pieces under all three blocks if building higher up.',
)
lstraightRail.updateDisplay

# Short Column
shortColumn = ObjectProperty.create(
    name:                   'Short Column',
    category:               'inert', 
    block_num:              2, 
    blocks:                 [[0,0,0],[0,0,1]],
    mass:                   5.0,
    elasticity:             0.25,
    change_in_height:       0,
    io_map:                 [],
    compatible_roamers:     'array',
)
shortColumn.display = Display.create(
    image_file:             'shortColumn.png', 
    obj_file:               'ShortColumn.js', 
    texture_file:           'null', 
    description:            'Simple column. 2 blocks tall.',
)
shortColumn.updateDisplay

# Rail Ramp
railRamp = ObjectProperty.create(
    name:                   'Rail Ramp',
    category:               'carrier',
    block_num:              1,
    blocks:                 [[0,0,0]],
    mass:                   5.0,
    elasticity:             1.0, 
    change_in_height:       1,
    #Relative Animation Information
    io_map:                 [[[0,0,1,3],[0,0,0,1],"linear",[0,0,1],[1,0,0]],
                             [[0,0,0,1],[0,0,1,3],"linear",[1,0,0],[0,0,1]]],
    compatible_roamers:     [5],
)
railRamp.display = Display.create(
    image_file:             'railramp.png',
    obj_file:               'RailRamp.js',
    texture_file:           'null',
    description:            'Simple rail ramp. 1 block long.',
)
railRamp.updateDisplay

# Turn Rail
turnRail = ObjectProperty.create(
    name:                   'Turn Rail',
    category:               'carrier',
    block_num:              1,
    blocks:                 [[0,0,0]],
    mass:                   5.0,
    elasticity:             1.0, 
    change_in_height:       0,
    #Relative Animation Information
    io_map:                 [[[0,0,0,3],[0,0,0,2], "linear", [0,0,0],[0,1,0]],
                             [[0,0,0,2],[0,0,0,3], "linear", [0,1,0],[0,0,0]]],
    compatible_roamers:     [5],
)
turnRail.display = Display.create(
    image_file:             'turnrail.png',
    obj_file:               'TurnRail.js',
    texture_file:           'null',
    description:            'Simple rail 90 degree turn. 1 block long.',
)
turnRail.updateDisplay

#Warper Block

# Turn Rail
warperBlock = ObjectProperty.create(
    name:                   'Warper Block',
    category:               'carrier',
    block_num:              1,
    blocks:                 [[0,0,0]],
    mass:                   5.0,
    elasticity:             1.0, 
    change_in_height:       0,
    #Relative Animation Information
    io_map:                 [[[0,0,0,3],[0,0,0,2], "linear", [0,0,0],[0,0,1]],
                             [[0,0,0,2],[0,0,0,2], "linear", [0,0,1],[0,0,1]],
                             [[0,0,0,1],[0,0,0,2], "linear", [1,0,0],[0,0,1]],
                             [[0,0,0,0],[0,0,0,2], "linear", [0,1,0],[0,1,0]]
                             ],
    compatible_roamers:     [5],
)
warperBlock.display = Display.create(
    image_file:             'TransporterBlock.png',
    obj_file:               'TransporterBlock.js',
    texture_file:           'warperBlockTex.jpg',
    description:            'Direction changer. Roamers passing over will go the direction of the arrow.',
)
warperBlock.updateDisplay

# Bent Dominos Gadget
bdominos = ObjectProperty.create(
    name:                   'Bent dominos',
    category:               'gadget', 
    block_num:              1, 
    blocks:                 [[0,0,0]],
    #Animation data... what is it?
    mass:                   1.0,
    elasticity:             1.0,
    change_in_height:       0,
    io_map:                 [[[0,0,0,3],[0,0,0,2]]],
    compatible_roamers:     'null',
)
bdominos.display = Display.create(
    image_file:             'BendDominos.png', 
    obj_file:               'BendDominos.js', 
    texture_file:           'dominosTex.jpg', 
    description:            'Set of two dominos, making a 90 degree turn. Can be knocked over or chained together. Their fall is one directional.',
)
bdominos.updateDisplay


# Bent Dominos Gadget
railColumn = ObjectProperty.create(
    name:                   'Rail Column',
    category:               'inert', 
    block_num:              1, 
    blocks:                 [[0,0,0]],
    #Animation data... what is it?
    mass:                   1.0,
    elasticity:             1.0,
    change_in_height:       0,
    io_map:                 [],
    compatible_roamers:     'null',
)
railColumn.display = Display.create(
    image_file:             'railcolumn.png', 
    obj_file:               'RailColumn.js', 
    texture_file:           'none', 
    description:            'Post. Can be stacked to build things taller.',
)
railColumn.updateDisplay

# Triple Post
tColumn = ObjectProperty.create(
    name:                   'triple rail post',
    category:               'inert',
    block_num:              3, 
    blocks:                 [[0,0,0],[1,0,0],[2,0,0]],
    mass:                   1.0,
    elasticity:             1.0,
    change_in_height:       0,
    io_map:                 [],
    compatible_roamers:     'array',
)
tColumn.display = Display.create(
    image_file:             'threepost.png', 
    obj_file:               'TripleColumn.js', 
    texture_file:           'null', 
    description:            'A set of 3 posts.',
)
tColumn.updateDisplay

# Train Gadget
train = ObjectProperty.create(
    name:                   'train',
    category:               'gadget', 
    block_num:              11, 
    blocks:                 [[0,0,0],[1,0,0],[2,0,0],
                             [3,0,0],[4,0,0],[5,0,0],
                             [6,0,0],[7,0,0],[8,0,0],
                             [9,0,0],[10,0,0]
                             ],
    #Animation data... what is it?
    mass:                   1.0,
    elasticity:             1.0,
    change_in_height:       0,
    io_map:                 [[[0,0,0,3],[10,0,0,1]]],
    compatible_roamers:     'null',
)
train.display = Display.create(
    image_file:             'train.png', 
    obj_file:               'train.js', 
    texture_file:           'null', 
    description:            'Train. Start the train going by hitting the button.'
)
train.updateDisplay

# Mallet Gadget
mallet = ObjectProperty.create(
    name:                   'mallet',
    category:               'gadget', 
    block_num:              8, 
    blocks:                 [[0,0,0],[1,0,0],
                             [0,0,1],[1,0,1],
                             [0,0,2],[1,0,2],
                             [0,0,3],[1,0,3]
                             ],
    #Animation data... what is it?
    mass:                   1.0,
    elasticity:             1.0,
    change_in_height:       0,
    io_map:                 [[[0,0,3,3],[0,0,0,3]]],
    compatible_roamers:     'null',
)
mallet.display = Display.create(
    image_file:             'mallet.png', 
    obj_file:               'Mallet.js', 
    texture_file:           'null', 
    description:            'Swinging hammer. Hit the right side of the hammer and it will swing down.'
)
mallet.updateDisplay


