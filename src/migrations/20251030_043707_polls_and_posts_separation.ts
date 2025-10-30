import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
--    CREATE TYPE "public"."enum_polls_status" AS ENUM('draft', 'published');
--   CREATE TYPE "public"."enum__polls_v_version_status" AS ENUM('draft', 'published');
  ALTER TYPE "public"."enum_pages_blocks_archive_relation_to" ADD VALUE 'polls' BEFORE 'posts';
  ALTER TYPE "public"."enum__pages_v_blocks_archive_relation_to" ADD VALUE 'polls' BEFORE 'posts';
  CREATE TABLE "polls_populated_authors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar
  );

  CREATE TABLE "polls" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"hero_image_id" integer,
  	"content" jsonb,
  	"pdf_id" integer,
  	"meta_title" varchar,
  	"meta_image_id" integer,
  	"meta_description" varchar,
  	"published_at" timestamp(3) with time zone,
  	"slug" varchar,
  	"slug_lock" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_polls_status" DEFAULT 'draft'
  );

  CREATE TABLE "polls_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"polls_id" integer,
  	"categories_id" integer,
  	"users_id" integer
  );

  CREATE TABLE "_polls_v_version_populated_authors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"name" varchar
  );

  CREATE TABLE "_polls_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_hero_image_id" integer,
  	"version_content" jsonb,
  	"version_pdf_id" integer,
  	"version_meta_title" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_description" varchar,
  	"version_published_at" timestamp(3) with time zone,
  	"version_slug" varchar,
  	"version_slug_lock" boolean DEFAULT true,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__polls_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );

  CREATE TABLE "_polls_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"polls_id" integer,
  	"categories_id" integer,
  	"users_id" integer
  );

  ALTER TABLE "posts" DROP CONSTRAINT "posts_pdf_id_pdfs_id_fk";

  ALTER TABLE "_posts_v" DROP CONSTRAINT "_posts_v_version_pdf_id_pdfs_id_fk";

  ALTER TABLE "pdfs" DROP CONSTRAINT "pdfs_category_id_categories_id_fk";

  DROP INDEX "posts_pdf_idx";
  DROP INDEX "_posts_v_version_version_pdf_idx";
  DROP INDEX "pdfs_category_idx";
  ALTER TABLE "pages_blocks_archive" ALTER COLUMN "relation_to" SET DEFAULT 'polls';
  ALTER TABLE "_pages_v_blocks_archive" ALTER COLUMN "relation_to" SET DEFAULT 'polls';
  ALTER TABLE "pages_rels" ADD COLUMN "polls_id" integer;
  ALTER TABLE "_pages_v_rels" ADD COLUMN "polls_id" integer;
  ALTER TABLE "pdfs" ADD COLUMN "caption" jsonb;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "polls_id" integer;
  ALTER TABLE "polls_populated_authors" ADD CONSTRAINT "polls_populated_authors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."polls"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "polls" ADD CONSTRAINT "polls_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "polls" ADD CONSTRAINT "polls_pdf_id_pdfs_id_fk" FOREIGN KEY ("pdf_id") REFERENCES "public"."pdfs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "polls" ADD CONSTRAINT "polls_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "polls_rels" ADD CONSTRAINT "polls_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."polls"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "polls_rels" ADD CONSTRAINT "polls_rels_polls_fk" FOREIGN KEY ("polls_id") REFERENCES "public"."polls"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "polls_rels" ADD CONSTRAINT "polls_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "polls_rels" ADD CONSTRAINT "polls_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_polls_v_version_populated_authors" ADD CONSTRAINT "_polls_v_version_populated_authors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_polls_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_polls_v" ADD CONSTRAINT "_polls_v_parent_id_polls_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."polls"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_polls_v" ADD CONSTRAINT "_polls_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_polls_v" ADD CONSTRAINT "_polls_v_version_pdf_id_pdfs_id_fk" FOREIGN KEY ("version_pdf_id") REFERENCES "public"."pdfs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_polls_v" ADD CONSTRAINT "_polls_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_polls_v_rels" ADD CONSTRAINT "_polls_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_polls_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_polls_v_rels" ADD CONSTRAINT "_polls_v_rels_polls_fk" FOREIGN KEY ("polls_id") REFERENCES "public"."polls"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_polls_v_rels" ADD CONSTRAINT "_polls_v_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_polls_v_rels" ADD CONSTRAINT "_polls_v_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "polls_populated_authors_order_idx" ON "polls_populated_authors" USING btree ("_order");
  CREATE INDEX "polls_populated_authors_parent_id_idx" ON "polls_populated_authors" USING btree ("_parent_id");
  CREATE INDEX "polls_hero_image_idx" ON "polls" USING btree ("hero_image_id");
  CREATE INDEX "polls_pdf_idx" ON "polls" USING btree ("pdf_id");
  CREATE INDEX "polls_meta_meta_image_idx" ON "polls" USING btree ("meta_image_id");
  CREATE INDEX "polls_slug_idx" ON "polls" USING btree ("slug");
  CREATE INDEX "polls_updated_at_idx" ON "polls" USING btree ("updated_at");
  CREATE INDEX "polls_created_at_idx" ON "polls" USING btree ("created_at");
  CREATE INDEX "polls__status_idx" ON "polls" USING btree ("_status");
  CREATE INDEX "polls_rels_order_idx" ON "polls_rels" USING btree ("order");
  CREATE INDEX "polls_rels_parent_idx" ON "polls_rels" USING btree ("parent_id");
  CREATE INDEX "polls_rels_path_idx" ON "polls_rels" USING btree ("path");
  CREATE INDEX "polls_rels_polls_id_idx" ON "polls_rels" USING btree ("polls_id");
  CREATE INDEX "polls_rels_categories_id_idx" ON "polls_rels" USING btree ("categories_id");
  CREATE INDEX "polls_rels_users_id_idx" ON "polls_rels" USING btree ("users_id");
  CREATE INDEX "_polls_v_version_populated_authors_order_idx" ON "_polls_v_version_populated_authors" USING btree ("_order");
  CREATE INDEX "_polls_v_version_populated_authors_parent_id_idx" ON "_polls_v_version_populated_authors" USING btree ("_parent_id");
  CREATE INDEX "_polls_v_parent_idx" ON "_polls_v" USING btree ("parent_id");
  CREATE INDEX "_polls_v_version_version_hero_image_idx" ON "_polls_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_polls_v_version_version_pdf_idx" ON "_polls_v" USING btree ("version_pdf_id");
  CREATE INDEX "_polls_v_version_meta_version_meta_image_idx" ON "_polls_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_polls_v_version_version_slug_idx" ON "_polls_v" USING btree ("version_slug");
  CREATE INDEX "_polls_v_version_version_updated_at_idx" ON "_polls_v" USING btree ("version_updated_at");
  CREATE INDEX "_polls_v_version_version_created_at_idx" ON "_polls_v" USING btree ("version_created_at");
  CREATE INDEX "_polls_v_version_version__status_idx" ON "_polls_v" USING btree ("version__status");
  CREATE INDEX "_polls_v_created_at_idx" ON "_polls_v" USING btree ("created_at");
  CREATE INDEX "_polls_v_updated_at_idx" ON "_polls_v" USING btree ("updated_at");
  CREATE INDEX "_polls_v_latest_idx" ON "_polls_v" USING btree ("latest");
  CREATE INDEX "_polls_v_autosave_idx" ON "_polls_v" USING btree ("autosave");
  CREATE INDEX "_polls_v_rels_order_idx" ON "_polls_v_rels" USING btree ("order");
  CREATE INDEX "_polls_v_rels_parent_idx" ON "_polls_v_rels" USING btree ("parent_id");
  CREATE INDEX "_polls_v_rels_path_idx" ON "_polls_v_rels" USING btree ("path");
  CREATE INDEX "_polls_v_rels_polls_id_idx" ON "_polls_v_rels" USING btree ("polls_id");
  CREATE INDEX "_polls_v_rels_categories_id_idx" ON "_polls_v_rels" USING btree ("categories_id");
  CREATE INDEX "_polls_v_rels_users_id_idx" ON "_polls_v_rels" USING btree ("users_id");
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_polls_fk" FOREIGN KEY ("polls_id") REFERENCES "public"."polls"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_polls_fk" FOREIGN KEY ("polls_id") REFERENCES "public"."polls"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_polls_fk" FOREIGN KEY ("polls_id") REFERENCES "public"."polls"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_rels_polls_id_idx" ON "pages_rels" USING btree ("polls_id");
  CREATE INDEX "_pages_v_rels_polls_id_idx" ON "_pages_v_rels" USING btree ("polls_id");
  CREATE INDEX "payload_locked_documents_rels_polls_id_idx" ON "payload_locked_documents_rels" USING btree ("polls_id");
  ALTER TABLE "posts" DROP COLUMN "pdf_id";
  ALTER TABLE "_posts_v" DROP COLUMN "version_pdf_id";
  ALTER TABLE "media" DROP COLUMN "alt";
  ALTER TABLE "pdfs" DROP COLUMN "title";
  ALTER TABLE "pdfs" DROP COLUMN "description";
  ALTER TABLE "pdfs" DROP COLUMN "category_id";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "polls_populated_authors" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "polls" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "polls_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_polls_v_version_populated_authors" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_polls_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_polls_v_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "polls_populated_authors" CASCADE;
  DROP TABLE "polls" CASCADE;
  DROP TABLE "polls_rels" CASCADE;
  DROP TABLE "_polls_v_version_populated_authors" CASCADE;
  DROP TABLE "_polls_v" CASCADE;
  DROP TABLE "_polls_v_rels" CASCADE;
  ALTER TABLE "pages_rels" DROP CONSTRAINT "pages_rels_polls_fk";

  ALTER TABLE "_pages_v_rels" DROP CONSTRAINT "_pages_v_rels_polls_fk";

  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_polls_fk";

  ALTER TABLE "pages_blocks_archive" ALTER COLUMN "relation_to" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_archive" ALTER COLUMN "relation_to" SET DEFAULT 'posts'::text;
  DROP TYPE "public"."enum_pages_blocks_archive_relation_to";
  CREATE TYPE "public"."enum_pages_blocks_archive_relation_to" AS ENUM('posts');
  ALTER TABLE "pages_blocks_archive" ALTER COLUMN "relation_to" SET DEFAULT 'posts'::"public"."enum_pages_blocks_archive_relation_to";
  ALTER TABLE "pages_blocks_archive" ALTER COLUMN "relation_to" SET DATA TYPE "public"."enum_pages_blocks_archive_relation_to" USING "relation_to"::"public"."enum_pages_blocks_archive_relation_to";
  ALTER TABLE "_pages_v_blocks_archive" ALTER COLUMN "relation_to" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_archive" ALTER COLUMN "relation_to" SET DEFAULT 'posts'::text;
  DROP TYPE "public"."enum__pages_v_blocks_archive_relation_to";
  CREATE TYPE "public"."enum__pages_v_blocks_archive_relation_to" AS ENUM('posts');
  ALTER TABLE "_pages_v_blocks_archive" ALTER COLUMN "relation_to" SET DEFAULT 'posts'::"public"."enum__pages_v_blocks_archive_relation_to";
  ALTER TABLE "_pages_v_blocks_archive" ALTER COLUMN "relation_to" SET DATA TYPE "public"."enum__pages_v_blocks_archive_relation_to" USING "relation_to"::"public"."enum__pages_v_blocks_archive_relation_to";
  DROP INDEX "pages_rels_polls_id_idx";
  DROP INDEX "_pages_v_rels_polls_id_idx";
  DROP INDEX "payload_locked_documents_rels_polls_id_idx";
  ALTER TABLE "posts" ADD COLUMN "pdf_id" integer;
  ALTER TABLE "_posts_v" ADD COLUMN "version_pdf_id" integer;
  ALTER TABLE "media" ADD COLUMN "alt" varchar;
  ALTER TABLE "pdfs" ADD COLUMN "title" varchar NOT NULL;
  ALTER TABLE "pdfs" ADD COLUMN "description" varchar;
  ALTER TABLE "pdfs" ADD COLUMN "category_id" integer;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_pdf_id_pdfs_id_fk" FOREIGN KEY ("pdf_id") REFERENCES "public"."pdfs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_pdf_id_pdfs_id_fk" FOREIGN KEY ("version_pdf_id") REFERENCES "public"."pdfs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pdfs" ADD CONSTRAINT "pdfs_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "posts_pdf_idx" ON "posts" USING btree ("pdf_id");
  CREATE INDEX "_posts_v_version_version_pdf_idx" ON "_posts_v" USING btree ("version_pdf_id");
  CREATE INDEX "pdfs_category_idx" ON "pdfs" USING btree ("category_id");
  ALTER TABLE "pages_rels" DROP COLUMN "polls_id";
  ALTER TABLE "_pages_v_rels" DROP COLUMN "polls_id";
  ALTER TABLE "pdfs" DROP COLUMN "caption";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "polls_id";
  DROP TYPE "public"."enum_polls_status";
  DROP TYPE "public"."enum__polls_v_version_status";`)
}
