package com.namejm.starter.controller;

import com.namejm.starter.dto.TokenValidationResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

/**
 *
 * <pre>
 * packageName    : com.namejm.starter.controller
 * fileName       : TokenTestController
 * author         : jmkim
 * date           : 26. 2. 1.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 26. 2. 1.         jmkim       최초 생성
 * </pre>
 */
@RestController
@RequestMapping("/token")
public class TokenTestController {

	@GetMapping("/validate")
	public Mono<ResponseEntity<TokenValidationResponse>> validate(Mono<Authentication> authenticationMono) {
		return authenticationMono
			.filter(Authentication::isAuthenticated)
			.map(auth -> ResponseEntity.ok(TokenValidationResponse.from(auth.getName())))
			.switchIfEmpty(Mono.just(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build()));
	}
}
