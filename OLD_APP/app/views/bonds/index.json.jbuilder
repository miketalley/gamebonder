json.array!(@bonds) do |bond|
  json.extract! bond, :id, :source_id, :target_id, :strength, :created_at, :updated_at
  json.source bond.source_id
  json.target bond.target_id
  json.url bond_url(bond, format: :json)

end
