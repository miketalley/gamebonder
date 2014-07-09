class Game < ActiveRecord::Base
  has_many :sources, class_name: 'Bond', foreign_key: 'source_id'
  has_many :targets, class_name: 'Bond', foreign_key: 'target_id'

  def bonds
    sources + targets
  end
end
