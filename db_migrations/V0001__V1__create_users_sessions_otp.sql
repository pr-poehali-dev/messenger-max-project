CREATE TABLE IF NOT EXISTS t_p24027735_messenger_max_projec.users (
  id SERIAL PRIMARY KEY,
  phone VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL DEFAULT 'Пользователь',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS t_p24027735_messenger_max_projec.otp_codes (
  id SERIAL PRIMARY KEY,
  phone VARCHAR(20) NOT NULL,
  code VARCHAR(6) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP DEFAULT NOW() + INTERVAL '10 minutes',
  used BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS t_p24027735_messenger_max_projec.sessions (
  id SERIAL PRIMARY KEY,
  token VARCHAR(64) UNIQUE NOT NULL,
  user_id INTEGER NOT NULL REFERENCES t_p24027735_messenger_max_projec.users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP DEFAULT NOW() + INTERVAL '30 days'
);

CREATE INDEX IF NOT EXISTS idx_otp_phone ON t_p24027735_messenger_max_projec.otp_codes(phone);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON t_p24027735_messenger_max_projec.sessions(token);
