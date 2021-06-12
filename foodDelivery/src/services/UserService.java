package services;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
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
import repository.FileUsers;

@Path("/userService")
public class UserService {
	
	@Context
	private ServletContext ctx;
	private ObjectMapper mapper = new ObjectMapper();
	
	public UserService() {}
	
	@PostConstruct
	public void init() {
		if(ctx.getAttribute("users") == null) {
			String contextPath = ctx.getRealPath("");
			FileUsers fileUsers = FileUsers.getInstance(contextPath + File.separator + "users.json");
			System.out.println(contextPath);
			List<User> users = fileUsers.getUsers();
			ctx.setAttribute("users", users);
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
	public boolean logout(@Context HttpServletRequest request) {
		User user = null;
		user = (User) request.getSession().getAttribute("user");
		if (user != null) request.getSession().invalidate();
		return true;
	}
	
	@POST
	@Path("/register")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public boolean register(@Context HttpServletRequest request, User user) {
		//User user2 = mapper.readValue(request.getReader(), User.class);
		FileUsers fileUsers = (FileUsers) ctx.getAttribute("fileUsers");
		@SuppressWarnings("unchecked")
		ArrayList<User> users = (ArrayList<User>) ctx.getAttribute("users");
		users.add(user);
		System.out.println(users.size());
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
}
