import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260922090445 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "post" ("id" text not null, "title" text not null, "handle" text not null, "description" text null, "content" text null, "author" text null, "category" text null, "read_time" text null, "publish_date" text null, "images" jsonb null, "status" text not null default 'published', "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "post_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_post_deleted_at" ON "post" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "post" cascade;`);
  }

}
