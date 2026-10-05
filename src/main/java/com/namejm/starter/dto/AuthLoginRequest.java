package com.namejm.starter.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 *
 * <pre>
 * packageName    : com.namejm.starter.dto
 * fileName       : AuthLoginRequest
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
public class AuthLoginRequest {
	@NotBlank(message = "Username is required")
	private String username;

	@NotBlank(message = "Password is required")
	@Size(min = 8, message = "Password must be at least 8 characters")
	private String password;
}
