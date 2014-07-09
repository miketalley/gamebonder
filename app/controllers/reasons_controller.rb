class ReasonsController < ApplicationController
  before_action :set_reason, only: [:show, :edit, :update, :destroy]

  # GET /reasons
  # GET /reasons.json
  def index
    @reasons = Reason.all
  end

  # GET /reasons/1
  # GET /reasons/1.json
  def show
  end

  # GET /reasons/new
  def new
    @reason = Reason.new
  end

  # GET /reasons/1/edit
  def edit
  end

  # POST /reasons
  # POST /reasons.json
  def create
    @reason = Reason.new(reason_params)

    respond_to do |format|
      if @reason.save
        format.html { redirect_to @reason, notice: 'Reason was successfully created.' }
        format.json { render :show, status: :created, location: @reason }
      else
        format.html { render :new }
        format.json { render json: @reason.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /reasons/1
  # PATCH/PUT /reasons/1.json
  def update
    respond_to do |format|
      if @reason.update(reason_params)
        format.html { redirect_to @reason, notice: 'Reason was successfully updated.' }
        format.json { render :show, status: :ok, location: @reason }
      else
        format.html { render :edit }
        format.json { render json: @reason.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /reasons/1
  # DELETE /reasons/1.json
  def destroy
    @reason.destroy
    respond_to do |format|
      format.html { redirect_to reasons_url, notice: 'Reason was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_reason
      @reason = Reason.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def reason_params
      params.require(:reason).permit(:description, :bond_id)
    end
end
