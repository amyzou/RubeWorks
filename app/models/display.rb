class Display < ActiveRecord::Base
  # attr_accessible :title, :body
  attr_accessible :object_id, :obj_file, :texture_file, :image_file, :blocks, :category

  serialize :blocks 
end
