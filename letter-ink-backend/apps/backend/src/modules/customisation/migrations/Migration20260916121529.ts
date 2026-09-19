import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260916121529 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "customisation_group" ("id" text not null, "name" text not null, "type" text check ("type" in ('swatch', 'chip', 'text')) not null, "display_order" integer not null default 0, "is_required" boolean not null default false, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "customisation_group_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_customisation_group_deleted_at" ON "customisation_group" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "customisation_option" ("id" text not null, "label" text not null, "value" text not null, "color_hex" text null, "is_light_color" boolean not null default false, "display_order" integer not null default 0, "is_available" boolean not null default true, "group_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "customisation_option_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_customisation_option_group_id" ON "customisation_option" ("group_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_customisation_option_deleted_at" ON "customisation_option" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "customisation_text_field" ("id" text not null, "product_id" text not null, "label" text not null, "placeholder" text not null, "max_chars" integer not null default 120, "is_required" boolean not null default false, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "customisation_text_field_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_customisation_text_field_deleted_at" ON "customisation_text_field" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`alter table if exists "customisation_option" add constraint "customisation_option_group_id_foreign" foreign key ("group_id") references "customisation_group" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "customisation_option" drop constraint if exists "customisation_option_group_id_foreign";`);

    this.addSql(`drop table if exists "customisation_group" cascade;`);

    this.addSql(`drop table if exists "customisation_option" cascade;`);

    this.addSql(`drop table if exists "customisation_text_field" cascade;`);
  }

}
