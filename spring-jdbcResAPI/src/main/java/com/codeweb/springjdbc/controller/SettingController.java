package com.codeweb.springjdbc.controller;

import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

import org.eclipse.paho.client.mqttv3.MqttException;

import com.codeweb.springjdbc.config.Mqtt;
import com.codeweb.springjdbc.models.Threshold;
import com.codeweb.springjdbc.repository.ThresholdRepository;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class SettingController {
	@Autowired
	private ThresholdRepository repo;
	
	@PostMapping("dismissAlert")
    public void dismissAlert() throws MqttException {
        MqttMessage mqttMessage = new MqttMessage("0".getBytes());
        mqttMessage.setQos(0);
        mqttMessage.setRetained(false);
        Mqtt.getInstance().publish("/PTIT_Test/p/alert", mqttMessage);
        System.out.println("tắt thông báo");
    }

	 @PostMapping("turnOnAlert")
    public void turnOnAlert() throws MqttException {
        MqttMessage mqttMessage = new MqttMessage("1".getBytes());
        mqttMessage.setQos(0);
        mqttMessage.setRetained(false);
        Mqtt.getInstance().publish("/PTIT_Test/p/alert", mqttMessage);
        System.out.println("bat thông báo");
    }
	 
	 @GetMapping("/threshold/{id}")
	 Threshold getThreshold(@PathVariable Integer id) {
        Optional<Threshold> threshold = repo.findById(id);
        return threshold.orElse(null); 
	}
	 
	 @PutMapping("/updateThreshold/{id}")
	 public ResponseEntity<String> updateThreshold(@RequestBody Threshold newThreshold, @PathVariable Integer id) {
	     try {
	         Threshold updatedThreshold = repo.findById(id)
	             .map(user -> {
	                 user.setTemp(newThreshold.getTemp());
	                 user.setHum(newThreshold.getHum());
	                 user.setGas(newThreshold.getGas());
	                 System.out.println("Cập nhật thành công");
	                 return repo.save(user);
	             })
	             .orElseGet(() -> {
	                 newThreshold.setId(id);
	                 repo.save(newThreshold);
	                 System.out.println("Thêm mới thành công");
	                 return newThreshold;
	             });

	         publishTemp(updatedThreshold);
	         publishHum(updatedThreshold);
	         publishGas(updatedThreshold);

	         return ResponseEntity.ok("Cập nhật ngưỡng thành công");
	     } catch (Exception e) {
	         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi khi cập nhật ngưỡng");
	     }
	 }
	
	public void publishTemp(@RequestBody Threshold updatedThreshold) throws MqttException {
	    int temp = updatedThreshold.getTemp();
	    MqttMessage mqttMessage = new MqttMessage(String.valueOf(temp).getBytes());
	    mqttMessage.setQos(0);
	    mqttMessage.setRetained(false);
	    Mqtt.getInstance().publish("/PTIT_Test/p/setupTemp", mqttMessage);
	}

	public void publishHum(@RequestBody Threshold updatedThreshold) throws MqttException {
	    int hum = updatedThreshold.getHum();
	    MqttMessage mqttMessage = new MqttMessage(String.valueOf(hum).getBytes());
	    mqttMessage.setQos(0);
	    mqttMessage.setRetained(false);
	    Mqtt.getInstance().publish("/PTIT_Test/p/setupHum", mqttMessage);
	}

	public void publishGas(@RequestBody Threshold updatedThreshold) throws MqttException {
	    int gas = updatedThreshold.getGas();
	    MqttMessage mqttMessage = new MqttMessage(String.valueOf(gas).getBytes());
	    mqttMessage.setQos(0);
	    mqttMessage.setRetained(false);
	    Mqtt.getInstance().publish("/PTIT_Test/p/setupGas", mqttMessage);
	}


}
