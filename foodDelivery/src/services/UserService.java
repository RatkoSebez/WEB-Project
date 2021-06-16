package services;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import beans.User;
import beans.User.Role;
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
		FileUsers fileUsers = FileUsers.getInstance(contextPath + "/users.json");
		
		if(ctx.getAttribute("users") == null) {
			List<User> users = fileUsers.getUsers();
			ctx.setAttribute("users", users);
		}
		if(ctx.getAttribute("fileUsers") == null) {
			ctx.setAttribute("fileUsers", fileUsers);
		}
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
		user.setRole(Role.Customer);
		FileUsers fileUsers = (FileUsers) ctx.getAttribute("fileUsers");
		@SuppressWarnings("unchecked")
		ArrayList<User> users = (ArrayList<User>) ctx.getAttribute("users");
		users.add(user);
		System.out.println(users.size());
		fileUsers.write();
		//uloguj korisnika kad se registruje
		request.getSession().setAttribute("user", user);
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
	
	@POST
	@Path("/getCustomerType")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public String getCustomerType(String username) {
		return username;
		//if(user.getCustomerType() == null) return null;
		//else return user.getCustomerType().getType().toString();
	}
}
