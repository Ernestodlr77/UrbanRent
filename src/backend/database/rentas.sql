USE urbanrent_db_in5bm;

INSERT INTO users (fullName, email, password, role, phone) VALUES
('María Fernanda López', 'maria.lopez@urbanrent.com', '$2a$10$NO5aPbiFlft/Q0VIN8nQ5uDNOrRc1T/M3p.2D.DSPnuRz/t6Hb/ke', 'LANDLORD', '+502 5555-1001'),
('Carlos Alberto Méndez', 'carlos.mendez@urbanrent.com', '$2a$10$NO5aPbiFlft/Q0VIN8nQ5uDNOrRc1T/M3p.2D.DSPnuRz/t6Hb/ke', 'LANDLORD', '+502 5555-1002'),
('Sofía Valentina García', 'sofia.garcia@urbanrent.com', '$2a$10$NO5aPbiFlft/Q0VIN8nQ5uDNOrRc1T/M3p.2D.DSPnuRz/t6Hb/ke', 'LANDLORD', '+502 5555-1003'),
('Luis Fernando Ramírez', 'luis.ramirez@urbanrent.com', '$2a$10$NO5aPbiFlft/Q0VIN8nQ5uDNOrRc1T/M3p.2D.DSPnuRz/t6Hb/ke', 'LANDLORD', '+502 5555-1004'),
('Daniela Morales', 'daniela.morales@urbanrent.com', '$2a$10$NO5aPbiFlft/Q0VIN8nQ5uDNOrRc1T/M3p.2D.DSPnuRz/t6Hb/ke', 'LANDLORD', '+502 5555-1005'),
('Jorge Alejandro Castillo', 'jorge.castillo@urbanrent.com', '$2a$10$NO5aPbiFlft/Q0VIN8nQ5uDNOrRc1T/M3p.2D.DSPnuRz/t6Hb/ke', 'LANDLORD', '+502 5555-1006'),
('Andrea Carolina Pérez', 'andrea.perez@urbanrent.com', '$2a$10$NO5aPbiFlft/Q0VIN8nQ5uDNOrRc1T/M3p.2D.DSPnuRz/t6Hb/ke', 'LANDLORD', '+502 5555-1007'),
('Miguel Ángel Herrera', 'miguel.herrera@urbanrent.com', '$2a$10$NO5aPbiFlft/Q0VIN8nQ5uDNOrRc1T/M3p.2D.DSPnuRz/t6Hb/ke', 'LANDLORD', '+502 5555-1008'),
('Paola Andrea Sánchez', 'paola.sanchez@urbanrent.com', '$2a$10$NO5aPbiFlft/Q0VIN8nQ5uDNOrRc1T/M3p.2D.DSPnuRz/t6Hb/ke', 'LANDLORD', '+502 5555-1009'),
('Ricardo Estuardo Gómez', 'ricardo.gomez@urbanrent.com', '$2a$10$NO5aPbiFlft/Q0VIN8nQ5uDNOrRc1T/M3p.2D.DSPnuRz/t6Hb/ke', 'LANDLORD', '+502 5555-1010')
ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id);

SET @owner1 = (SELECT id FROM users WHERE email = 'maria.lopez@urbanrent.com');
SET @owner2 = (SELECT id FROM users WHERE email = 'carlos.mendez@urbanrent.com');
SET @owner3 = (SELECT id FROM users WHERE email = 'sofia.garcia@urbanrent.com');
SET @owner4 = (SELECT id FROM users WHERE email = 'luis.ramirez@urbanrent.com');
SET @owner5 = (SELECT id FROM users WHERE email = 'daniela.morales@urbanrent.com');
SET @owner6 = (SELECT id FROM users WHERE email = 'jorge.castillo@urbanrent.com');
SET @owner7 = (SELECT id FROM users WHERE email = 'andrea.perez@urbanrent.com');
SET @owner8 = (SELECT id FROM users WHERE email = 'miguel.herrera@urbanrent.com');
SET @owner9 = (SELECT id FROM users WHERE email = 'paola.sanchez@urbanrent.com');
SET @owner10 = (SELECT id FROM users WHERE email = 'ricardo.gomez@urbanrent.com');

INSERT INTO properties
(landlordId, title, description, address, city, countryCode, countryName, propertyType, monthlyRent, currencyCode, latitude, longitude, status, isRental)
SELECT landlordId, title, description, address, city, countryCode, countryName, propertyType, monthlyRent, currencyCode, latitude, longitude, 'AVAILABLE', 1
FROM (
  SELECT @owner1 landlordId, 'Apartamento moderno Zona 10' title, 'Apartamento moderno de dos habitaciones ubicado en Zona 10.' description, 'Avenida Reforma, Zona 10' address, 'Ciudad de Guatemala' city, 'GTM' countryCode, 'Guatemala' countryName, 'APARTMENT' propertyType, 6500 monthlyRent, 'GTQ' currencyCode, 14.5918 latitude, -90.513 longitude
  UNION ALL SELECT @owner1, 'Casa familiar Zona 15', 'Casa amplia con jardín y estacionamiento.', 'Colonia Vista Hermosa II, Zona 15', 'Ciudad de Guatemala', 'GTM', 'Guatemala', 'HOUSE', 9500, 'GTQ', 14.6067, -90.4899
  UNION ALL SELECT @owner2, 'Apartamento Zona 14', 'Apartamento amueblado ideal para una pareja o profesional.', 'Zona 14', 'Ciudad de Guatemala', 'GTM', 'Guatemala', 'APARTMENT', 7200, 'GTQ', 14.5847, -90.5058
  UNION ALL SELECT @owner2, 'Casa Las Charcas', 'Casa de tres habitaciones con patio y garaje.', 'Las Charcas', 'Ciudad de Guatemala', 'GTM', 'Guatemala', 'HOUSE', 8800, 'GTQ', 14.5679, -90.5723
  UNION ALL SELECT @owner3, 'Apartamento Zona 4', 'Apartamento moderno cerca de restaurantes y comercios.', '4 Avenida, Zona 4', 'Ciudad de Guatemala', 'GTM', 'Guatemala', 'APARTMENT', 5800, 'GTQ', 14.621, -90.5132
  UNION ALL SELECT @owner3, 'Casa Carretera a El Salvador', 'Casa amplia con tres habitaciones y área verde.', 'Carretera a El Salvador', 'Ciudad de Guatemala', 'GTM', 'Guatemala', 'HOUSE', 10500, 'GTQ', 14.5595, -90.4645
  UNION ALL SELECT @owner4, 'Apartamento Zona 11', 'Apartamento de dos habitaciones con seguridad privada.', 'Zona 11', 'Ciudad de Guatemala', 'GTM', 'Guatemala', 'APARTMENT', 5200, 'GTQ', 14.6014, -90.5501
  UNION ALL SELECT @owner4, 'Casa San Cristóbal', 'Casa familiar con garaje para dos vehículos.', 'Ciudad San Cristóbal', 'Mixco', 'GTM', 'Guatemala', 'HOUSE', 7800, 'GTQ', 14.6155, -90.6068
  UNION ALL SELECT @owner5, 'Apartamento Zona 1', 'Apartamento remodelado en el centro histórico.', 'Zona 1', 'Ciudad de Guatemala', 'GTM', 'Guatemala', 'APARTMENT', 3900, 'GTQ', 14.6349, -90.5069
  UNION ALL SELECT @owner5, 'Casa Zona 2', 'Casa de dos niveles con patio y estacionamiento.', 'Zona 2', 'Ciudad de Guatemala', 'GTM', 'Guatemala', 'HOUSE', 6200, 'GTQ', 14.651, -90.5116
  UNION ALL SELECT @owner6, 'Apartamento Zona 16', 'Apartamento moderno con seguridad y áreas comunes.', 'Zona 16', 'Ciudad de Guatemala', 'GTM', 'Guatemala', 'APARTMENT', 6900, 'GTQ', 14.6167, -90.4818
  UNION ALL SELECT @owner6, 'Casa Santa Catarina Pinula', 'Casa de tres habitaciones con jardín.', 'Santa Catarina Pinula', 'Santa Catarina Pinula', 'GTM', 'Guatemala', 'HOUSE', 8300, 'GTQ', 14.5746, -90.4995
  UNION ALL SELECT @owner7, 'Apartamento Zona 13', 'Apartamento cerca del aeropuerto y principales avenidas.', 'Zona 13', 'Ciudad de Guatemala', 'GTM', 'Guatemala', 'APARTMENT', 5500, 'GTQ', 14.5885, -90.5279
  UNION ALL SELECT @owner7, 'Casa Zona 21', 'Casa económica de dos habitaciones.', 'Zona 21', 'Ciudad de Guatemala', 'GTM', 'Guatemala', 'HOUSE', 4500, 'GTQ', 14.5707, -90.5367
  UNION ALL SELECT @owner8, 'Apartamento Antigua Guatemala', 'Apartamento turístico ubicado cerca del centro de Antigua.', 'Calle de los Pasos', 'Antigua Guatemala', 'GTM', 'Guatemala', 'APARTMENT', 6000, 'GTQ', 14.5575, -90.733
  UNION ALL SELECT @owner8, 'Casa Antigua Guatemala', 'Casa colonial remodelada con patio interior.', 'Barrio La Merced', 'Antigua Guatemala', 'GTM', 'Guatemala', 'HOUSE', 9000, 'GTQ', 14.559, -90.731
  UNION ALL SELECT @owner9, 'Apartamento Quetzaltenango', 'Apartamento moderno cerca del centro de Xela.', 'Zona 3', 'Quetzaltenango', 'GTM', 'Guatemala', 'APARTMENT', 4200, 'GTQ', 14.8347, -91.518
  UNION ALL SELECT @owner9, 'Casa Quetzaltenango', 'Casa familiar de tres habitaciones.', 'Zona 8', 'Quetzaltenango', 'GTM', 'Guatemala', 'HOUSE', 5800, 'GTQ', 14.8502, -91.5207
  UNION ALL SELECT @owner10, 'Apartamento Villa Nueva', 'Apartamento económico de dos habitaciones.', 'Zona 4', 'Villa Nueva', 'GTM', 'Guatemala', 'APARTMENT', 3500, 'GTQ', 14.5269, -90.5876
  UNION ALL SELECT @owner10, 'Casa Villa Nueva', 'Casa familiar con estacionamiento y patio.', 'Zona 5', 'Villa Nueva', 'GTM', 'Guatemala', 'HOUSE', 5200, 'GTQ', 14.5253, -90.5967
) AS rental_seed
WHERE NOT EXISTS (
  SELECT 1
  FROM properties existing
  WHERE existing.landlordId = rental_seed.landlordId
    AND existing.title = rental_seed.title
);
