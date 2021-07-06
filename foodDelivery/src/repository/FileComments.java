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

import beans.Comment;
import beans.User.Role;

public class FileComments {
	private ArrayList<Comment> comments;
	private String path;
	ObjectMapper objectMapper = new ObjectMapper();
	private static FileComments instance = null;
	public static FileComments getInstance(String path) { 
		if (instance == null) {
			instance = new FileComments(path);
		}
		return instance;
	}
	
	private FileComments(String path) {
		objectMapper.configure(Feature.AUTO_CLOSE_SOURCE, true);
		this.path = path;
		read();
		if(comments == null) comments = new ArrayList<Comment>();
	}
	
	public void write(){
		try {
			String json = objectMapper.writeValueAsString(comments);
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
			comments = objectMapper.readValue(new File(path), new TypeReference<List<Comment>>(){});
		} catch (JsonParseException e) {
			e.printStackTrace();
		} catch (JsonMappingException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	public ArrayList<Comment> getComments(){
		if(comments == null) comments = new ArrayList<Comment>();
		return comments;
	}
	
	public ArrayList<Comment> getCommentsForRestaurant(String name){
		ArrayList<Comment> ret = new ArrayList<Comment>();
		for(int i=0; i<comments.size(); i++) {
			if(comments.get(i).getRestaurant().equals(name)) {
				ret.add(comments.get(i));
			}
		}
		return ret;
	}
	
	public long generateCommentsId() {
		long id = 1000000000;
		for(int i=0; i<comments.size(); i++) {
			for(int j=0; j<comments.size(); j++) {
				id = Math.max(id, comments.get(i).getId());
			}
		}
		return id + 1;
	}
	
	public void updateCommentApproval(long id, Boolean approval) {
		for(int i=0; i<comments.size(); i++) {
			if(comments.get(i).getId() == id) {
				comments.get(i).setAccepted(approval);
			}
		}
	}
	
	public ArrayList<Comment> getCommentsForRestaurant(String name, Role role){
		ArrayList<Comment> ret = new ArrayList<Comment>();
		if(role == Role.Manager || role == Role.Admin) {
			for(int i=0; i<comments.size(); i++) {
				if(comments.get(i).getRestaurant().equals(name) && comments.get(i).isAccepted() != null) {
					ret.add(comments.get(i));
				}
			}
		}
		else{
			//System.out.println("ovde");
			for(int i=0; i<comments.size(); i++) {
				if(comments.get(i).isAccepted() == null) continue;
				if(comments.get(i).getRestaurant().equals(name) && comments.get(i).isAccepted() == true) {
					ret.add(comments.get(i));
				}
			}
		}
		return ret;
	}
}
