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

import beans.Restaurant;

public class FileRestaurant {
	private ArrayList<Restaurant> restaurants;
	private String path;
	ObjectMapper objectMapper = new ObjectMapper();
	private static FileRestaurant instance = null;
	public static FileRestaurant getInstance(String path) { 
		if (instance == null) {
			instance = new FileRestaurant(path);
		}
		return instance;
	}
	
	private FileRestaurant(String path) {
		objectMapper.configure(Feature.AUTO_CLOSE_SOURCE, true);
		this.path = path;
		read();
		if(restaurants == null) restaurants = new ArrayList<Restaurant>();
	}
	
	public void write(){
		try {
			String json = objectMapper.writeValueAsString(restaurants);
			FileWriter myWriter = new FileWriter(path);
			myWriter.write(json);
			myWriter.flush();
			myWriter.close();
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
			restaurants = objectMapper.readValue(new File(path), new TypeReference<List<Restaurant>>(){});
		} catch (JsonParseException e) {
			e.printStackTrace();
		} catch (JsonMappingException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	public ArrayList<Restaurant> getRestaurants(){
		return restaurants;
	}
	
	//uzimam ime poslednjeg dodatog restorana i ovo koristim da bu postavio ime slike
	public Restaurant getLastRestaurant() {
		return restaurants.get(restaurants.size()-1);
	}
}
