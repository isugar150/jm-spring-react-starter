package com.namejm.starter.component.security;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

/**
 *
 * <pre>
 * packageName    : com.namejm.starter.component.security
 * fileName       : JwtAuthenticationFilter
 * author         : jmkim
 * date           : 26. 1. 28.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 26. 1. 28.        jmkim       최초 생성
 * </pre>
 */
public class JwtAuthenticationFilter implements WebFilter {
	private final JwtTokenProvider tokenProvider;

	public JwtAuthenticationFilter(JwtTokenProvider tokenProvider) {
		this.tokenProvider = tokenProvider;
	}

	@Override
	public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
		String jwt = resolveToken(exchange);
		if (!StringUtils.hasText(jwt)) {
			return chain.filter(exchange);
		}

		if (!tokenProvider.validateToken(jwt)) {
			exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
			return exchange.getResponse().setComplete();
		}

		String path = exchange.getRequest().getURI().getPath();
		if ("/auth/refreshToken".equals(path) && !tokenProvider.isRefreshToken(jwt)) {
			exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
			return exchange.getResponse().setComplete();
		}

		if (!"/auth/refreshToken".equals(path) && tokenProvider.isRefreshToken(jwt)) {
			exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
			return exchange.getResponse().setComplete();
		}

		Authentication authentication = tokenProvider.getAuthentication(jwt);
		return chain.filter(exchange)
			.contextWrite(ReactiveSecurityContextHolder.withAuthentication(authentication));
	}

	private String resolveToken(ServerWebExchange exchange) {
		String bearerToken = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
		if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
			return bearerToken.substring(7);
		}
		return null;
	}
}
