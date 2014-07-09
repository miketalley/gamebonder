json.extract! @bond, :id, :source_id, :target_id, :strength, :created_at, :updated_at
  json.reasons @bond.reasons.each do |reason|
    json.extract! reason, :id, :description, :strength, :created_at, :updated_at
  end
