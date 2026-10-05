package com.namejm.starter.service;

import com.namejm.starter.vo.UserVo;
import com.namejm.starter.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.time.LocalDateTime;
import java.util.Map;

/**
 *
 * <pre>
 * packageName    : com.namejm.starter.service
 * fileName       : UserService
 * author         : jmkim
 * date           : 26. 1. 7.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 26. 1. 7.        jmkim       최초 생성
 * </pre>
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;

    @Cacheable(cacheNames = "user", key = "#id")
    public Mono<UserVo> getUser(Long id) {
        log.info("Fetching user: {}", id);
        return userRepository.findById(id)
            .subscribeOn(Schedulers.boundedElastic());
    }

    public Flux<UserVo> getUsers(int offset, int limit) {
        log.info("Fetching users: {}-{}", offset, offset + limit);
        return userRepository.findAll()
            .skip(offset)
            .take(limit)
            .subscribeOn(Schedulers.boundedElastic());
    }

    @CacheEvict(value = "users", key = "#result.id")
    public Mono<UserVo> createUser(UserVo user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    @CacheEvict(value = "users", key = "#id")
    public Mono<UserVo> updateUser(Long id, UserVo user) {
        return userRepository.findById(id)
            .switchIfEmpty(Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND)))
            .flatMap(existing -> {
                existing.setUsername(user.getUsername());
                existing.setEmail(user.getEmail());
                existing.setEnabled(user.getEnabled());
                existing.setUpdatedAt(LocalDateTime.now());
                return userRepository.save(existing);
            });
    }

    @CacheEvict(value = "users", key = "#id")
    public Mono<UserVo> patchUser(Long id, Map<String, Object> partial) {
        return userRepository.findById(id)
            .flatMap(user -> {
                partial.forEach((key, value) -> {
                    switch (key) {
                        case "enabled" -> user.setEnabled((Boolean) value);
                        case "email" -> user.setEmail((String) value);
                    }
                });
                user.setUpdatedAt(LocalDateTime.now());
                return userRepository.save(user);
            });
    }

    @CacheEvict(value = "users", key = "#id")
    public Mono<Void> deleteUser(Long id) {
        return userRepository.existsById(id)
            .switchIfEmpty(Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND)))
            .flatMap(exists -> {
                if (Boolean.TRUE.equals(exists)) {
                    return userRepository.deleteById(id);
                }
                return Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
            });
    }
}
