class Bond < ActiveRecord::Base
  belongs_to :source, class_name: 'Game'
  belongs_to :target, class_name: 'Game'
  has_many :reasons
end
