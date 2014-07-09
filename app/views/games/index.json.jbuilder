json.array!(@games) do |game|
  json.extract! game, :id, :name, :icon_url, :thumb_url
  json.url game_url(game, format: :json)
end
