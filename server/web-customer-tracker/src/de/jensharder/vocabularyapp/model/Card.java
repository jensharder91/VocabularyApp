package de.jensharder.vocabularyapp.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "cards")
public class Card {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private int id;

	@Column(name = "question")
	private String question;

	@Column(name = "answer")
	private String answer;

	@Column(name = "reversable")
	private boolean reversable;

	@Column(name = "bundleId")
	private int bundleId;

	public Card() {
	}

	public Card(String question, String answer, boolean reversable, int bundleId) {
		this.question = question;
		this.answer = answer;
		this.reversable = reversable;
		this.bundleId = bundleId;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getQuestion() {
		return question;
	}

	public void setQuestion(String question) {
		this.question = question;
	}

	public String getAnswer() {
		return answer;
	}

	public void setAnswer(String answer) {
		this.answer = answer;
	}

	public boolean isReversable() {
		return reversable;
	}

	public void setReversable(boolean reversable) {
		this.reversable = reversable;
	}

	public int getBundleId() {
		return bundleId;
	}

	public void setBundleId(int bundleId) {
		this.bundleId = bundleId;
	}

}
