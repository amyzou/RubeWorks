class HomeController < ApplicationController
  def index
    @displays   = Display.all
    @inerts     = Display.where(:category => 'inert')
    @roamers    = Display.where(:category => 'roamer')
    @gadgets    = Display.where(:category => 'gadget')
    @carriers   = Display.where(:category => 'carrier')
  end
  
  def get_object
    @display    = Display.find(params['objID'])
    @obj_file   = @display.obj_file
    @tex_file   = @display.texture_file
    @block_num  = @display.block_num
    @blocks     = @display.blocks

    @object = { :objID        => params['objID'], 
                :obj_file     => @obj_file,  
                :texture_file => @tex_file,
                :block_num    => @block_num,
                :blocks       => @blocks
              }
    render :text => @object.to_json
  end

  def get_all_objects
    @displays = Display.all
    render :text => @displays.to_json
  end
end