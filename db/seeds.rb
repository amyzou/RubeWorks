# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

# Categories are: inert/gadget/roamer/carrier
Display.create(object_id: 1, image_file: 'block.png', category:'inert')
Display.create(object_id: 2, image_file: 'dominoes.png', category:'roamer')
Display.create(object_id: 3, image_file: 'fan.png', category:'gadget')
Display.create(object_id: 4, image_file: 'ramp.png', category:'carrier')
Display.create(object_id: 5, image_file: 'sphere.png', obj_file: 'sphere.obj', category:'roamer')
Display.create(object_id: 6, image_file: 'tramp.png', category:'carrier')
