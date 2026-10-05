-- PostgreSQL DDL for jm-spring-next-starter
-- File: /document/sql/ddl.sql
-- All tables are prefixed with 'tb_'.

-- 1. Users Table
-- 사용자 계정 정보를 저장합니다.
CREATE TABLE tb_users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE tb_users IS '사용자 계정 정보';
COMMENT ON COLUMN tb_users.id IS '사용자 고유 ID';
COMMENT ON COLUMN tb_users.username IS '로그인 아이디';
COMMENT ON COLUMN tb_users.password IS '암호화된 비밀번호';
COMMENT ON COLUMN tb_users.email IS '사용자 이메일';
COMMENT ON COLUMN tb_users.enabled IS '계정 활성화 여부 (true: 활성, false: 비활성)';
COMMENT ON COLUMN tb_users.created_at IS '생성 일시';
COMMENT ON COLUMN tb_users.updated_at IS '수정 일시';


-- 2. Roles Table
-- 사용자가 가질 수 있는 역할을 정의합니다. (e.g., ROLE_USER, ROLE_ADMIN)
CREATE TABLE tb_roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

COMMENT ON TABLE tb_roles IS '역할 정보';
COMMENT ON COLUMN tb_roles.id IS '역할 고유 ID';
COMMENT ON COLUMN tb_roles.name IS '역할 이름 (e.g., ROLE_USER)';


-- 3. User-Role Junction Table
-- 사용자와 역할의 다대다(Many-to-Many) 관계를 매핑합니다.
CREATE TABLE tb_users_roles (
    user_id BIGINT NOT NULL,
    role_id INT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES tb_users (id) ON DELETE CASCADE,
    CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES tb_roles (id) ON DELETE CASCADE
);

COMMENT ON TABLE tb_users_roles IS '사용자-역할 매핑 테이블';
COMMENT ON COLUMN tb_users_roles.user_id IS '사용자 ID (FK)';
COMMENT ON COLUMN tb_users_roles.role_id IS '역할 ID (FK)';


-- 4. Refresh Tokens Table
-- 발급된 리프레시 토큰을 저장하고 관리합니다.
CREATE TABLE public.tb_refresh_tokens (
	id bigserial NOT NULL,
	user_id int8 NOT NULL,
	user_agent TEXT not null,
	"token" varchar(255) NOT NULL,
	expiry_date timestamptz NOT NULL,
	CONSTRAINT tb_refresh_tokens_pkey PRIMARY KEY (id),
	CONSTRAINT fk_user_refresh_token FOREIGN KEY (user_id) REFERENCES public.tb_users(id) ON DELETE CASCADE
);

COMMENT ON TABLE tb_refresh_tokens IS '리프레시 토큰 정보';
COMMENT ON COLUMN tb_refresh_tokens.id IS '리프레시 토큰 고유 ID';
COMMENT ON COLUMN tb_refresh_tokens.user_id IS '토큰 소유자 ID (FK)';
COMMENT ON COLUMN tb_refresh_tokens.token IS '리프레시 토큰 문자열';
COMMENT ON COLUMN tb_refresh_tokens.expiry_date IS '토큰 만료 일시';


-- --- SAMPLE DATA ---

-- 기본 역할 추가