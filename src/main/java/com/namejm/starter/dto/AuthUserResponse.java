package com.namejm.starter.dto;

import com.namejm.starter.vo.UserVo;
import lombok.Builder;
import lombok.Getter;

/**
 *
 * <pre>
 * packageName    : com.namejm.starter.dto
 * fileName       : AuthUserResponse
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
public class AuthUserResponse {
	private Long id;
	private String username;
	private String email;

	public static AuthUserResponse from(UserVo user) {
		return AuthUserResponse.builder()
			.id(user.getId())
			.username(user.getUsername())
			.email(user.getEmail())
			.build();
	}
}
