package dao;

//import java.io.BufferedReader;
//import java.io.File;
//import java.io.FileNotFoundException;
//import java.io.FileReader;
//import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
//import java.util.StringTokenizer;

import beans.User;

public class UserDAO {
	private Map<String, User> users = new HashMap<>();
	
	public UserDAO() {}
	
	public UserDAO(String contextPath) {
		loadUsers(contextPath);
	}
	
	private void loadUsers(String contextPath) {
		/*BufferedReader in = null;
		File file = new File(contextPath + "/users");
		try {
			in = new BufferedReader(new FileReader(file));
			String line;
			StringTokenizer st;
			while((line = in.readLine()) != null) {
				if(line.equals("")) continue;
				st = new StringTokenizer(line, ",");
				String username = st.nextToken().trim();
				String password = st.nextToken().trim();
				users.put(username, new User(username, password));
			}
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} finally {
			if(in != null) {
				try {
					in.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}*/
		users.put("marko", new User("marko", "123"));
	}
	
	public User findUser(String username, String password) {
		if(!(users.containsKey(username))) return null;
		User user = users.get(username);
		if(!user.getPassword().equals(password)) return null;
		return user;
	}
	
	public void addUser(String username, String password) {
		users.put(username, new User(username, password));
	}
	
	public Map<String, User> getUsers(){
		return users;
	}
	
	public void printUsers() {
		System.out.println(users.values());
	}
}
