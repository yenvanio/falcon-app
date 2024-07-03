
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";

COMMENT ON SCHEMA "public" IS 'standard public schema';

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

CREATE OR REPLACE FUNCTION "public"."AddToWaitlist"("user_email" "text") RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$BEGIN
  INSERT INTO waitlist (email, created_at) VALUES (user_email, NOW());
END;$$;

ALTER FUNCTION "public"."AddToWaitlist"("user_email" "text") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."CreateEvent"("event_name" "text", "event_date" timestamp with time zone, "event_location" "text", "event_notes" "text", "event_created_by_uuid" "uuid", "event_itinerary_id" integer) RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$BEGIN
  INSERT INTO events (name, date, location, notes, created_by, itinerary_id) VALUES (event_name, event_date, event_location, event_notes, event_created_by_uuid, event_itinerary_id);
END;$$;

ALTER FUNCTION "public"."CreateEvent"("event_name" "text", "event_date" timestamp with time zone, "event_location" "text", "event_notes" "text", "event_created_by_uuid" "uuid", "event_itinerary_id" integer) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."CreateItinerary"("owner_uuid" "uuid", "itinerary_start_date" timestamp without time zone, "itinerary_end_date" timestamp without time zone, "itinerary_name" "text", "itinerary_notes" "text") RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$DECLARE
  new_itinerary_id INTEGER;
BEGIN
  -- Insert into the itineraries table and get the new itinerary_id
  INSERT INTO itineraries (name, start_date, end_date, notes, owner_uuid) VALUES (itinerary_name, itinerary_start_date, itinerary_end_date, itinerary_notes, owner_uuid)
  RETURNING id INTO new_itinerary_id;

  -- Insert into the itinerary_users table using the new itinerary_id
  INSERT INTO itinerary_users (itinerary_id, role, user_uuid)
  VALUES (new_itinerary_id, 'OWNER', owner_uuid);
END;$$;

ALTER FUNCTION "public"."CreateItinerary"("owner_uuid" "uuid", "itinerary_start_date" timestamp without time zone, "itinerary_end_date" timestamp without time zone, "itinerary_name" "text", "itinerary_notes" "text") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."GetEventsByItineraryId"("query_id" integer) RETURNS SETOF "record"
    LANGUAGE "sql"
    AS $$SELECT * FROM events
  WHERE itinerary_id = query_id$$;

ALTER FUNCTION "public"."GetEventsByItineraryId"("query_id" integer) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."GetItinerariesByUserUuid"("uuid" "uuid") RETURNS SETOF "record"
    LANGUAGE "sql"
    AS $$SELECT * FROM itineraries as i
  LEFT JOIN itinerary_users as u ON i.id = u.itinerary_id
  WHERE u.user_uuid = uuid;$$;

ALTER FUNCTION "public"."GetItinerariesByUserUuid"("uuid" "uuid") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."GetItineraryById"("query_id" integer) RETURNS "record"
    LANGUAGE "sql"
    AS $$SELECT * FROM itineraries AS i WHERE i.id = query_id;$$;

ALTER FUNCTION "public"."GetItineraryById"("query_id" integer) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."GetUsersByItineraryId"("query_id" integer) RETURNS SETOF "record"
    LANGUAGE "sql"
    AS $$SELECT u.id, u.email, u.phone_number, i.role FROM users AS u
LEFT JOIN itinerary_users AS i ON u.id = i.user_uuid
WHERE i.itinerary_id = query_id$$;

ALTER FUNCTION "public"."GetUsersByItineraryId"("query_id" integer) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
begin
  insert into public.users (id, first_name, last_name, email, phone_number)
  values (
    new.id, 
    new.raw_user_meta_data ->> 'first_name', 
    new.raw_user_meta_data ->> 'last_name',
    new.raw_user_meta_data ->> 'email',
    new.raw_user_meta_data ->> 'phone'
  );
  return new;
end;
$$;

ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."airports" (
    "iata_code" "text" NOT NULL,
    "country_code" "text" NOT NULL,
    "region_code" "text" NOT NULL,
    "city_name" "text" NOT NULL,
    "country_name" "text" NOT NULL,
    "latitude" "text" NOT NULL,
    "longitude" "text" NOT NULL
);

ALTER TABLE "public"."airports" OWNER TO "postgres";

COMMENT ON TABLE "public"."airports" IS 'Table of Airport';

CREATE TABLE IF NOT EXISTS "public"."events" (
    "id" bigint NOT NULL,
    "itinerary_id" bigint NOT NULL,
    "name" "text" NOT NULL,
    "date" timestamp without time zone NOT NULL,
    "latitude" numeric,
    "longitude" numeric,
    "notes" "text",
    "location" "text" NOT NULL,
    "created_by" "uuid"
);

ALTER TABLE "public"."events" OWNER TO "postgres";

COMMENT ON TABLE "public"."events" IS 'Itinerary events';

ALTER TABLE "public"."events" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."events_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."itineraries" (
    "id" bigint NOT NULL,
    "name" "text" NOT NULL,
    "start_date" timestamp without time zone NOT NULL,
    "end_date" timestamp without time zone NOT NULL,
    "notes" "text",
    "owner_uuid" "uuid" NOT NULL
);

ALTER TABLE "public"."itineraries" OWNER TO "postgres";

COMMENT ON TABLE "public"."itineraries" IS 'All Itineraries';

ALTER TABLE "public"."itineraries" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."itineraries_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."itinerary_flights" (
    "id" bigint NOT NULL,
    "itinerary_id" bigint NOT NULL,
    "flight_id" bigint NOT NULL
);

ALTER TABLE "public"."itinerary_flights" OWNER TO "postgres";

ALTER TABLE "public"."itinerary_flights" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."itinerary_flights_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."itinerary_hotels" (
    "id" bigint NOT NULL,
    "itinerary_id" bigint NOT NULL,
    "hotel_id" bigint NOT NULL
);

ALTER TABLE "public"."itinerary_hotels" OWNER TO "postgres";

ALTER TABLE "public"."itinerary_hotels" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."itinerary_hotels_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."itinerary_users" (
    "id" bigint NOT NULL,
    "itinerary_id" bigint NOT NULL,
    "user_uuid" "uuid" NOT NULL,
    "role" "text" NOT NULL
);

ALTER TABLE "public"."itinerary_users" OWNER TO "postgres";

COMMENT ON TABLE "public"."itinerary_users" IS 'Linking Users to Itineraries';

CREATE TABLE IF NOT EXISTS "public"."routes" (
    "origin_code" "text" NOT NULL,
    "destination_code" "text" NOT NULL
);

ALTER TABLE "public"."routes" OWNER TO "postgres";

COMMENT ON TABLE "public"."routes" IS 'Airport Routes';

COMMENT ON COLUMN "public"."routes"."origin_code" IS 'Airport IATA Code for the Origin Airport';

COMMENT ON COLUMN "public"."routes"."destination_code" IS 'Airport IATA Code for the Destination Airport';

ALTER TABLE "public"."itinerary_users" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."user_itineraries_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" "uuid" NOT NULL,
    "first_name" "text",
    "last_name" "text",
    "email" "text",
    "phone_number" "text",
    "avatar" "text"
);

ALTER TABLE "public"."users" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."waitlist" (
    "id" bigint NOT NULL,
    "email" "text" NOT NULL,
    "created_at" timestamp with time zone NOT NULL
);

ALTER TABLE "public"."waitlist" OWNER TO "postgres";

COMMENT ON TABLE "public"."waitlist" IS 'Waitlisted Users';

ALTER TABLE "public"."waitlist" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."waitlist_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

ALTER TABLE ONLY "public"."airports"
    ADD CONSTRAINT "airports_iata_code_key" UNIQUE ("iata_code");

ALTER TABLE ONLY "public"."airports"
    ADD CONSTRAINT "airports_pkey" PRIMARY KEY ("iata_code");

ALTER TABLE ONLY "public"."events"
    ADD CONSTRAINT "events_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."itineraries"
    ADD CONSTRAINT "itineraries_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."itinerary_flights"
    ADD CONSTRAINT "itinerary_flights_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."itinerary_hotels"
    ADD CONSTRAINT "itinerary_hotels_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."routes"
    ADD CONSTRAINT "routes_pkey" PRIMARY KEY ("origin_code");

ALTER TABLE ONLY "public"."itinerary_users"
    ADD CONSTRAINT "user_itineraries_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."waitlist"
    ADD CONSTRAINT "waitlist_email_key" UNIQUE ("email");

ALTER TABLE ONLY "public"."waitlist"
    ADD CONSTRAINT "waitlist_pkey" PRIMARY KEY ("id");

CREATE OR REPLACE TRIGGER "waitlist-email-webhook" AFTER INSERT ON "public"."waitlist" FOR EACH ROW EXECUTE FUNCTION "supabase_functions"."http_request"('https://hufmgntltpmeoisjbcba.supabase.co/functions/v1/send-waitlist-email', 'POST', '{"Content-type":"application/json","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1Zm1nbnRsdHBtZW9pc2piY2JhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxODgyNzg5MiwiZXhwIjoyMDM0NDAzODkyfQ.BvqAJm6KN_qOQGSCMn71xEwwYYJkAQEX2tjYzcg9wP4"}', '{}', '1000');

ALTER TABLE ONLY "public"."events"
    ADD CONSTRAINT "events_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id");

ALTER TABLE ONLY "public"."events"
    ADD CONSTRAINT "events_itinerary_id_fkey" FOREIGN KEY ("itinerary_id") REFERENCES "public"."itineraries"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."itineraries"
    ADD CONSTRAINT "itineraries_owner_uuid_fkey" FOREIGN KEY ("owner_uuid") REFERENCES "public"."users"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."itinerary_users"
    ADD CONSTRAINT "itinerary_users_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "public"."users"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."itinerary_users"
    ADD CONSTRAINT "user_itineraries_itinerary_id_fkey" FOREIGN KEY ("itinerary_id") REFERENCES "public"."itineraries"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."itinerary_users"
    ADD CONSTRAINT "user_itineraries_itinerary_id_fkey1" FOREIGN KEY ("itinerary_id") REFERENCES "public"."itineraries"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;

CREATE POLICY "Enable full access for users based on user_id" ON "public"."itineraries" USING ((( SELECT "auth"."uid"() AS "uid") = "owner_uuid"));

CREATE POLICY "Enable full access for users based on user_id" ON "public"."itinerary_users" USING ((( SELECT "auth"."uid"() AS "uid") = "user_uuid"));

CREATE POLICY "Enable insert for authenticated users only" ON "public"."events" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."itineraries" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."itinerary_users" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable read access for all users" ON "public"."events" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."itineraries" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."itinerary_users" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."users" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."waitlist" USING (true);

ALTER TABLE "public"."airports" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."events" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."itineraries" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."itinerary_flights" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."itinerary_hotels" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."itinerary_users" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."routes" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."waitlist" ENABLE ROW LEVEL SECURITY;

ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";

ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."events";

ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."itineraries";

GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON FUNCTION "public"."AddToWaitlist"("user_email" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."AddToWaitlist"("user_email" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."AddToWaitlist"("user_email" "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."CreateEvent"("event_name" "text", "event_date" timestamp with time zone, "event_location" "text", "event_notes" "text", "event_created_by_uuid" "uuid", "event_itinerary_id" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."CreateEvent"("event_name" "text", "event_date" timestamp with time zone, "event_location" "text", "event_notes" "text", "event_created_by_uuid" "uuid", "event_itinerary_id" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."CreateEvent"("event_name" "text", "event_date" timestamp with time zone, "event_location" "text", "event_notes" "text", "event_created_by_uuid" "uuid", "event_itinerary_id" integer) TO "service_role";

GRANT ALL ON FUNCTION "public"."CreateItinerary"("owner_uuid" "uuid", "itinerary_start_date" timestamp without time zone, "itinerary_end_date" timestamp without time zone, "itinerary_name" "text", "itinerary_notes" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."CreateItinerary"("owner_uuid" "uuid", "itinerary_start_date" timestamp without time zone, "itinerary_end_date" timestamp without time zone, "itinerary_name" "text", "itinerary_notes" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."CreateItinerary"("owner_uuid" "uuid", "itinerary_start_date" timestamp without time zone, "itinerary_end_date" timestamp without time zone, "itinerary_name" "text", "itinerary_notes" "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."GetEventsByItineraryId"("query_id" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."GetEventsByItineraryId"("query_id" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."GetEventsByItineraryId"("query_id" integer) TO "service_role";

GRANT ALL ON FUNCTION "public"."GetItinerariesByUserUuid"("uuid" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."GetItinerariesByUserUuid"("uuid" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."GetItinerariesByUserUuid"("uuid" "uuid") TO "service_role";

GRANT ALL ON FUNCTION "public"."GetItineraryById"("query_id" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."GetItineraryById"("query_id" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."GetItineraryById"("query_id" integer) TO "service_role";

GRANT ALL ON FUNCTION "public"."GetUsersByItineraryId"("query_id" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."GetUsersByItineraryId"("query_id" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."GetUsersByItineraryId"("query_id" integer) TO "service_role";

GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";

GRANT ALL ON TABLE "public"."airports" TO "anon";
GRANT ALL ON TABLE "public"."airports" TO "authenticated";
GRANT ALL ON TABLE "public"."airports" TO "service_role";

GRANT ALL ON TABLE "public"."events" TO "anon";
GRANT ALL ON TABLE "public"."events" TO "authenticated";
GRANT ALL ON TABLE "public"."events" TO "service_role";

GRANT ALL ON SEQUENCE "public"."events_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."events_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."events_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."itineraries" TO "anon";
GRANT ALL ON TABLE "public"."itineraries" TO "authenticated";
GRANT ALL ON TABLE "public"."itineraries" TO "service_role";

GRANT ALL ON SEQUENCE "public"."itineraries_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."itineraries_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."itineraries_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."itinerary_flights" TO "anon";
GRANT ALL ON TABLE "public"."itinerary_flights" TO "authenticated";
GRANT ALL ON TABLE "public"."itinerary_flights" TO "service_role";

GRANT ALL ON SEQUENCE "public"."itinerary_flights_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."itinerary_flights_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."itinerary_flights_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."itinerary_hotels" TO "anon";
GRANT ALL ON TABLE "public"."itinerary_hotels" TO "authenticated";
GRANT ALL ON TABLE "public"."itinerary_hotels" TO "service_role";

GRANT ALL ON SEQUENCE "public"."itinerary_hotels_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."itinerary_hotels_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."itinerary_hotels_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."itinerary_users" TO "anon";
GRANT ALL ON TABLE "public"."itinerary_users" TO "authenticated";
GRANT ALL ON TABLE "public"."itinerary_users" TO "service_role";

GRANT ALL ON TABLE "public"."routes" TO "anon";
GRANT ALL ON TABLE "public"."routes" TO "authenticated";
GRANT ALL ON TABLE "public"."routes" TO "service_role";

GRANT ALL ON SEQUENCE "public"."user_itineraries_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."user_itineraries_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."user_itineraries_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";

GRANT ALL ON TABLE "public"."waitlist" TO "anon";
GRANT ALL ON TABLE "public"."waitlist" TO "authenticated";
GRANT ALL ON TABLE "public"."waitlist" TO "service_role";

GRANT ALL ON SEQUENCE "public"."waitlist_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."waitlist_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."waitlist_id_seq" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;
