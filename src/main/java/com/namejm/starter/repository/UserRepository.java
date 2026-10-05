package com.namejm.starter.repository;

import com.namejm.starter.vo.UserVo;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

/**
 *
 * <pre>
 * packageName    : com.namejm.starter.repository
 * fileName       : UserRepository
 * author         : jmkim
 * date           : 26. 1. 9.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 26. 1. 9.        jmkim       최초 생성
 * </pre>
 */
@Repository
public interface UserRepository extends R2dbcRepository<UserVo, Long> {
	Mono<UserVo> findByUsername(String name);
	Mono<UserVo> findByEmail(String email);
}
