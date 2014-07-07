Rails.application.routes.draw do
  resources :reasons

  resources :nodes

  resources :bonds

  root to: 'main#index'
  get '/gamesList', to: 'main#games_list'
end
