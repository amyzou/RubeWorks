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
    io_map:                 [[[0,0,0,3],[1,0,0,1]]],
    compatible_roamers:     'null',
)
dominos.display = Display.create(
    image_file:             'dominoes.png', 
    obj_file:               'dominos.js', 
    texture_file:           'dominos.jpg', 
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
    obj_file:               'ball.js', 
    texture_file:           'null', 
)
sphere.updateDisplay

# # Trampoline
# trampoline = ObjectProperty.create(
#     name:                   'trampoline',
#     category:               'carrier', 
#     block_num:              1, 
#     blocks:                 [[0,0,0]],
#     mass:                   1.0,
#     elasticity:             1.0,
#     change_in_height:       0,
#     io_map:                 [],
#     compatible_roamers:     'array',
# )
# trampoline.display = Display.create(
#     image_file:             'tramp.png', 
#     obj_file:               'ball.js', 
#     texture_file:           'null', 
# )
# trampoline.updateDisplay

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
    io_map:                 [[[0,0,2,3],[0,0,2,1]], [[0,0,2,1],[0,0,2,3]]],
    compatible_roamers:     [5],
)
straightRail.display = Display.create(
    image_file:             'straightRail.PNG',
    obj_file:               'StraightRail.js',
    texture_file:           'null',
)
straightRail.updateDisplay

#Long Straight Rail Object
lstraightRail = ObjectProperty.create(
    name:                   'Long straight rail',
    category:               'carrier',
    block_num:              4,
    blocks:                 [[1,0,0],[0,0,1],[1,0,1],[2,0,1]],
    mass:                   12.0,
    elasticity:             1.0, 
    change_in_height:       0,
    #Relative Animation Information
    io_map:                 [[[0,0,2,3],[2,0,2,1]], [[2,0,2,1],[0,0,2,3]]],
    compatible_roamers:     [5],
)
lstraightRail.display = Display.create(
    image_file:             'lstraightrail.png',
    obj_file:               'LongStraightRail.js',
    texture_file:           'null',
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
)
shortColumn.updateDisplay

# Semi Circle Rail
semiCircleRail = ObjectProperty.create(
    name:                   'Semi Circle Rail',
    category:               'carrier', 
    block_num:              10, 
    blocks:                 [#Base First, First includes first part of rali...
                             [1,1,0], [1,2,0],
                             #Rail...
                             [0,0,1],[1,0,1],[0,1,1],[1,1,1],[0,2,1],[1,2,1],[0,3,1],[1,3,1]
                            ],
    mass:                   5.0,
    elasticity:             0.25,
    change_in_height:       0,
                            #In face = x,y,z, face
    io_map:                 [[0,0,1,3],
                             #Out face = x,y,z, face, radius (in blocks), degrees
                             #In this example, if the center of the rail is at the origin,
                             # then then at 90 degrees, the block will be [1,0,0], ignoring 
                             # the z-axis arrangement for now.
                             [0,3,1,3,1,180],
                             # in-face
                             [0,3,1,3],
                             #outFace
                             [0,0,1,3,1,180]
                             ],

    compatible_roamers:     [5],
)
semiCircleRail.display = Display.create(
    image_file:             'scRail.png', 
    obj_file:               'SemiCircleRail.js', 
    texture_file:           'null', 
)
semiCircleRail.updateDisplay
