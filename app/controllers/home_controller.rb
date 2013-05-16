class HomeController < ApplicationController
  def index
  	@displays = Display.all
  end
end
