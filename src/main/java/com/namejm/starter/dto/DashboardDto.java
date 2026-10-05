package com.namejm.starter.dto;

import com.namejm.starter.vo.UserVo;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 *
 * <pre>
 * packageName    : com.namejm.starter.vo
 * fileName       : DashboardDto
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
public class DashboardDto {
    private UserVo user;
    private List<OrderDto> orders;
    private List<UserVo> recommendations;
}