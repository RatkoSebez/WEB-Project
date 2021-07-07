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

import beans.Item;

public class FileItems {
	private ArrayList<Item> items;
	private String path;
	ObjectMapper objectMapper = new ObjectMapper();
	private static FileItems instance = null;
	public static FileItems getInstance(String path) { 
		if (instance == null) {
			instance = new FileItems(path);
		}
		return instance;
	}
	
	private FileItems(String path) {
		objectMapper.configure(Feature.AUTO_CLOSE_SOURCE, true);
		this.path = path;
		read();
		if(items == null) items = new ArrayList<Item>();
	}
	
	public void write(){
		try {
			String json = objectMapper.writeValueAsString(items);
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
			items = objectMapper.readValue(new File(path), new TypeReference<List<Item>>(){});
		} catch (JsonParseException e) {
			e.printStackTrace();
		} catch (JsonMappingException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	public ArrayList<Item> getItems() {
		return items;
	}
	
	public ArrayList<Item> getItems(String restaurantsName) {
		ArrayList<Item> retval = new ArrayList<Item>();
		for(int i=0; i<items.size(); i++) {
			//System.out.println(items.get(i).getRestaurant());
			if(items.get(i).getRestaurant().equals(restaurantsName)) {
				retval.add(items.get(i));
			}
		}
		return retval;
	}
	
	public Item getLastItem() {
		return items.get(items.size()-1);
	}
	
	public Item getItem(String name) {
		for(int i=0; i<items.size(); i++) {
			if(items.get(i).getName().equals(name)) return items.get(i);
		}
		return null;
	}
	
	public boolean itemNameEqists(String name) {
		for(int i=0; i<items.size(); i++) {
			if(items.get(i).getName().equals(name)) return true;
		}
		return false;
	}
}
