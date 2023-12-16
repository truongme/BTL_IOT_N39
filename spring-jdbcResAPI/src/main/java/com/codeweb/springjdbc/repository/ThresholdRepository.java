package com.codeweb.springjdbc.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.codeweb.springjdbc.models.Threshold;

public interface ThresholdRepository extends JpaRepository<Threshold, Integer> {
	List<Threshold> findById(int id);
}
