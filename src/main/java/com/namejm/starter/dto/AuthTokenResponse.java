package com.namejm.starter.dto;

import com.namejm.starter.vo.UserVo;
import lombok.Builder;
import lombok.Getter;

/**
 *
 * <pre>
 * packageName    : com.namejm.starter.dto
 * fileName       : AuthTokenResponse
 * author         : jmkim
 * date           : 26. 1. 28.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 26. 1. 28.        jmkim       최초 생성
 * </pre>
 */
@Getter
@Builder
public class AuthTokenResponse {
	private Long id;
	private String username;
	private String email;
	private String accessToken;
	private String refreshToken;
	private String tokenType;

	public static AuthTokenResponse from(UserVo user, String accessToken, String refreshToken) {
		return AuthTokenResponse.builder()
			.id(user.getId())
			.username(user.getUsername())
			.email(user.getEmail())
			.accessToken(accessToken)
			.refreshToken(refreshToken)
			.tokenType("Bearer")
			.build();
	}
}
