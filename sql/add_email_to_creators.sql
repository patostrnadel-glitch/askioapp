alter table public.creators
add column if not exists email text;

update public.creators
set email = lower(trim(email))
where email is not null;

create unique index if not exists creators_email_unique_idx
on public.creators (lower(email))
where email is not null;

alter table public.creators
drop constraint if exists creators_email_format_check;

alter table public.creators
add constraint creators_email_format_check
check (
  email is null
  or email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'
);
