package beans;

import java.util.HashMap;
import java.util.Map;

public class ShoppingCart {
	private Map<String, Integer> itemAndQuantity;
	private String user;
	private double price;
	
	public ShoppingCart(HashMap<String, Integer> itemAndQuantity, String user, double price) {
		super();
		this.itemAndQuantity = itemAndQuantity;
		this.user = user;
		this.price = price;
	}
	
	public Map<String, Integer> getItemAndQuantity() {
		return itemAndQuantity;
	}

	public void setItemAndQuantity(Map<String, Integer> itemAndQuantity) {
		this.itemAndQuantity = itemAndQuantity;
	}

	public String getUser() {
		return user;
	}

	public void setUser(String user) {
		this.user = user;
	}

	public double getPrice() {
		return price;
	}

	public void setPrice(double price) {
		this.price = price;
	}
}
