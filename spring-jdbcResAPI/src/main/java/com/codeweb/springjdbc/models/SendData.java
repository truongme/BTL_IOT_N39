package com.codeweb.springjdbc.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class SendData {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	private float temp;
	private float hum;
    private int gas;
    private int flame;
    private String advice;
	public SendData() {
		super();
	}
	public SendData(int id, float temp, float hum, int gas, int flame, String advice) {
		super();
		this.id = id;
		this.temp = temp;
		this.hum = hum;
		this.gas = gas;
		this.flame = flame;
		this.advice = advice;
	}
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public float getTemp() {
		return temp;
	}
	public void setTemp(float temp) {
		this.temp = temp;
	}
	public float getHum() {
		return hum;
	}
	public void setHum(float hum) {
		this.hum = hum;
	}
	public int getGas() {
		return gas;
	}
	public void setGas(int gas) {
		this.gas = gas;
	}
	public int getFlame() {
		return flame;
	}
	public void setFlame(int flame) {
		this.flame = flame;
	}
	public String getAdvice() {
		return advice;
	}
	public void setAdvice(String advice) {
		this.advice = advice;
	}
	@Override
	public String toString() {
		return "SendData [id=" + id + ", temp=" + temp + ", hum=" + hum + ", gas=" + gas + ", flame=" + flame
				+ ", advice=" + advice + "]";
	}
	
	
}
