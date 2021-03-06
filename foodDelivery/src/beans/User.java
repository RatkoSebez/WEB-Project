package beans;

import java.util.ArrayList;
import java.util.Date;

public class User {
	private String username;
	private String password;
	private String name;
	private String surname;
	public enum Gender{Male, Female}
	private Gender gender;
	private Date birthDate;
	public enum Role{Admin, Manager, Deliverer, Customer}
	private Role role;
	private ArrayList<Order> customersOrders;
	private ShoppingCart shoppingCart;
	private Restaurant restaurant;
	private ArrayList<Order> delivererOrders;
	private int discountPoints;
	private CustomerType customerType;
	private boolean isSuspicious;
	private boolean isBanned;
	
	public boolean isSuspicious() {
		return isSuspicious;
	}

	public void setSuspicious(boolean isSuspicious) {
		this.isSuspicious = isSuspicious;
	}

	public boolean isBanned() {
		return isBanned;
	}

	public void setBanned(boolean isBanned) {
		this.isBanned = isBanned;
	}

	public User() {}

	public User(String username, String password, String name, String surname) {
		this.username = username;
		this.password = password;
		this.name = name;
		this.surname = surname;
		this.role = Role.Customer;
	}
	
	//konstruktor za registrovanje kupca
	public User(String username, String password, String name, String surname, Gender gender, Date birthDate, ArrayList<Order> customersOrders, ShoppingCart shoppingCart) {
		super();
		this.username = username;
		this.password = password;
		this.name = name;
		this.surname = surname;
		this.gender = gender;
		this.birthDate = birthDate;
		this.role = Role.Customer;
		this.customersOrders = customersOrders;
		this.shoppingCart = shoppingCart;
		this.discountPoints = 0;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getSurname() {
		return surname;
	}

	public void setSurname(String surname) {
		this.surname = surname;
	}

	public Gender getGender() {
		return gender;
	}

	public void setGender(Gender gender) {
		this.gender = gender;
	}

	public Date getBirthDate() {
		return birthDate;
	}

	public void setBirthDate(Date birthDate) {
		this.birthDate = birthDate;
	}

	public Role getRole() {
		return role;
	}

	public void setRole(Role role) {
		this.role = role;
	}

	public ArrayList<Order> getCustomersOrders() {
		return customersOrders;
	}

	public void setCustomersOrders(ArrayList<Order> customersOrders) {
		this.customersOrders = customersOrders;
	}

	public ShoppingCart getShoppingCart() {
		return shoppingCart;
	}

	public void setShoppingCart(ShoppingCart shoppingCart) {
		this.shoppingCart = shoppingCart;
	}

	public Restaurant getRestaurant() {
		return restaurant;
	}

	public void setRestaurant(Restaurant restaurant) {
		this.restaurant = restaurant;
	}

	public ArrayList<Order> getDelivererOrders() {
		return delivererOrders;
	}

	public void setDelivererOrders(ArrayList<Order> delivererOrders) {
		this.delivererOrders = delivererOrders;
	}

	public int getDiscountPoints() {
		return discountPoints;
	}

	public void setDiscountPoints(int discountPoints) {
		this.discountPoints = discountPoints;
	}

	public CustomerType getCustomerType() {
		return customerType;
	}

	public void setCustomerType(CustomerType customerType) {
		this.customerType = customerType;
	}
	
	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}
}
