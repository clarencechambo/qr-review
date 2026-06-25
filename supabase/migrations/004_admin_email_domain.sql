-- Enforce that only @discountcentre.co.tz emails can register as admins.
-- Client-side validation in the signup page is convenience only; this trigger
-- is the real, unbypassable guard at the database level.

create or replace function public.enforce_admin_email_domain()
returns trigger
language plpgsql
as $$
begin
  if new.email is null or lower(new.email) not like '%@discountcentre.co.tz' then
    raise exception 'Only @discountcentre.co.tz email addresses may register';
  end if;
  return new;
end;
$$;

drop trigger if exists enforce_admin_email_domain on auth.users;

create trigger enforce_admin_email_domain
  before insert on auth.users
  for each row
  execute function public.enforce_admin_email_domain();
