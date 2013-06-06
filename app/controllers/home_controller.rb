class HomeController < ApplicationController
  def index
    @displays   = Display.all
    @inerts     = Display.where(:category => 'inert')
    @roamers    = Display.where(:category => 'roamer')
    @gadgets    = Display.where(:category => 'gadget')
    @carriers   = Display.where(:category => 'carrier')
    @starters   = Display.where(:category => 'starter')
  end
  
  def get_all_objects
    @displays = Display.all
    render :text => @displays.to_json
  end

  def get_object
    @object = ObjectProperty.find(params['objID'])
    render :text => @object.to_json
  end

  def get_display
    @display    = Display.find(params['objID'])
    render :text => @object.to_json
  end

  def createimages
  end
end
