-- psql -h localhost -U postgres -d hotelmanagement -f hotel_schema.sql

-- ============================================
-- Admins Table Schema (with AD001 style IDs)
-- ============================================
CREATE TABLE IF NOT EXISTS admins (
    admin_id VARCHAR(10) PRIMARY KEY,   -- custom ID like AD001
    admin_name VARCHAR(100) NOT NULL,
    admin_phone VARCHAR(15) UNIQUE NOT NULL,
    admin_email VARCHAR(100) UNIQUE NOT NULL,
    admin_password VARCHAR(255) NOT NULL,
    admin_role VARCHAR(50) NOT NULL DEFAULT 'admin',
    admin_profile VARCHAR(255),
    admin_status BOOLEAN NOT NULL DEFAULT TRUE, -- true = active, false = inactive
    admin_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    admin_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for faster lookup
CREATE INDEX IF NOT EXISTS idx_admin_phone ON admins(admin_phone);
CREATE INDEX IF NOT EXISTS idx_admin_email ON admins(admin_email);
CREATE INDEX IF NOT EXISTS idx_admin_status ON admins(admin_status);

-- ============================================
-- Admin Refresh Tokens Table Schema
-- ============================================
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(10) NOT NULL UNIQUE,
    refresh_token TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL
);

-- Index for lookup by token
CREATE INDEX IF NOT EXISTS idx_refresh_token ON refresh_tokens(refresh_token);

-- ============================================
-- Admin OTPs Table Schema
-- ============================================
CREATE TABLE IF NOT EXISTS user_otps (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(10) NOT NULL,
  phone VARCHAR(15) NOT NULL,
  otp VARCHAR(6) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  is_used BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for faster lookup
CREATE INDEX IF NOT EXISTS idx_user_otps_phone ON user_otps(phone);
CREATE INDEX IF NOT EXISTS idx_user_otps_valid ON user_otps(is_used, expires_at);
CREATE INDEX IF NOT EXISTS idx_user_otps_user_id ON user_otps(user_id);

-- ============================================
-- Owners Table Schema (with OW001 style IDs)
-- ============================================
CREATE TABLE IF NOT EXISTS owners (
    owner_id VARCHAR(10) PRIMARY KEY,              -- custom ID like OW001
    owner_name VARCHAR(100) NOT NULL,
    owner_phone VARCHAR(10) UNIQUE NOT NULL CHECK (owner_phone ~ '^[0-9]{10}$'),
    owner_email VARCHAR(100) UNIQUE NOT NULL,
    owner_address TEXT NOT NULL,
    owner_password VARCHAR(255) NOT NULL,
    owner_profile VARCHAR(255),                   -- profile image
    owner_status BOOLEAN NOT NULL DEFAULT TRUE,   -- true = active, false = inactive
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for faster lookup
CREATE INDEX IF NOT EXISTS idx_owner_email ON owners(owner_email);
CREATE INDEX IF NOT EXISTS idx_owner_phone ON owners(owner_phone);
CREATE INDEX IF NOT EXISTS idx_owner_status ON owners(owner_status);


-- ============================================
-- Hotels Table Schema (with HT001 style IDs)
-- ============================================
CREATE TABLE IF NOT EXISTS hotels (
    hotel_id VARCHAR(10) PRIMARY KEY,          -- custom ID like HT001
    owner_id VARCHAR(10) NOT NULL,  
    hotel_code VARCHAR(20) UNIQUE NOT NULL,       -- reference to owners(owner_id)
    hotel_name VARCHAR(150) NOT NULL,
    hotel_address TEXT NOT NULL,
    hotel_email VARCHAR(100) UNIQUE NOT NULL,
    hotel_phone VARCHAR(10) UNIQUE NOT NULL, 
    license_no VARCHAR(50) UNIQUE NOT NULL,    -- hotel license number
    hotel_document VARCHAR(255) NOT NULL,      -- file path or URL of license/document
    hotel_image VARCHAR(255),                  -- logo or image
    subscription BOOLEAN NOT NULL DEFAULT TRUE,      -- true = active, false = inactive
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Foreign Key Constraint
    CONSTRAINT fk_owner FOREIGN KEY (owner_id) REFERENCES owners(owner_id) ON DELETE CASCADE
);

-- Indexes for faster lookup
CREATE INDEX IF NOT EXISTS idx_hotel_owner_id ON hotels(owner_id);
CREATE INDEX IF NOT EXISTS idx_hotel_email ON hotels(hotel_email);
CREATE INDEX IF NOT EXISTS idx_hotel_phone ON hotels(hotel_phone);
CREATE INDEX IF NOT EXISTS idx_hotel_license_no ON hotels(license_no);
CREATE INDEX IF NOT EXISTS idx_hotel_code ON hotels(hotel_code);
CREATE INDEX IF NOT EXISTS idx_hotel_subscription ON hotels(subscription);



-- ============================================
-- Staff Table Schema (with hotel_id FK)
-- ============================================
CREATE TABLE IF NOT EXISTS staff (
    staff_id VARCHAR(10) PRIMARY KEY,               -- custom ID like ST001
    staff_name VARCHAR(100) NOT NULL,
    staff_phone VARCHAR(10) UNIQUE CHECK (staff_phone ~ '^[0-9]{10}$'),
    staff_email VARCHAR(100) UNIQUE,
    staff_address TEXT,
    staff_role VARCHAR(50),                         -- Manager / Receptionist / etc.
    staff_password VARCHAR(255) NOT NULL,           -- hashed password
    staff_status BOOLEAN NOT NULL DEFAULT TRUE,     -- true = active, false = inactive
    hotel_id VARCHAR(10),                           -- foreign key to hotels table
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- ✅ Table-level foreign key constraint
    CONSTRAINT fk_staff_hotel
      FOREIGN KEY (hotel_id)
      REFERENCES hotels(hotel_id)
      ON UPDATE CASCADE
      ON DELETE SET NULL
);

-- Indexes for faster lookup
CREATE INDEX IF NOT EXISTS idx_staff_email ON staff(staff_email);
CREATE INDEX IF NOT EXISTS idx_staff_phone ON staff(staff_phone);
CREATE INDEX IF NOT EXISTS idx_staff_status ON staff(staff_status);
CREATE INDEX IF NOT EXISTS idx_staff_role ON staff(staff_role);
CREATE INDEX IF NOT EXISTS idx_staff_hotel ON staff(hotel_id);

