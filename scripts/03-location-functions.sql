-- Create function to get nearby shops
CREATE OR REPLACE FUNCTION get_nearby_shops(
  user_lat DECIMAL,
  user_lng DECIMAL,
  radius_km DECIMAL DEFAULT 10
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  description TEXT,
  logo_url TEXT,
  banner_url TEXT,
  phone TEXT,
  email TEXT,
  address_line_1 TEXT,
  address_line_2 TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  latitude DECIMAL,
  longitude DECIMAL,
  business_type TEXT,
  rating DECIMAL,
  review_count INTEGER,
  total_products INTEGER,
  distance_km DECIMAL,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.name,
    s.description,
    s.logo_url,
    s.banner_url,
    s.phone,
    s.email,
    s.address_line_1,
    s.address_line_2,
    s.city,
    s.state,
    s.postal_code,
    s.latitude,
    s.longitude,
    s.business_type,
    s.rating,
    s.review_count,
    s.total_products,
    ROUND(
      earth_distance(
        ll_to_earth(user_lat, user_lng),
        ll_to_earth(s.latitude, s.longitude)
      ) / 1000, 1
    ) AS distance_km,
    s.created_at
  FROM public.shops s
  WHERE 
    s.is_active = true 
    AND s.is_verified = true
    AND s.latitude IS NOT NULL 
    AND s.longitude IS NOT NULL
    AND earth_distance(
      ll_to_earth(user_lat, user_lng),
      ll_to_earth(s.latitude, s.longitude)
    ) <= (radius_km * 1000)
  ORDER BY distance_km ASC;
END;
$$ LANGUAGE plpgsql;
