package com.namejm.starter.config;

import io.r2dbc.spi.R2dbcException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.dao.DataAccessException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.bind.support.WebExchangeBindException;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.Map;

/**
 *
 * <pre>
 * packageName    : com.namejm.starter.config
 * fileName       : GlobalExceptionHandler
 * author         : jmkim
 * date           : 26. 1. 9.
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 26. 1. 9.        jmkim       최초 생성
 * </pre>
 */
@ControllerAdvice
@Slf4j
public class GlobalExceptionHandler {
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public Mono<ResponseEntity<Map<String, String>>> handleValidation(
            MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
            errors.put(error.getField(), error.getDefaultMessage()));
        return Mono.just(ResponseEntity.badRequest().body(errors));
    }

    @ExceptionHandler(WebExchangeBindException.class)
    public Mono<ResponseEntity<Map<String, String>>> handleWebValidation(
            WebExchangeBindException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
            errors.put(error.getField(), error.getDefaultMessage()));
        return Mono.just(ResponseEntity.badRequest().body(errors));
    }

    @ExceptionHandler(ResponseStatusException.class)
    public Mono<ResponseEntity<Map<String, String>>> handleStatus(
            ResponseStatusException ex,
            ServerWebExchange exchange) {
        String path = exchange.getRequest().getPath().value();
        log.warn("Handled status exception: status={}, path={}, message={}",
            ex.getStatusCode(), path, ex.getReason());

        Map<String, String> body = new HashMap<>();
        body.put("message", ex.getReason() != null ? ex.getReason() : "Unexpected error");
        body.put("path", path);
        return Mono.just(ResponseEntity.status(ex.getStatusCode()).body(body));
    }

    @ExceptionHandler({DataAccessException.class, R2dbcException.class})
    public Mono<ResponseEntity<Map<String, String>>> handleDatabase(
        Exception ex,
        ServerWebExchange exchange) {
        String path = exchange.getRequest().getPath().value();
        log.error("Database exception: path={}", path, ex);

        Map<String, String> body = new HashMap<>();
        body.put("message", "Database temporarily unavailable");
        body.put("path", path);
        return Mono.just(ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(body));
    }

    @ExceptionHandler(Exception.class)
    public Mono<ResponseEntity<Map<String, String>>> handleOther(
            Exception ex,
            ServerWebExchange exchange) {
        String path = exchange.getRequest().getPath().value();
        log.error("Unhandled exception: path={}", path, ex);

        Map<String, String> body = new HashMap<>();
        body.put("message", "Internal server error");
        body.put("path", path);
        return Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body));
    }
}
