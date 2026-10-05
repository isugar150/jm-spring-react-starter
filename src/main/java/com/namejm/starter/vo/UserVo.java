package com.namejm.starter.vo;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDateTime;

/**
 *
 * <pre>
 * packageName    : com.namejm.starter.vo
 * fileName       : UserVO
 * author         : jmkim
 * date           : 26. 1. 7.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 26. 1. 7.        jmkim       최초 생성
 * </pre>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(value = "tb_users", schema = "public")  // 스키마 명시
public class UserVo {
    @Id
    private Long id;

    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50)
    @Column("username")
    private String username;

    @NotBlank
    @Size(min = 8)
    @Column("password")
    private String password;

    @NotBlank
    @Email
    @Size(max = 100)
    @Column("email")
    private String email;

    @NotNull
    @Column("enabled")
    private Boolean enabled;

    @Column("created_at")
    private LocalDateTime createdAt;

    @Column("updated_at")
    private LocalDateTime updatedAt;
}