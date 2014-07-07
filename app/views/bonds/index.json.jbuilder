json.array!(@bonds) do |bond|
  json.extract! bond, :id
  json.url bond_url(bond, format: :json)
end
