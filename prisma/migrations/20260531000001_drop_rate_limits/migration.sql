-- Migration: drop_rate_limits
-- Tabel rate_limits sudah tidak dipakai karena rate limiting
-- telah dipindahkan ke Upstash Redis

DROP TABLE IF EXISTS "rate_limits";
