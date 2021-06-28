package beans;

public class Item {
	private String name;
	private double price;
	public enum Type{Food, Drink}
	private Type type;
	private String restaurant; //ime restorana je unikatno, pa je to kljuc koji povezuje item sa restoranom kom pripada
	private double quantity; //u gramima ili mililitrima
	private String description;
	private String imageData;
	
	public Item() {}
	
	public Item(String name, double price, Type type, String restaurant, double quantity, String description, String imageData) {
		super();
		this.name = name;
		this.price = price;
		this.type = type;
		this.restaurant = restaurant;
		this.quantity = quantity;
		this.description = description;
		this.imageData = imageData;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public double getPrice() {
		return price;
	}

	public void setPrice(double price) {
		this.price = price;
	}

	public Type getType() {
		return type;
	}

	public void setType(Type type) {
		this.type = type;
	}

	public String getRestaurant() {
		return restaurant;
	}

	public void setRestaurant(String restaurant) {
		this.restaurant = restaurant;
	}

	public double getQuantity() {
		return quantity;
	}

	public void setQuantity(double quantity) {
		this.quantity = quantity;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getImage() {
		return imageData;
	}

	public void setImage(String imageData) {
		this.imageData = imageData;
	}
}
