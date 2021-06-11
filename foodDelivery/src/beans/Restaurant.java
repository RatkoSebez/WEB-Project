package beans;

import java.awt.Image;
import java.util.List;

public class Restaurant {
	private String name;
	private enum Type{Italian, Chinese, FastFood}
	private Type type;
	private List<Item> items;
	private boolean isOpened;
	private Location location;
	private Image image;
	
	public Restaurant(String name, Type type, List<Item> items, boolean isOpened, Location location, Image image) {
		super();
		this.name = name;
		this.type = type;
		this.items = items;
		this.isOpened = isOpened;
		this.location = location;
		this.image = image;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Type getType() {
		return type;
	}

	public void setType(Type type) {
		this.type = type;
	}

	public List<Item> getItems() {
		return items;
	}

	public void setItems(List<Item> items) {
		this.items = items;
	}

	public boolean isOpened() {
		return isOpened;
	}

	public void setOpened(boolean isOpened) {
		this.isOpened = isOpened;
	}

	public Location getLocation() {
		return location;
	}

	public void setLocation(Location location) {
		this.location = location;
	}

	public Image getImage() {
		return image;
	}

	public void setImage(Image image) {
		this.image = image;
	}
}
