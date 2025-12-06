-- 1️⃣ Enable extension for integer columns in GIST
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- 2️⃣ Add the reservation_range column (nullable)
ALTER TABLE reservations
ADD COLUMN reservation_range tstzrange;

-- 3️⃣ Create trigger function to populate the column
CREATE OR REPLACE FUNCTION update_reservation_range() RETURNS trigger AS $$
BEGIN
  NEW.reservation_range := tstzrange(NEW.check_in, NEW.check_out, '[)');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4️⃣ Attach trigger to the table
CREATE TRIGGER set_reservation_range
BEFORE INSERT OR UPDATE ON reservations
FOR EACH ROW
EXECUTE FUNCTION update_reservation_range();

-- 5️⃣ Populate existing rows (if any)
UPDATE reservations
SET reservation_range = tstzrange(check_in, check_out, '[)');

-- 6️⃣ Add exclusion constraint
ALTER TABLE reservations
ADD CONSTRAINT reservation_no_overlap
EXCLUDE USING GIST (
    room_id WITH =,
    reservation_range WITH &&
);
