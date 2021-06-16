package repository;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.core.JsonGenerationException;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.JsonParser.Feature;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import beans.User;

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
}
