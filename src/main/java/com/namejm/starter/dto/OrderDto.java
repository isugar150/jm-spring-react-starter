package com.namejm.starter.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 *
 * <pre>
 * packageName    : com.namejm.starter.dto
 * fileName       : OrderDto
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
public class OrderDto {
    private Long id;
    private Long userId;
    private String product;
}
