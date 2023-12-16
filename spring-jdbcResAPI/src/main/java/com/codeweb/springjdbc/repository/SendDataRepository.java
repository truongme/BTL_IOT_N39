package com.codeweb.springjdbc.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.codeweb.springjdbc.models.SendData;

public interface SendDataRepository extends JpaRepository<SendData, Integer> {
	SendData findByHumAndTempAndGasAndFlame(float temp, float hum, int gas, int flame);
}
