-- public.users definition

-- Drop table

-- DROP TABLE public.users;

CREATE TABLE public.users (
	id bigserial NOT NULL,
	uuid uuid NOT NULL,
	login text NOT NULL,
	"password" text NOT NULL,
	created_at timestamptz NOT NULL DEFAULT now(),
	updated_at timestamptz NOT NULL DEFAULT now(),
	CONSTRAINT users_pk PRIMARY KEY (id),
	CONSTRAINT users_un_login UNIQUE (login),
	CONSTRAINT users_un_uuid UNIQUE (uuid)
);