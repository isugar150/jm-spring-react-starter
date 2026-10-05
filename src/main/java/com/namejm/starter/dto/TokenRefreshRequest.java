package com.namejm.starter.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 *
 * <pre>
 * packageName    : com.namejm.starter.dto
 * fileName       : TokenRefreshRequest
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
@NoArgsConstructor
public class TokenRefreshRequest {
	@NotBlank(message = "Refresh token is required")
	@Size(min = 10, message = "Refresh token must be at least 10 characters")
	private String refreshToken;
}
