package com.codeweb.springjdbc.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.codeweb.springjdbc.models.MqttSub;
import com.codeweb.springjdbc.models.SendData;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class HomeController {
    private RestTemplate rest = new RestTemplate();
    @GetMapping("/temp")
    public MqttSub getTemp() {
        MqttSub[] mqttSub = rest.getForObject("http://localhost:8080/api/mqtt/subscribe?topic=/PTIT_Test/p/temp&wait_millis=2000", MqttSub[].class);
        if (mqttSub != null && mqttSub.length > 0) {
            return mqttSub[mqttSub.length - 1];
        } else {
            return new MqttSub();
        }
    }
    
    @GetMapping("/hum")
    public MqttSub getHum() {
        MqttSub[] mqttSub = rest.getForObject("http://localhost:8080/api/mqtt/subscribe?topic=/PTIT_Test/p/hum&wait_millis=2000", MqttSub[].class);
        if (mqttSub != null && mqttSub.length > 0) {
            return mqttSub[mqttSub.length - 1];
        } else {
            return new MqttSub();
        }
    }
    
    @GetMapping("/gas")
    public MqttSub getGas() {
        MqttSub[] mqttSub = rest.getForObject("http://localhost:8080/api/mqtt/subscribe?topic=/PTIT_Test/p/gas&wait_millis=2000", MqttSub[].class);
        if (mqttSub != null && mqttSub.length > 0) {
            return mqttSub[mqttSub.length - 1];
        } else {
            return new MqttSub();
        }
    }
    
    @GetMapping("/flame")
    public MqttSub getFlame() {
        MqttSub[] mqttSub = rest.getForObject("http://localhost:8080/api/mqtt/subscribe?topic=/PTIT_Test/p/flame&wait_millis=2000", MqttSub[].class);
        if (mqttSub != null && mqttSub.length > 0) {
            return mqttSub[mqttSub.length - 1];
        } else {
            return new MqttSub();
        }
    }
    
    
   
}