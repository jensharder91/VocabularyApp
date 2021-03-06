package de.jensharder.vocabularyapp.model;

//@Entity
//@Table(name = "cardcategories")
public class CardCategory {

//	@Id
//	@GeneratedValue(strategy = GenerationType.IDENTITY)
//	@Column(name = "id")
	private int id;

//	@Column(name = "title")
	private String title;

	public CardCategory() {
	}

	public CardCategory(String title) {
		this.title = title;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

}
