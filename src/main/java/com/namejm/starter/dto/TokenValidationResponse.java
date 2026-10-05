package com.namejm.starter.dto;

import lombok.Builder;
import lombok.Getter;

/**
 *
 * <pre>
 * packageName    : com.namejm.starter.dto
 * fileName       : TokenValidationResponse
 * author         : jmkim
 * date           : 26. 2. 1.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 26. 2. 1.         jmkim       최초 생성
 * </pre>
 */
@Getter
@Builder
public class TokenValidationResponse {
	private boolean valid;
	private String username;

	public static TokenValidationResponse from(String username) {
		return TokenValidationResponse.builder()
			.valid(true)
			.username(username)
			.build();
	}
}
