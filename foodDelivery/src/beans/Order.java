package beans;

import java.util.Date;
import java.util.List;

import javafx.util.Pair;

public class Order {
	private String orderId; //10 karaktera
	private List<Item> items;
	private String resrourant;
	private Date date;
	private double price;
	private Pair<String, String> customersNameAndSurname;
	private enum Status{Processing, InPreparation, WaitingForDeliveryMan, InTransport, Delivered, Canceled}
	private Status status;
	
	public Order() {}
	
	public Order(String orderId, List<Item> items, String resrourant, Date date, double price, Pair<String, String> customersNameAndSurname, Status status) {
		super();
		this.orderId = orderId;
		this.items = items;
		this.resrourant = resrourant;
		this.date = date;
		this.price = price;
		this.customersNameAndSurname = customersNameAndSurname;
		this.status = status;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public List<Item> getItems() {
		return items;
	}

	public void setItems(List<Item> items) {
		this.items = items;
	}

	public String getResrourant() {
		return resrourant;
	}

	public void setResrourant(String resrourant) {
		this.resrourant = resrourant;
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

	public Pair<String, String> getCustomersNameAndSurname() {
		return customersNameAndSurname;
	}

	public void setCustomersNameAndSurname(Pair<String, String> customersNameAndSurname) {
		this.customersNameAndSurname = customersNameAndSurname;
	}

	public Status getStatus() {
		return status;
	}

	public void setStatus(Status status) {
		this.status = status;
	}
	
}
