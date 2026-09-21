import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260920201115 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "customization_combination" ("id" text not null, "product_id" text not null, "status" text check ("status" in ('active', 'disabled')) not null default 'active', "preview_image_url" text null, "price_adjustment" integer null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "customization_combination_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_customization_combination_deleted_at" ON "customization_combination" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "customization_option" ("id" text not null, "product_id" text not null, "title" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "customization_option_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_customization_option_deleted_at" ON "customization_option" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "customization_option_value" ("id" text not null, "value" text not null, "option_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "customization_option_value_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_customization_option_value_option_id" ON "customization_option_value" ("option_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_customization_option_value_deleted_at" ON "customization_option_value" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "customization_combination_customization_option_values" ("customization_combination_id" text not null, "customization_option_value_id" text not null, constraint "customization_combination_customization_option_values_pkey" primary key ("customization_combination_id", "customization_option_value_id"));`);

    this.addSql(`alter table if exists "customization_option_value" add constraint "customization_option_value_option_id_foreign" foreign key ("option_id") references "customization_option" ("id") on update cascade;`);

    this.addSql(`alter table if exists "customization_combination_customization_option_values" add constraint "customization_combination_customization_option_v_bf908_foreign" foreign key ("customization_combination_id") references "customization_combination" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table if exists "customization_combination_customization_option_values" add constraint "customization_combination_customization_option_v_d7cfe_foreign" foreign key ("customization_option_value_id") references "customization_option_value" ("id") on update cascade on delete cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "customization_combination_customization_option_values" drop constraint if exists "customization_combination_customization_option_v_bf908_foreign";`);

    this.addSql(`alter table if exists "customization_option_value" drop constraint if exists "customization_option_value_option_id_foreign";`);

    this.addSql(`alter table if exists "customization_combination_customization_option_values" drop constraint if exists "customization_combination_customization_option_v_d7cfe_foreign";`);

    this.addSql(`drop table if exists "customization_combination" cascade;`);

    this.addSql(`drop table if exists "customization_option" cascade;`);

    this.addSql(`drop table if exists "customization_option_value" cascade;`);

    this.addSql(`drop table if exists "customization_combination_customization_option_values" cascade;`);
  }

}
