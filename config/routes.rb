Rails.application.routes.draw do
  root to: 'main#index'
  get '/gamesList', to: 'main#games_list'
end
