class Game < ActiveRecord::Base
  has_many :sources, class_name: 'Bond', foreign_key: 'source_id'
  has_many :targets, class_name: 'Bond', foreign_key: 'target_id'

  def bonds
    sources + targets
  end

  def get_children(game=self)
    @prior = @prior || [self]

    children = { games: [], bonds: [] }

    game.bonds.each do |bond|

      if !children[:bonds].include?(bond)
        children[:bonds].push(bond)
        puts "Adding Bond: #{bond.id}"

        if !children[:games].include?(bond.source)
          children[:games].push(bond.source)
          puts "Adding Game: #{bond.source.name}"
        end

        if !children[:games].include?(bond.target)
          children[:games].push(bond.target)
          puts "Adding Game: #{bond.target.name}"
        end

        if bond.source.id != self.id && bond.source.bonds.length > 0 && !(@prior.include?(bond.source))
            @prior << bond.source
            puts "Recursion on #{bond.source}"
            tmp = get_children(bond.source)
            children[:games] += tmp[:games]
            children[:bonds] += tmp[:bonds]
        end

        if bond.target.id != game.id && bond.target.bonds.length > 0 && !(@prior.include?(bond.target))
            @prior << bond.target
            puts "Recursion on #{bond.target}"
            tmp = get_children(bond.target)
            children[:games] += tmp[:games]
            children[:bonds] += tmp[:bonds]
        end
      else
        break
      end
    end

    children[:games].uniq!
    children[:bonds].uniq!
    return children
  end

  def self.children_bonds
    puts 'hola'
  end

end
