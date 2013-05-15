class Display < ActiveRecord::Base
  # attr_accessible :title, :body
  attr_accessible :object_id, :obj_file, :texture_file, :blocks

  serialize :blocks 
end
