json.extract! @bond, :id, :source_id, :target_id, :strength, :created_at, :updated_at
  json.source @bond.source_id
  json.target @bond.target_id
  json.reasons @bond.reasons.each do |reason|
    json.extract! reason, :id, :description, :strength, :created_at, :updated_at
  end
