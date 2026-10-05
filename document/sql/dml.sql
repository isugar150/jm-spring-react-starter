
INSERT INTO tb_roles (name) VALUES ('ROLE_USER');
INSERT INTO tb_roles (name) VALUES ('ROLE_ADMIN');

-- 'admin' 사용자 추가 (비밀번호는 'admin'을 BCrypt로 해싱한 값이어야 합니다)
-- 예시 해시: $2a$10$pL.APG2Tgw.b8t5/2iP9.eL9yOCr.OaR0dYACjYJpsxzJ45Vl5kG.
-- 실제 운영 시에는 애플리케이션을 통해 사용자를 생성하여 저장해야 합니다.
INSERT INTO tb_users (username, password, email, enabled) VALUES ('admin', '$2a$10$wNc92d0QCKvrYSLHcHw34uSilWXSo74najABewzBssAvcP7A2hQk.', 'admin@example.com', TRUE);

-- 'admin' 사용자에게 ROLE_USER와 ROLE_ADMIN 역할 부여
-- 위 INSERT 구문 실행 후 생성된 ID 값을 확인하고 실행해야 합니다. (기본적으로 1, 1, 2)
INSERT INTO tb_users_roles (user_id, role_id) VALUES (1, 1); -- admin에게 ROLE_USER 부여
INSERT INTO tb_users_roles (user_id, role_id) VALUES (1, 2); -- admin에게 ROLE_ADMIN 부여