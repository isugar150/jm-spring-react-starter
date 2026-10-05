package com.namejm.starter;

import com.namejm.starter.service.UserService;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import reactor.blockhound.BlockHound;
import reactor.core.scheduler.Schedulers;
import reactor.test.StepVerifier;

/**
 *
 * <pre>
 * packageName    : com.namejm.starter
 * fileName       : UserServiceTest
 * author         : jmkim
 * date           : 26. 1. 15.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 26. 1. 15.        jmkim       최초 생성
 * </pre>
 */
@SpringBootTest
public class UserServiceTest {
    @Autowired
    private UserService userService;


    @BeforeAll
    static void setup() {
        BlockHound.install();
    }

    @Test
    void serviceShouldReturnUser() {
        StepVerifier.create(
                userService.getUser(1L)
                       .subscribeOn(Schedulers.parallel())
        )
        .expectNextMatches(user -> user != null && user.getId() != null)
        .verifyComplete();
    }

    @Test
    void serviceShouldReturnEmptyWhenUserMissing() {
        StepVerifier.create(
                userService.getUser(-1L)
                       .subscribeOn(Schedulers.parallel())
        )
        .expectComplete()
        .verify();
    }
}
