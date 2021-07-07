package repository;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.core.JsonGenerationException;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.JsonParser.Feature;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import beans.Order;
import beans.Order.Status;
import beans.User;
import beans.User.Role;

public class FileUsers {
	private ArrayList<User> users;
	private String path;
	ObjectMapper objectMapper = new ObjectMapper();
	private static FileUsers instance = null;
	public static FileUsers getInstance(String path) { 
		if (instance == null) {
			instance = new FileUsers(path);
		}
		return instance;
	}
	
	private FileUsers(String path) {
		objectMapper.configure(Feature.AUTO_CLOSE_SOURCE, true);
		this.path = path;
		read();
		if(users == null) users = new ArrayList<User>();
	}
	
	public void write(){
		try {
			String json = objectMapper.writeValueAsString(users);
			FileWriter myWriter = new FileWriter(path);
			myWriter.write(json);
			myWriter.flush();
			myWriter.close();
			//objectMapper.writeValue(new File(path), s);
		} catch (JsonGenerationException e) {
			e.printStackTrace();
		} catch (JsonMappingException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	public void read() {
		try {
			users = objectMapper.readValue(new File(path), new TypeReference<List<User>>(){});
		} catch (JsonParseException e) {
			e.printStackTrace();
		} catch (JsonMappingException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	public ArrayList<User> getUsers(){
		return users;
	}
	
	public User getUserForLogin(String username, String password) {
		for(int i=0; i<users.size(); i++) {
			if(users.get(i).getUsername().equals(username) && users.get(i).getPassword().equals(password)) return users.get(i);
		}
		return null;
	}
	
	public boolean checkPassword(String username, String password) {
		for(int i=0; i<users.size(); i++) {
			if(users.get(i).getUsername().equals(username) && users.get(i).getPassword().equals(password)) return true;
			//System.out.println(users.get(i).getPassword() + ", " + password);
		}
		return false;
	}
	
	public ArrayList<User> getFreeManagers(){
		ArrayList<User> freeManagers = new ArrayList<User>();
		for(int i=0; i<users.size(); i++) {
			if(users.get(i).getRestaurant() == null && users.get(i).getRole() == Role.Manager) freeManagers.add(users.get(i));
		}
		return freeManagers;
	}
	
	public User getUser(String username) {
		User user = new User();
		for(int i=0; i<users.size(); i++) {
			if(users.get(i).getUsername().equals(username)) user = users.get(i);
		}
		return user;
	}
	
	public void saveUser(User user) {
		for(int i=0; i<users.size(); i++) {
			if(users.get(i).getUsername().equals(user.getUsername())) {
				users.set(i, user);
			}
		}
		write();
	}
	
	public Map<String, Integer> getUserItems(String username) {
		Map<String, Integer> mp = Collections.<String, Integer>emptyMap();
		for(int i=0; i<users.size(); i++) {
			if(users.get(i).getUsername().equals(username)) mp = users.get(i).getShoppingCart().getItemAndQuantity();
		}
		return mp;
	}
	
	public long generateOrdersId() {
		long id = 1000000000;
		for(int i=0; i<users.size(); i++) {
			if(users.get(i).getCustomersOrders() == null) continue;
			for(int j=0; j<users.get(i).getCustomersOrders().size(); j++) {
				id = Math.max(id, users.get(i).getCustomersOrders().get(j).getOrderId());
			}
		}
		return id + 1;
	}
	
	public ArrayList<Order> getDelivererOrders(String username){
		ArrayList<Order> orders = new ArrayList<Order>();
		for(int i=0; i<users.size(); i++) {
			if(users.get(i).getUsername().equals(username)) {
				if(users.get(i).getDelivererOrders() == null || users.get(i).getDelivererOrders().size() == 0) continue;
				for(int j=0; j<users.get(i).getDelivererOrders().size(); j++) {
					if(users.get(i).getDelivererOrders().get(j).getStatus() != Status.Delivered) orders.add(users.get(i).getDelivererOrders().get(j));
				}
			}
			else {
				if(users.get(i).getCustomersOrders() == null || users.get(i).getCustomersOrders().size() == 0) continue;
				for(int j=0; j<users.get(i).getCustomersOrders().size(); j++) {
					if(users.get(i).getCustomersOrders().get(j).getStatus() == Status.WaitingForDeliveryMan || users.get(i).getCustomersOrders().get(j).getStatus() == Status.WaitingForApproval) orders.add(users.get(i).getCustomersOrders().get(j));
				}
			}
		}
		return orders;
	}
	
	public ArrayList<Order> getManagerOrders(String restaurant){
		ArrayList<Order> orders = new ArrayList<Order>();
		for(int i=0; i<users.size(); i++) {
			if(users.get(i).getCustomersOrders() == null || users.get(i).getCustomersOrders().size() == 0) continue;
			for(int j=0; j<users.get(i).getCustomersOrders().size(); j++) {
				if(users.get(i).getCustomersOrders().get(j).getResrourant().equals(restaurant)) orders.add(users.get(i).getCustomersOrders().get(j));
			}
		}
		return orders;
	}
	
	public void cancelOrder(String username, long orderId) {
		for(int i=0; i<users.size(); i++) {
			if(users.get(i).getUsername().equals(username)) {
				for(int j=0; j<users.get(i).getCustomersOrders().size(); j++) {
					if(users.get(i).getCustomersOrders().get(j).getOrderId() == orderId) {
						users.get(i).getCustomersOrders().remove(j);
						break;
					}
				}
			}
		}
	}
	
	public void processOrder(long orderId) {
		for(int i=0; i<users.size(); i++) {
			if(users.get(i).getCustomersOrders() == null) continue;
			for(int j=0; j<users.get(i).getCustomersOrders().size(); j++) {
				if(users.get(i).getCustomersOrders().get(j).getOrderId() == orderId) {
					users.get(i).getCustomersOrders().get(j).setStatus(Status.InPreparation);
					break;
				}
			}
		}
	}
	
	public void prepareOrder(long orderId) {
		for(int i=0; i<users.size(); i++) {
			if(users.get(i).getCustomersOrders() == null) continue;
			for(int j=0; j<users.get(i).getCustomersOrders().size(); j++) {
				if(users.get(i).getCustomersOrders().get(j).getOrderId() == orderId) {
					users.get(i).getCustomersOrders().get(j).setStatus(Status.WaitingForDeliveryMan);
					break;
				}
			}
		}
	}
	
	public void waitingForDeliveryMan(long orderId) {
		for(int i=0; i<users.size(); i++) {
			if(users.get(i).getCustomersOrders() == null) continue;
			for(int j=0; j<users.get(i).getCustomersOrders().size(); j++) {
				if(users.get(i).getCustomersOrders().get(j).getOrderId() == orderId) {
					users.get(i).getCustomersOrders().get(j).setStatus(Status.WaitingForApproval);
					break;
				}
			}
		}
	}
	
	public void inTransportOrder(long orderId) {
		for(int i=0; i<users.size(); i++) {
			if(users.get(i).getCustomersOrders() == null) continue;
			for(int j=0; j<users.get(i).getCustomersOrders().size(); j++) {
				if(users.get(i).getCustomersOrders().get(j).getOrderId() == orderId) {
					users.get(i).getCustomersOrders().get(j).setStatus(Status.Delivered);
					break;
				}
			}
		}
	}
	
	public void waitingForApproval(long orderId, String username) {
		Order order = new Order();
		for(int i=0; i<users.size(); i++) {
			if(users.get(i).getCustomersOrders() == null) continue;
			for(int j=0; j<users.get(i).getCustomersOrders().size(); j++) {
				if(users.get(i).getCustomersOrders().get(j).getOrderId() == orderId) {
					order = users.get(i).getCustomersOrders().get(j);
					order.setStatus(Status.InTransport);
					break;
				}
			}
		}
		for(int i=0; i<users.size(); i++) {
			if(users.get(i).getUsername().equals(username)) {
				if(users.get(i).getDelivererOrders() == null) users.get(i).setDelivererOrders(new ArrayList<Order>());	
				users.get(i).getDelivererOrders().add(order);
			}
		}
	}
	
	public ArrayList<String> getRestaurantsForComment(String username){
		ArrayList<String> restaurants = new ArrayList<String>();
		for(int i=0; i<users.size(); i++) {
			if(users.get(i).getUsername().equals(username)) {
				for(int j=0; j<users.get(i).getCustomersOrders().size(); j++) {
					if(users.get(i).getCustomersOrders().get(j).getStatus() == Status.Delivered) {
						restaurants.add(users.get(i).getCustomersOrders().get(j).getResrourant());
					}
				}
			}
		}
		return restaurants;
	}
	
	public boolean usernameExists(String username) {
		for(int i=0; i<users.size(); i++) {
			if(users.get(i).getUsername().equals(username)) return true;
		}
		return false;
	}
	
	public ArrayList<User> getUsersForManager(String restaurant){
		ArrayList<User> ret = new ArrayList<User>();
		for(int i=0; i<users.size(); i++) {
			if(users.get(i).getCustomersOrders() != null) {
				for(int j=0; j<users.get(i).getCustomersOrders().size(); j++) {
					if(users.get(i).getCustomersOrders().get(j).getResrourant().equals(restaurant)) {
						ret.add(users.get(i));
						break;
					}
				}
			}
		}
		return ret;
	}
}
