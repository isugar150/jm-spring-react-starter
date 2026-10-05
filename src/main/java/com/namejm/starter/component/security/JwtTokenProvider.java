package com.namejm.starter.component.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Arrays;
import java.util.Collection;
import java.util.Date;
import java.util.stream.Collectors;

/**
 *
 * <pre>
 * packageName    : com.namejm.starter.component.security
 * fileName       : JwtTokenProvider
 * author         : jmkim
 * date           : 26. 1. 28.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 26. 1. 28.        jmkim       최초 생성
 * </pre>
 */
@Component
public class JwtTokenProvider {
	private final Key key;
	private final long accessTokenValidityInMilliseconds;
	private final long refreshTokenValidityInMilliseconds;

	public JwtTokenProvider(
		@Value("${starter.jwt.secret}") String secret,
		@Value("${starter.jwt.access-token-validity-in-seconds}") long accessTokenValidityInSeconds,
		@Value("${starter.jwt.refresh-token-validity-in-seconds}") long refreshTokenValidityInSeconds
	) {
		byte[] keyBytes = Decoders.BASE64.decode(secret);
		this.key = Keys.hmacShaKeyFor(keyBytes);
		this.accessTokenValidityInMilliseconds = accessTokenValidityInSeconds * 1000;
		this.refreshTokenValidityInMilliseconds = refreshTokenValidityInSeconds * 1000;
	}

	public String createAccessToken(Authentication authentication) {
		String authorities = authentication.getAuthorities().stream()
			.map(GrantedAuthority::getAuthority)
			.collect(Collectors.joining(","));

		long now = (new Date()).getTime();
		Date validity = new Date(now + this.accessTokenValidityInMilliseconds);

		return Jwts.builder()
			.setSubject(authentication.getName())
			.claim("auth", authorities)
			.claim("type", "access")
			.setIssuedAt(new Date(now))
			.setExpiration(validity)
			.signWith(key, SignatureAlgorithm.HS512)
			.compact();
	}

	public String createRefreshToken(Authentication authentication) {
		long now = (new Date()).getTime();
		Date validity = new Date(now + this.refreshTokenValidityInMilliseconds);

		return Jwts.builder()
			.setSubject(authentication.getName())
			.claim("type", "refresh")
			.setIssuedAt(new Date(now))
			.setExpiration(validity)
			.signWith(key, SignatureAlgorithm.HS512)
			.compact();
	}

	public boolean validateToken(String token) {
		try {
			Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
			return true;
		} catch (Exception e) {
			return false;
		}
	}

	public Authentication getAuthentication(String token) {
		Claims claims = Jwts.parserBuilder()
			.setSigningKey(key)
			.build()
			.parseClaimsJws(token)
			.getBody();

		Collection<? extends GrantedAuthority> authorities =
			Arrays.stream(claims.get("auth", String.class).split(","))
				.filter(auth -> !auth.trim().isEmpty())
				.map(SimpleGrantedAuthority::new)
				.collect(Collectors.toList());

		UserDetails principal = new User(claims.getSubject(), "", authorities);

		return new UsernamePasswordAuthenticationToken(principal, token, authorities);
	}

	public String getUsernameFromToken(String token) {
		return Jwts.parserBuilder()
			.setSigningKey(key)
			.build()
			.parseClaimsJws(token)
			.getBody()
			.getSubject();
	}

	public boolean isRefreshToken(String token) {
		Claims claims = Jwts.parserBuilder()
			.setSigningKey(key)
			.build()
			.parseClaimsJws(token)
			.getBody();

		return "refresh".equals(claims.get("type"));
	}
}
