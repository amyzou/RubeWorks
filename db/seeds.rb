# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

Display.create(object_id: 1, image_file: 'block.png')
Display.create(object_id: 2, image_file: 'dominoes.png')
Display.create(object_id: 3, image_file: 'fan.png')
Display.create(object_id: 4, image_file: 'ramp.png')
Display.create(object_id: 5, image_file: 'sphere.png', obj_file: 'sphere.obj')
Display.create(object_id: 6, image_file: 'tramp.png')
