package com.namejm.starter.controller;

import com.namejm.starter.component.security.JwtTokenProvider;
import com.namejm.starter.dto.AuthLoginRequest;
import com.namejm.starter.dto.AuthTokenResponse;
import com.namejm.starter.dto.AuthUserResponse;
import com.namejm.starter.dto.TokenRefreshRequest;
import com.namejm.starter.repository.UserRepository;
import com.namejm.starter.vo.UserVo;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Locale;

/**
 *
 * <pre>
 * packageName    : com.namejm.starter.controller
 * fileName       : AuthController
 * author         : jmkim
 * date           : 26. 1. 28.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 26. 1. 28.        jmkim       최초 생성
 * </pre>
 */
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
	private final UserRepository userRepository;
	private final JwtTokenProvider tokenProvider;
	private final PasswordEncoder passwordEncoder;

	@PostMapping("/login")
	public Mono<ResponseEntity<AuthTokenResponse>> login(
		@Valid @RequestBody AuthLoginRequest request
	) {
		String identifier = request.getUsername().trim();
		if (identifier.length() < 5) {
			return Mono.error(new ResponseStatusException(
				HttpStatus.BAD_REQUEST,
				"Username must be at least 5 characters when not using email"
			));
		}
		Mono<UserVo> userMono = userRepository.findByUsername(identifier);

		return userMono
			.switchIfEmpty(Mono.error(new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials")))
			.flatMap(user -> {
				if (!Boolean.TRUE.equals(user.getEnabled())) {
					return Mono.error(new ResponseStatusException(HttpStatus.FORBIDDEN, "User is disabled"));
				}
				if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
					return Mono.error(new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));
				}
				Authentication authentication = buildAuthentication(user.getUsername());
				String accessToken = tokenProvider.createAccessToken(authentication);
				String refreshToken = tokenProvider.createRefreshToken(authentication);
				AuthTokenResponse response = AuthTokenResponse.from(user, accessToken, refreshToken);
				return Mono.just(ResponseEntity.ok(response));
			});
	}

	@PostMapping("/refreshToken")
	public Mono<ResponseEntity<AuthTokenResponse>> refreshToken(
		@Valid @RequestBody TokenRefreshRequest request
	) {
		String refreshToken = request.getRefreshToken();
		if (!tokenProvider.validateToken(refreshToken) || !tokenProvider.isRefreshToken(refreshToken)) {
			return Mono.error(new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid refresh token"));
		}

		String username = tokenProvider.getUsernameFromToken(refreshToken);
		return userRepository.findByUsername(username)
			.switchIfEmpty(Mono.error(new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid refresh token")))
			.map(user -> {
				if (!Boolean.TRUE.equals(user.getEnabled())) {
					throw new ResponseStatusException(HttpStatus.FORBIDDEN, "User is disabled");
				}
				Authentication authentication = buildAuthentication(username);
				String newAccessToken = tokenProvider.createAccessToken(authentication);
				String newRefreshToken = tokenProvider.createRefreshToken(authentication);
				return ResponseEntity.ok(AuthTokenResponse.from(user, newAccessToken, newRefreshToken));
			});
	}

	@GetMapping("/me")
	public Mono<ResponseEntity<AuthUserResponse>> me(Mono<Authentication> authenticationMono) {
		return authenticationMono
			.filter(Authentication::isAuthenticated)
			.flatMap(auth -> userRepository.findByUsername(auth.getName()))
			.map(user -> ResponseEntity.ok(AuthUserResponse.from(user)))
			.switchIfEmpty(Mono.just(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build()));
	}

	@PostMapping("/logout")
	public Mono<ResponseEntity<Void>> logout() {
		return Mono.just(ResponseEntity.noContent().build());
	}

	private Authentication buildAuthentication(String username) {
		return new UsernamePasswordAuthenticationToken(
			username,
			null,
			List.of(new SimpleGrantedAuthority("ROLE_USER"))
		);
	}
}
