package com.codeweb.springjdbc.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Threshold {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	private int temp;
	private int hum;
	private int gas;
	public Threshold() {
		super();
	}
	public Threshold(int id, int temp, int hum, int gas) {
		super();
		this.id = id;
		this.temp = temp;
		this.hum = hum;
		this.gas = gas;
	}
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public int getTemp() {
		return temp;
	}
	public void setTemp(int temp) {
		this.temp = temp;
	}
	public int getHum() {
		return hum;
	}
	public void setHum(int hum) {
		this.hum = hum;
	}
	public int getGas() {
		return gas;
	}
	public void setGas(int gas) {
		this.gas = gas;
	}
	
	
}
