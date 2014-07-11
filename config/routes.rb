Rails.application.routes.draw do
  root to: 'main#index'
  get '/about', to: 'main#show'

  resources :games

  resources :reasons

  resources :bonds

end
