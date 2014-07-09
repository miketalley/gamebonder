class Bond < ActiveRecord::Base
  belongs_to :source, class_name: 'Game', foreign_key: 'source_id'
  belongs_to :target, class_name: 'Game', foreign_key: 'target_id'
  has_many :reasons
end
