package com.codeweb.springjdbc.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.codeweb.springjdbc.models.User;

public interface UserRepository extends JpaRepository<User, Integer> {
	List<User> findByUsername(String username);
}