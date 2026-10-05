package com.namejm.starter.controller;

import com.namejm.starter.dto.DashboardDto;
import com.namejm.starter.vo.UserVo;
import com.namejm.starter.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.util.Map;

/**
 *
 * <pre>
 * packageName    : com.namejm.starter.controller
 * fileName       : UserController
 * author         : jmkim
 * date           : 26. 1. 7.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 26. 1. 7.        jmkim       최초 생성
 * </pre>
 */
@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    // 단건 조회
    @GetMapping("/{id}")
    public Mono<ResponseEntity<UserVo>> getUser(@PathVariable Long id) {
        return userService.getUser(id)
            .map(ResponseEntity::ok)
            .switchIfEmpty(Mono.error(new NullPointerException("User not found: " + id)))
            .onErrorReturn(ResponseEntity.notFound().build());
    }
    
    // 목록 조회
    @GetMapping
    public Flux<UserVo> getUsers(@RequestParam(defaultValue = "0") int page,
                                 @RequestParam(defaultValue = "10") int size) {
        return userService.getUsers(page * size, size);
    }

    // 신규 생성
    @PostMapping
    public Mono<ResponseEntity<UserVo>> createUser(@Valid @RequestBody UserVo user) {
        return userService.createUser(user)
            .map(u -> ResponseEntity.status(HttpStatus.CREATED).body(u));
    }

    @PutMapping("/{id}")
    public Mono<ResponseEntity<UserVo>> updateUser(@PathVariable Long id,
                                                   @Valid @RequestBody Mono<UserVo> userMono) {
        return userMono.flatMap(user -> userService.updateUser(id, user))
            .map(ResponseEntity::ok)
            .switchIfEmpty(Mono.just(ResponseEntity.notFound().build()))
                .onErrorResume(ResponseStatusException.class,e -> Mono.just(ResponseEntity.status(e.getStatusCode()).build()));
    }

    @PatchMapping("/{id}")
    public Mono<ResponseEntity<UserVo>> patchUser(@PathVariable Long id,
                                                  @RequestBody Mono<Map<String, Object>> partialMono) {
        return partialMono.flatMap(partial -> userService.patchUser(id, partial))
            .map(ResponseEntity::ok)
                .onErrorResume(ResponseStatusException.class,e -> Mono.just(ResponseEntity.status(e.getStatusCode()).build()));
    }

    @DeleteMapping("/{id}")
    public Mono<ResponseEntity<Void>> deleteUser(@PathVariable Long id) {
        return userService.deleteUser(id)
            .thenReturn(ResponseEntity.noContent().build());
    }
}
