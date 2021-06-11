package beans;

public class CustomerType {
	private enum Type{Bronze, Silver, Gold}
	private Type type;
	private double discount;
	private int pointsRequired;
	
	public CustomerType(int type) {
		if(type == 0) {
			this.type = Type.Bronze;
			this.discount = Constants.BRONZE_CUSTOMER_DISCOUNT;
			this.pointsRequired = Constants.BRONZE_CUSTOMER_POINTS;
		}
		if(type == 1) {
			this.type = Type.Silver;
			this.discount = Constants.SILVER_CUSTOMER_DISCOUNT;
			this.pointsRequired = Constants.SILVER_CUSTOMER_POINTS;
		}
		if(type == 2) {
			this.type = Type.Gold;
			this.discount = Constants.GOLD_CUSTOMER_DISCOUNT;
			this.pointsRequired = Constants.GOLD_CUSTOMER_POINTS;
		}
	}
	
	public Type getType() {
		return type;
	}
	public void setType(Type type) {
		this.type = type;
	}
	public double getDiscount() {
		return discount;
	}
	public void setDiscount(double discount) {
		this.discount = discount;
	}
	public int getPointsRequired() {
		return pointsRequired;
	}
	public void setPointsRequired(int pointsRequired) {
		this.pointsRequired = pointsRequired;
	}
}
