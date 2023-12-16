package com.codeweb.springjdbc.controller;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.codeweb.springjdbc.models.User;
import com.codeweb.springjdbc.repository.UserRepository;

import jakarta.servlet.http.HttpSession;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {
	@Autowired
    private UserRepository repo;
	
	@PostMapping("/login")
	 public ResponseEntity<Map<String, String>> login(@RequestBody User user, HttpSession session) {
	     List<User> foundUser = repo.findByUsername(user.getUsername().trim());
	     if (foundUser.isEmpty()) {
	         return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Collections.singletonMap("error", "err"));
	     }
	     User existingUser = foundUser.get(0);
	     if (!existingUser.getPassword().equals(user.getPassword())) {
	         return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Collections.singletonMap("error", "Sai mật khẩu"));
	     }
	     
	     Integer userId = existingUser.getId();
	     String userRole = existingUser.getRole(); 
	     
	     Map<String, String> response = new HashMap<>();
	     response.put("role", userRole);
	     
	     return ResponseEntity.ok(response);
	 }
	
	@GetMapping("/account")
    List<User> getAllBooks(){
    	return repo.findAll();
    }
	
	@GetMapping("/account/{id}")
    User getUserById(@PathVariable Integer id) {
        Optional<User> user = repo.findById(id);
        return user.orElse(null); 
    }
	
	@PutMapping("/account/{id}")
    public ResponseEntity<String> updateUser(@RequestBody User newUser, @PathVariable Integer id) {
		User updatedUser = repo.findById(id)
	    .map(user -> {
	    	user.setUsername(newUser.getUsername());
	    	user.setPassword(newUser.getPassword());
	    	user.setRole(newUser.getRole());
		    return repo.save(user);
	    })
	    .orElseGet(() -> {
		    newUser.setId(id);
		    return repo.save(newUser);
	    });
    	return ResponseEntity.ok("Cập nhật thành viên thành công");
    }
	
	@PostMapping("/account/insert")
    public ResponseEntity<String> insertUser(@RequestBody User newUser) {
        List<User> foundUser = repo.findByUsername(newUser.getUsername().trim());
        if (foundUser.size() > 0) {
            return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED).body("Username này đã được sử dụng");
        }
        User savedUser = repo.save(newUser);
        Integer userId = savedUser.getId();
        return ResponseEntity.status(HttpStatus.OK).body(userId.toString());
    }
	
	@DeleteMapping("/account/{id}")
    public String deleteUser(@PathVariable Integer id) {
        boolean exists = repo.existsById(id);
        if(exists) {
            repo.deleteById(id);
            return "Xóa người dùng thành công";
        }
        return "Không tìm thấy người dùng";
    }
}
