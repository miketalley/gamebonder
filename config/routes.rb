Rails.application.routes.draw do
  resources :games

  resources :reasons

  resources :bonds

  root to: 'main#index'
  get '/gamesList', to: 'main#games_list'
end
