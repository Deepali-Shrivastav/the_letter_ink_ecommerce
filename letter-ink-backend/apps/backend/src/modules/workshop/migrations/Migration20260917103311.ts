import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260917103311 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "workshop" ("id" text not null, "title" text not null, "handle" text not null, "description" text null, "date" text null, "time" text null, "venue" text null, "level" text null, "price" integer not null default 0, "spots_text" text null, "kit_info" text null, "images" jsonb null, "status" text not null default 'published', "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "workshop_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_workshop_deleted_at" ON "workshop" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "workshop" cascade;`);
  }

}
