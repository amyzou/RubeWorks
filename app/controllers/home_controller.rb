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
    @test       = '{"key1":"value1","key2":"value2"}'

    @object = { :objID        => params['objID'], 
                :obj_file     => @display.obj_file,  
                :texture_file => @display.texture_file,
                :block_num    => @display.block_num,
                :blocks       => @display.blocks,
              }
    render :text => @object.to_json
  end

  def get_all_objects
    @displays = Display.all
    render :text => @displays.to_json
  end

  def get_object_property
    @object = ObjectProperty.find(params['objID'])
    render :text => @object.to_json
  end
end