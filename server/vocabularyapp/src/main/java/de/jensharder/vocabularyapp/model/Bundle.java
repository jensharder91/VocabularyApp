package de.jensharder.vocabularyapp.model;

//@Entity
//@Table(name = "bundles")
public class Bundle {

//	@Id
//	@GeneratedValue(strategy = GenerationType.IDENTITY)
//	@Column(name = "id")
	private int id;

//	@Column(name = "title")
	private String title;

//	@Column(name = "groupId")
	private int groupId;

	public Bundle() {
	}

	public Bundle(String title) {
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

	public int getGroupId() {
		return groupId;
	}

	public void setGroupId(int groupId) {
		this.groupId = groupId;
	}

}
