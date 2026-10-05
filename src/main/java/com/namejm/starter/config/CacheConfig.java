package com.namejm.starter.config;

import com.github.benmanes.caffeine.cache.Caffeine;
import com.github.benmanes.caffeine.cache.CaffeineSpec;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 *
 * <pre>
 * packageName    : com.namejm.starter.config
 * fileName       : CacheConfig
 * author         : jmkim
 * date           : 26. 1. 9.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 26. 1. 9.        jmkim       최초 생성
 * </pre>
 */
@Configuration
@EnableCaching
public class CacheConfig {
    @Bean
    public CaffeineCacheManager cacheManager(@Value("${spring.cache.caffeine.spec:}") String spec) {
        Caffeine<Object, Object> builder = spec.isBlank()
            ? Caffeine.newBuilder()
            : Caffeine.from(CaffeineSpec.parse(spec));

        CaffeineCacheManager cm = new CaffeineCacheManager();
        cm.setAsyncCacheMode(true);
        cm.setCaffeine(builder);
        return cm;
    }
}
