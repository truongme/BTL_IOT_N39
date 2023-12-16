package com.codeweb.springjdbc.controller;

import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import com.codeweb.springjdbc.config.Mqtt;
import com.codeweb.springjdbc.exceptions.MqttException;
import com.codeweb.springjdbc.exceptions.ExceptionMessages;
import com.codeweb.springjdbc.models.MqttPub;
import com.codeweb.springjdbc.models.MqttSub;

import javax.validation.Valid;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping(value = "/api/mqtt")
@CrossOrigin(origins = "http://localhost:3000")
public class MqttController {

	@PostMapping("publish")
    public void publishMessage(@RequestBody @Valid MqttPub messagePublishModel,
                               BindingResult bindingResult) throws org.eclipse.paho.client.mqttv3.MqttException {
        if (bindingResult.hasErrors()) {
            throw new MqttException(ExceptionMessages.SOME_PARAMETERS_INVALID);
        }

        MqttMessage mqttMessage = new MqttMessage(messagePublishModel.getMessage().getBytes());
        mqttMessage.setQos(messagePublishModel.getQos());
        mqttMessage.setRetained(messagePublishModel.getRetained());

        Mqtt.getInstance().publish(messagePublishModel.getTopic(), mqttMessage);
    }

	 @GetMapping("subscribe")
	    public List<MqttSub> subscribeChannel(@RequestParam(value = "topic") String topic,
	                                                     @RequestParam(value = "wait_millis") Integer waitMillis)
	            throws InterruptedException, org.eclipse.paho.client.mqttv3.MqttException {
	        List<MqttSub> messages = new ArrayList<>();
	        CountDownLatch countDownLatch = new CountDownLatch(10);
	        Mqtt.getInstance().subscribeWithResponse(topic, (s, mqttMessage) -> {
	            MqttSub mqttSubscribeModel = new MqttSub();
	            mqttSubscribeModel.setId(mqttMessage.getId());
	            mqttSubscribeModel.setMessage(new String(mqttMessage.getPayload()));
	            System.out.println(mqttSubscribeModel.getMessage());
	            mqttSubscribeModel.setQos(mqttMessage.getQos());
	            messages.add(mqttSubscribeModel);
	            countDownLatch.countDown();
	        });
	        countDownLatch.await(waitMillis, TimeUnit.MILLISECONDS);
	        return messages;
	    }
}