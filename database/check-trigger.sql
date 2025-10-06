-- Check if trigger exists
SELECT
    tgname AS trigger_name,
    tgrelid::regclass AS table_name,
    proname AS function_name
FROM pg_trigger t
JOIN pg_proc p ON t.tgfoid = p.oid
WHERE tgname LIKE '%portable%';

-- Check if function exists
SELECT
    proname AS function_name,
    prosrc AS function_body
FROM pg_proc
WHERE proname LIKE '%portable%';
