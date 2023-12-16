package com.codeweb.springjdbc.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.codeweb.springjdbc.models.SendData;
import com.codeweb.springjdbc.repository.SendDataRepository;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class NotificationController {
	
	@Autowired
	private SendDataRepository repo;
	
	 @PostMapping("/data")
    public ResponseEntity<String> findSensorData(@RequestBody SendData data) {
		 if (data.getTemp() < 50) {
		        data.setTemp(30);  
		 }else {
			   data.setTemp(60);
		 }
		 data.setHum(30);  
		 if (data.getGas() < 800) {
		        data.setGas(400);  
		 }else {
			   data.setGas(1000);
		 }
		 System.out.println(data);
		 try {
	            SendData foundData = repo.findByHumAndTempAndGasAndFlame( data.getTemp(), data.getHum(), data.getGas(), data.getFlame());
	            if (foundData != null) {
	                return new ResponseEntity<>(foundData.getAdvice(), HttpStatus.OK);
	            } else {
	                return new ResponseEntity<>("Sensor Data not found", HttpStatus.NOT_FOUND);
	            }
	        } catch (Exception e) {
	            return new ResponseEntity<>("Error finding Sensor Data: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
	        }
	 }
}
