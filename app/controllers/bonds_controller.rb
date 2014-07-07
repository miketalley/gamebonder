class BondsController < ApplicationController
  before_action :set_bond, only: [:show, :edit, :update, :destroy]

  # GET /bonds
  # GET /bonds.json
  def index
    @bonds = Bond.all
  end

  # GET /bonds/1
  # GET /bonds/1.json
  def show
  end

  # GET /bonds/new
  def new
    @bond = Bond.new
  end

  # GET /bonds/1/edit
  def edit
  end

  # POST /bonds
  # POST /bonds.json
  def create
    @bond = Bond.new(bond_params)

    respond_to do |format|
      if @bond.save
        format.html { redirect_to @bond, notice: 'Bond was successfully created.' }
        format.json { render :show, status: :created, location: @bond }
      else
        format.html { render :new }
        format.json { render json: @bond.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /bonds/1
  # PATCH/PUT /bonds/1.json
  def update
    respond_to do |format|
      if @bond.update(bond_params)
        format.html { redirect_to @bond, notice: 'Bond was successfully updated.' }
        format.json { render :show, status: :ok, location: @bond }
      else
        format.html { render :edit }
        format.json { render json: @bond.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /bonds/1
  # DELETE /bonds/1.json
  def destroy
    @bond.destroy
    respond_to do |format|
      format.html { redirect_to bonds_url, notice: 'Bond was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_bond
      @bond = Bond.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def bond_params
      params[:bond]
    end
end
