CREATE TABLE IF NOT EXISTS "app_branding_settings" (
	"id" text PRIMARY KEY DEFAULT 'global' NOT NULL,
	"primary_color_hex" text,
	"logo_content_base64" text,
	"logo_file_name" text,
	"logo_mime_type" text,
	"logo_file_size" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "app_branding_settings" ADD COLUMN IF NOT EXISTS "logo_content_base64" text;
--> statement-breakpoint
ALTER TABLE "app_branding_settings" DROP COLUMN IF EXISTS "logo_file_key";
