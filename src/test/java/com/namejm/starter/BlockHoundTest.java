package com.namejm.starter;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import reactor.blockhound.BlockHound;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 *
 * <pre>
 * packageName    : com.namejm.starter
 * fileName       : BlockHoundTest
 * author         : jmkim
 * date           : 26. 1. 15.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 26. 1. 15.        jmkim       최초 생성
 * </pre>
 */
class BlockHoundTest {

    @BeforeAll
    static void beforeAll() {
        BlockHound.install();
    }

    @Test
    void detectBlocking() {
        Throwable thrown = assertThrows(RuntimeException.class, () ->
            Mono.fromRunnable(() -> {
                    try {
                        Thread.sleep(10);
                    } catch (InterruptedException e) {
                        throw new RuntimeException(e);
                    }
                })
                .subscribeOn(Schedulers.parallel())
                .block()
        );

        assertTrue(
            thrown.getCause() != null &&
                thrown.getCause().getClass().getSimpleName().contains("BlockingOperationError")
        );
    }
}
