json.array!(@reasons) do |reason|
  json.extract! reason, :id
  json.url reason_url(reason, format: :json)
end
