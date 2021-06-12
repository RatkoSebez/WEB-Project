package services;

import java.io.File;
import java.util.ArrayList;
import java.util.List;
//import java.util.Map;

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
import dao.UserDAO;
import repository.FileUsers;

@Path("/userService")
public class UserService {
	
	@Context
	private ServletContext ctx;
	private ObjectMapper mapper = new ObjectMapper();
	private List<User> users = new ArrayList<>();
	
	public UserService() {}
	
	@PostConstruct
	public void init() {
		if(ctx.getAttribute("userDAO") == null) {
			String contextPath = ctx.getRealPath("");
			ctx.setAttribute("userDAO", new UserDAO(contextPath));
		}
		if(ctx.getAttribute("users") == null) {
			String contextPath = ctx.getRealPath("");
			users.add(new User("Pera", "123"));
			users.add(new User("Mika", "123"));
			FileUsers fileUsers = FileUsers.getInstance(contextPath + File.separator + "users.json");
			System.out.println(contextPath);
			ArrayList<User> usersTest = fileUsers.getUsers();
			//usersTest.add(new User("Pera", "123"));
			//usersTest.add(new User("Marko", "423"));
			//fileUsers.setPath(contextPath + File.separator + "users.json");
			//System.out.println(contextPath + "\\users.json");
			//fileUsers.write();
			
			
			//fileUsers.read();
			
			System.out.println(usersTest.size());
			ctx.setAttribute("users", users);
		}
	}
	
	@POST
	@Path("/login")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public User login(@Context HttpServletRequest request, User user) {
		UserDAO userDao = (UserDAO) ctx.getAttribute("userDAO");
		User loggedUser = userDao.findUser(user.getUsername(), user.getPassword());
		//if(loggedUser == null) System.out.println("null");
		//System.out.println(user.getUsername() + ", " + user.getPassword());
		userDao.printUsers();
		if(loggedUser == null) return loggedUser;
		request.getSession().setAttribute("user", loggedUser);
		return loggedUser;
		
		//request.getSession().setAttribute("user", user);
		//System.out.println(user.getUsername() + ", " + user.getPassword());
		//return null;
		
		/*User retVal = null;
		retVal = (User)request.getSession().getAttribute("user");
		if(retVal == null) {
			request.getSession().setAttribute("user", user);
			retVal = user;
		}
		return retVal;*/
	}
	
	@GET
	@Path("/testLogin")
	@Produces(MediaType.TEXT_PLAIN)
	public String testLogin(@Context HttpServletRequest request) {
		User retVal = null;
		retVal = (User)request.getSession().getAttribute("user");
		if(retVal == null) return "not logged in";
		return retVal.getUsername() + ", " + retVal.getPassword();
	}
	
	@GET
	@Path("/logout")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public boolean logout(@Context HttpServletRequest request) {
		User user = null;
		user = (User) request.getSession().getAttribute("user");
		if (user != null) {
			request.getSession().invalidate();
		}
		return true;
	}
	
	@POST
	@Path("/register")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public boolean register(@Context HttpServletRequest request, User user) {
		//User user2 = mapper.readValue(request.getReader(), User.class);
		@SuppressWarnings("unchecked")
		List<User> users = (List<User>) ctx.getAttribute("users");
		//userDao.addUser(user.getUsername(), user.getPassword());
		for(int i=0; i<users.size(); i++) {
			//System.out.println(user.getUsername() + ", " + users.get(i).getUsername());
			if(user.getUsername().equals(users.get(i).getUsername())) {
				return false;
			}
		}
		users.add(user);
		return true;
		/*for(int i=0; i<users.size(); i++) {
			System.out.println(i);
		}*/
	}
	
	@GET
	@Path("/getUsers")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public String getUsers() {
		@SuppressWarnings("unchecked")
		List<User> users = (List<User>) ctx.getAttribute("users");
		try {
			String usersJson = mapper.writeValueAsString(users);
			return usersJson;
		} catch (JsonProcessingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return "";
	}
}
