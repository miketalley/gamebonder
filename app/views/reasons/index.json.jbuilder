json.array!(@reasons) do |reason|
  json.extract! reason, :id, :description, :strength, :created_at, :updated_at
  json.url reason_url(reason, format: :json)
end
