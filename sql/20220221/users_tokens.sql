-- public.users_tokens definition

-- Drop table

-- DROP TABLE public.users_tokens;

CREATE TABLE public.users_tokens (
	id bigserial NOT NULL,
	user_id int8 NOT NULL,
	"token" text NOT NULL,
	updated_at timetz NOT NULL DEFAULT now(),
	expires_after timestamptz NULL,
	CONSTRAINT users_tokens_pk PRIMARY KEY (id)
);


-- public.users_tokens foreign keys

ALTER TABLE public.users_tokens ADD CONSTRAINT users_tokens_fk FOREIGN KEY (user_id) REFERENCES public.users(id);