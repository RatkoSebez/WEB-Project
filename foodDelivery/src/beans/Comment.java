package beans;

public class Comment {
	private String user;
	private String restaurant;
	private String comment;
	private int rating;
	
	public Comment() {}
	
	public Comment(String user, String restaurant, String comment, int rating) {
		super();
		this.user = user;
		this.restaurant = restaurant;
		this.comment = comment;
		this.rating = rating;
	}
	
	public String getUser() {
		return user;
	}
	
	public void setUser(String user) {
		this.user = user;
	}
	
	public String getRestaurant() {
		return restaurant;
	}
	
	public void setRestaurant(String restaurant) {
		this.restaurant = restaurant;
	}
	
	public String getComment() {
		return comment;
	}
	
	public void setComment(String comment) {
		this.comment = comment;
	}
	
	public int getRating() {
		return rating;
	}
	
	public void setRating(int rating) {
		this.rating = rating;
	}
}
