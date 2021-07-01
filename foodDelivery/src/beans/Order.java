package beans;

import java.util.Date;
import java.util.List;

public class Order {
	private long orderId; //10 karaktera
	private List<Item> items;
	private String restaurant;
	private Date date;
	private double price;
	private String customersName;
	private String customersSurname;
	public enum Status{Processing, InPreparation, WaitingForDeliveryMan, InTransport, Delivered, Canceled}
	private Status status;
	
	public Order() {}
	
	public Order(long orderId, List<Item> items, String restaurant, Date date, double price, Status status) {
		super();
		this.orderId = orderId;
		this.items = items;
		this.restaurant = restaurant;
		this.date = date;
		this.price = price;
		this.status = status;
	}

	public long getOrderId() {
		return orderId;
	}

	public void setOrderId(long orderId) {
		this.orderId = orderId;
	}

	public List<Item> getItems() {
		return items;
	}

	public void setItems(List<Item> items) {
		this.items = items;
	}

	public String getResrourant() {
		return restaurant;
	}

	public void setResrourant(String restaurant) {
		this.restaurant = restaurant;
	}

	public Date getDate() {
		return date;
	}

	public void setDate(Date date) {
		this.date = date;
	}

	public double getPrice() {
		return price;
	}

	public void setPrice(double price) {
		this.price = price;
	}

	public String getRestaurant() {
		return restaurant;
	}

	public void setRestaurant(String restaurant) {
		this.restaurant = restaurant;
	}

	public String getCustomersName() {
		return customersName;
	}

	public void setCustomersName(String customersName) {
		this.customersName = customersName;
	}

	public String getCustomersSurname() {
		return customersSurname;
	}

	public void setCustomersSurname(String customersSurname) {
		this.customersSurname = customersSurname;
	}

	public Status getStatus() {
		return status;
	}

	public void setStatus(Status status) {
		this.status = status;
	}
}
