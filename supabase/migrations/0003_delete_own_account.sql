-- Self-service account deletion ---------------------------------------------
--
-- Lets a signed-in user delete their own auth user. Every app table references
-- auth.users with `on delete cascade`, so this also removes their profile,
-- daily_logs and vents. Required by App Store guideline 5.1.1(v) and promised
-- by the privacy policy ("removed within minutes of you deleting your account").

create or replace function public.delete_own_account()
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;
  delete from auth.users where id = auth.uid();
end;
$$;

revoke all on function public.delete_own_account() from public, anon;
grant execute on function public.delete_own_account() to authenticated;
