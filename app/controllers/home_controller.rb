class HomeController < ApplicationController
  def index
  	@displays = Display.all
  	@inerts = Display.where(:category => 'inert')
  	@roamers = Display.where(:category => 'roamer')
  	@gadgets = Display.where(:category => 'gadget')
  	@carriers = Display.where(:category => 'carrier')
  end

  def display
    @display = Display.find(params[:object_id])
  end
end
