class MainController < ApplicationController

  def index

  end

  def games_list
    @games_list = JSON.parse(File.read('app/assets/json/gamesList.json'))
    render json: @games_list
  end

end
