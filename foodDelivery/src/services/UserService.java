package services;

//import java.awt.image.BufferedImage;
//import java.io.ByteArrayInputStream;
//import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.PostConstruct;
//import javax.imageio.ImageIO;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
//import javax.xml.bind.DatatypeConverter;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import beans.Item;
//import beans.Item;
//import beans.Item.Type;
import beans.Restaurant;
import beans.ShoppingCart;
import beans.User;
import beans.User.Role;
import repository.FileItems;
import repository.FileRestaurant;
import repository.FileUsers;


@Path("/userService")
public class UserService {
	
	@Context
	private ServletContext ctx;
	private ObjectMapper mapper = new ObjectMapper();
	
	public UserService() {}
	
	@PostConstruct
	public void init() {
		/*ArrayList<User> admins = new ArrayList<User>();
		admins.add(new User("pera", "123", "pera", "peric", Gender.Male, new Date()));
		admins.add(new User("marko", "123", "marko", "markovic", Gender.Male, new Date()));
		admins.add(new User("milica", "123", "milica", "milicic", Gender.Female, new Date()));
		admins.add(new User("jovan", "123", "jovan", "jovanovic", Gender.Male, new Date()));
		
		FileWriter myWriter;
		try {
			String json = mapper.writeValueAsString(admins);
			myWriter = new FileWriter(ctx.getRealPath("") + "/admins.json");
			myWriter.write(json);
			myWriter.flush();
			myWriter.close();
		} catch (IOException e) {
			e.printStackTrace();
		}*/
		
		
		
		
		String contextPath = ctx.getRealPath("");
		FileUsers fileUsers = FileUsers.getInstance(contextPath + "/data/users.json");
		FileRestaurant fileRestaurant = FileRestaurant.getInstance(contextPath + "/data/restaurants.json");
		FileItems fileItems = FileItems.getInstance(contextPath + "/data/items.json");
		
		
		/*ArrayList<Restaurant> restaurantss = fileRestaurant.getRestaurants();
		Restaurant restoran = new Restaurant();
		restoran.setName("garibaldi");
		restoran.setImage("images/restaurant.jpg");
		restoran.setLocation(new Location(50, 50, "Narodnog Fronta 26, Novi Sad, 21000"));
		restoran.setType(Type.Italian);
		restaurantss.add(restoran);
		fileRestaurant.write();*/
		
		
		if(ctx.getAttribute("users") == null) {
			List<User> users = fileUsers.getUsers();
			ctx.setAttribute("users", users);
		}
		if(ctx.getAttribute("restaurants") == null) {
			List<Restaurant> restaurants = fileRestaurant.getRestaurants();
			ctx.setAttribute("restaurants", restaurants);
		}
		if(ctx.getAttribute("fileUsers") == null) {
			ctx.setAttribute("fileUsers", fileUsers);
		}
		if(ctx.getAttribute("fileRestaurant") == null) {
			ctx.setAttribute("fileRestaurant", fileRestaurant);
		}
		if(ctx.getAttribute("fileItems") == null) {
			ctx.setAttribute("fileItems", fileItems);
		}
		//ArrayList<Item> items = fileItems.getItems();
		//items.add(new Item("pizza2", 900.99, Type.Food, "Garibaldi", 500.22, "opis", "data slike"));
		//fileItems.write();
	}
	
	@POST
	@Path("/login")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public boolean login(@Context HttpServletRequest request, User user) {
		FileUsers fileUsers = (FileUsers) ctx.getAttribute("fileUsers");
		User newUser = fileUsers.getUserForLogin(user.getUsername(), user.getPassword());
		if(newUser == null) {
			return false;
		}
		else {
			if(newUser.getShoppingCart() == null && newUser.getRole() == Role.Customer) {
				newUser.setShoppingCart(new ShoppingCart(new HashMap<String, Integer>(), newUser.getUsername(), 0));
				fileUsers.saveUser(newUser);
			}
			request.getSession().setAttribute("user", newUser);
			return true;
		}
	}
	
	@POST
	@Path("/checkPassword")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public boolean checkPassword(@Context HttpServletRequest request, User user) {
		FileUsers fileUsers = (FileUsers) ctx.getAttribute("fileUsers");
		//System.out.println(fileUsers.checkPassword(user.getUsername(), user.getPassword()));
		return fileUsers.checkPassword(user.getUsername(), user.getPassword());
	}
	
	@GET
	@Path("/testLogin")
	@Produces(MediaType.TEXT_PLAIN)
	public String testLogin(@Context HttpServletRequest request) {
		User user;
		user = (User)request.getSession().getAttribute("user");
		if(user == null) return "not logged in";
		return user.getUsername() + ", " + user.getPassword();
	}
	
	@GET
	@Path("/logout")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public boolean logout(@Context HttpServletRequest request, @Context HttpServletResponse response) throws IOException {
		User user = null;
		user = (User) request.getSession().getAttribute("user");
		if (user != null) request.getSession().invalidate();
		response.sendRedirect("../../index.html");
		return true;
	}
	
	@POST
	@Path("/register")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public boolean register(@Context HttpServletRequest request, User user) {
		//User user2 = mapper.readValue(request.getReader(), User.class);
		if(user.getRole() == null) user.setRole(Role.Customer);
		FileUsers fileUsers = (FileUsers) ctx.getAttribute("fileUsers");
		//@SuppressWarnings("unchecked")
		ArrayList<User> users = fileUsers.getUsers();
		//ArrayList<User> users = (ArrayList<User>) ctx.getAttribute("users");
		users.add(user);
		//System.out.println(users.size());
		fileUsers.write();
		//uloguj korisnika kad se registruje
		if(user.getRole() == Role.Customer) request.getSession().setAttribute("user", user);
		return true;
	}
	
	@POST
	@Path("/editUser")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public boolean editUser(@Context HttpServletRequest request, User user) {
		FileUsers fileUsers = (FileUsers) ctx.getAttribute("fileUsers");
		@SuppressWarnings("unchecked")
		ArrayList<User> users = (ArrayList<User>) ctx.getAttribute("users");
		for(int i=0; i<users.size(); i++) {
			//System.out.println(users.get(i).getUsername() + ", " + user.getUsername());
			if(users.get(i).getUsername().equals(user.getUsername())) {
				users.get(i).setName(user.getName());
				users.get(i).setSurname(user.getSurname());
				users.get(i).setBirthDate(user.getBirthDate());
				if(!user.getPassword().equals("")) users.get(i).setPassword(user.getPassword());
			}
		}
		fileUsers.write();
		return true;
	}
	
	@GET
	@Path("/getUsers")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public String getUsers() {
		@SuppressWarnings("unchecked")
		ArrayList<User> users = (ArrayList<User>) ctx.getAttribute("users");
		try {
			String usersJson = mapper.writeValueAsString(users);
			return usersJson;
		} catch (JsonProcessingException e) {
			e.printStackTrace();
		}
		return "";
	}
	
	@GET
	@Path("/getLoggedInUser")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public String getLoggedInUser(@Context HttpServletRequest request) {
		User user = (User) request.getSession().getAttribute("user");
		try {
			String userJson = mapper.writeValueAsString(user);
			return userJson;
		} catch (JsonProcessingException e) {
			e.printStackTrace();
		}
		return "";
	}
	
	@GET
	@Path("/getRestaurant")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public String getRestaurant(@QueryParam("name") String name) {
		//System.out.println(name + "yo");
		FileRestaurant fileRestaurant = (FileRestaurant) ctx.getAttribute("fileRestaurant");
		Restaurant restaurant = fileRestaurant.getRestaurant(name);
		try {
			String usersJson = mapper.writeValueAsString(restaurant);
			return usersJson;
		} catch (JsonProcessingException e) {
			e.printStackTrace();
		}
		return "";
	}
	
	@GET
	@Path("/getRestaurants")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public String getRestaurants() {
		@SuppressWarnings("unchecked")
		ArrayList<Restaurant> restaurants = (ArrayList<Restaurant>) ctx.getAttribute("restaurants");
		try {
			String usersJson = mapper.writeValueAsString(restaurants);
			return usersJson;
		} catch (JsonProcessingException e) {
			e.printStackTrace();
		}
		return "";
	}
	
	@POST
	@Path("/newRestaurant")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public boolean newRestaurant(@Context HttpServletRequest request, Restaurant restaurant) {
		FileRestaurant fileRestaurant = (FileRestaurant) ctx.getAttribute("fileRestaurant");
		ArrayList<Restaurant> restaurants = fileRestaurant.getRestaurants();
		restaurants.add(restaurant);
		fileRestaurant.write();
		//System.out.println(restaurants.size());
		//System.out.println(restaurants.size() + ", " + fileRestaurant.getRestaurants().size());
		return true;
	}
	
	@POST
	@Path("/saveImage")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public boolean saveImage(String data) throws IOException {
		//pre sam hteo da slike cuvam u falju ali nema potrebe jer se one nalaze u objektu restorana
		FileRestaurant fileRestaurant = (FileRestaurant) ctx.getAttribute("fileRestaurant");
		//System.out.println("ovde sam");
		//System.out.println(base64Image.charAt(20));
		//String base64Image = data.split(",")[1];
		//byte[] imageBytes = DatatypeConverter.parseBase64Binary(base64Image);
		//BufferedImage image = ImageIO.read(new ByteArrayInputStream(imageBytes));
		Restaurant restaurant = fileRestaurant.getLastRestaurant();
		//File outputfile = new File(ctx.getRealPath("") + "/images/" + restaurant.getName() + ".png");
		restaurant.setImage(data);
		fileRestaurant.write();
		//ImageIO.write(image, "png", outputfile);
		return true;
	}
	
	@GET
	@Path("/getFreeManagers")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public String getFreeManagers() throws JsonProcessingException {
		FileUsers fileUsers = (FileUsers) ctx.getAttribute("fileUsers");
		ArrayList<User> managers = fileUsers.getFreeManagers();
		String usersJson = mapper.writeValueAsString(managers);
		//System.out.println(managers.size());
		return usersJson;
	}
	
	@POST
	@Path("/setManagersRestaurant")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public boolean setManagersRestaurant(String username) throws IOException {
		if(username.equals("no free managers")) return false;
		FileRestaurant fileRestaurant = (FileRestaurant) ctx.getAttribute("fileRestaurant");
		Restaurant restaurant = fileRestaurant.getLastRestaurant();
		FileUsers fileUsers = (FileUsers) ctx.getAttribute("fileUsers");
		User manager = fileUsers.getUser(username);
		manager.setRestaurant(restaurant);
		fileUsers.write();
		//System.out.println(username + "yo");
		return true;
	}
	
	@GET
	@Path("/getItems")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public String getItems(@QueryParam("name") String name) throws JsonProcessingException {
		//System.out.println("ime: " + name);
		FileItems fileItems = (FileItems) ctx.getAttribute("fileItems");
		ArrayList<Item> items = fileItems.getItems(name);
		String usersJson = mapper.writeValueAsString(items);
		//System.out.println(managers.size());
		return usersJson;
	}
	
	@GET
	@Path("/getItem")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public String getItem(@QueryParam("name") String name) throws JsonProcessingException {
		//System.out.println("ime: " + name);
		FileItems fileItems = (FileItems) ctx.getAttribute("fileItems");
		Item item = fileItems.getItem(name);
		String usersJson = mapper.writeValueAsString(item);
		//System.out.println(managers.size());
		return usersJson;
	}
	
	@POST
	@Path("/saveItemImage")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public boolean saveItemImage(String data) throws IOException {
		FileItems fileItems = (FileItems) ctx.getAttribute("fileItems");
		Item item = fileItems.getLastItem();
		//File outputfile = new File(ctx.getRealPath("") + "/images/" + restaurant.getName() + ".png");
		item.setImage(data);
		fileItems.write();
		//ImageIO.write(image, "png", outputfile);
		return true;
	}
	
	@POST
	@Path("/newItem")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public boolean newItem(Item item) {
		FileItems fileItems = (FileItems) ctx.getAttribute("fileItems");
		ArrayList<Item> items = fileItems.getItems();
		items.add(item);
		fileItems.write();
		return true;
	}
	
	@GET
	@Path("/addItemToCart")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public boolean addItemToCart(@QueryParam("name") String name, @QueryParam("quantity") int quantity, @QueryParam("flag") String flag, @Context HttpServletRequest request) {
		//ako je flag yes to znaci da je funkcija pozvana iz shopping carta i onda samo treba da azuriram vrednost quantity
		//ako je flag no ona je pozvana is restaurant.js i onda dodajem quantity na njegovu staru vrednost
		FileUsers fileUsers = (FileUsers) ctx.getAttribute("fileUsers");
		User user = (User) request.getSession().getAttribute("user");
		Map<String, Integer> mp = user.getShoppingCart().getItemAndQuantity();
		//System.out.println(flag);
		if(mp.containsKey(name) == false) {
			mp.put(name, quantity);
		}
		else {
			if(flag.equals("yes")) mp.put(name, quantity);
			else mp.put(name, mp.get(name) + quantity);
		}
		fileUsers.saveUser(user);
		//System.out.println(name + ", " + quantity);
		return true;
	}
	
	@GET
	@Path("/getUserItems")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public String getUserItems(@Context HttpServletRequest request) throws JsonProcessingException {
		FileUsers fileUsers = (FileUsers) ctx.getAttribute("fileUsers");
		User user = (User)request.getSession().getAttribute("user");
		Map<String, Integer> mp = fileUsers.getUserItems(user.getUsername());
		//System.out.println(mp.size());
		String usersJson = mapper.writeValueAsString(mp);
		//System.out.println(usersJson);
		return usersJson;
	}
	
	@GET
	@Path("/removeItemFromCart")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public boolean removeItemFromCart(@QueryParam("name") String name, @Context HttpServletRequest request) {
		FileUsers fileUsers = (FileUsers) ctx.getAttribute("fileUsers");
		User user = (User) request.getSession().getAttribute("user");
		Map<String, Integer> mp = user.getShoppingCart().getItemAndQuantity();
		//System.out.println(user.getShoppingCart().getItemAndQuantity().size());
		mp.remove(name);
		//System.out.println(user.getShoppingCart().getItemAndQuantity().size());
		fileUsers.saveUser(user);
		//System.out.println(name + ", " + quantity);
		return true;
	}
	
	@POST
	@Path("/getItemsForShoppingCart")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public String getItemsForShoppingCart(String data) throws IOException {
		data = data.substring(10);
		data = data.substring(0, data.length() - 2);
		data = data.replace("\"", "");
		String [] names = data.split(",");
		
		FileItems fileItems = (FileItems) ctx.getAttribute("fileItems");
		ArrayList<Item> items = new ArrayList<Item>();
		for(int i=0; i<names.length; i++) {
			items.add(fileItems.getItem(names[i]));
		}
		String usersJson = mapper.writeValueAsString(items);
		//System.out.println(data);
		return usersJson;
	}
}
