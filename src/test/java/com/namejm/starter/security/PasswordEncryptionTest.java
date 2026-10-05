package com.namejm.starter.security;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.assertj.core.api.Assertions.assertThat;

/**
 *
 * <pre>
 * packageName    : com.namejm.starter.security
 * fileName       : PasswordEncryptionTest
 * author         : jmkim
 * date           : 26. 1. 28.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 26. 1. 28.        jmkim       최초 생성
 * </pre>
 */
@SpringBootTest
public class PasswordEncryptionTest {
	@Autowired
	private PasswordEncoder passwordEncoder;

	@Test
	void bcryptEncodeAndMatch() {
		String rawPassword = "admin1231!";

		String encoded = passwordEncoder.encode(rawPassword);

		assertThat(encoded).isNotBlank();
		assertThat(encoded).isNotEqualTo(rawPassword);
		assertThat(passwordEncoder.matches(rawPassword, encoded)).isTrue();
		assertThat(passwordEncoder.matches("wrong-password", encoded)).isFalse();

		System.out.println("enc password: " + encoded);
	}
}
