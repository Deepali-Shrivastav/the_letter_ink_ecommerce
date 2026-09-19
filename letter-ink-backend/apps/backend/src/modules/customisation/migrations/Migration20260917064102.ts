import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260917064102 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "customisation_compatibility_rule" ("id" text not null, "source_option_id" text not null, "target_option_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "customisation_compatibility_rule_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_customisation_compatibility_rule_deleted_at" ON "customisation_compatibility_rule" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "customisation_product_group" ("id" text not null, "product_id" text not null, "group_id" text not null, "display_order" integer not null default 0, "is_required" boolean not null default false, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "customisation_product_group_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_customisation_product_group_deleted_at" ON "customisation_product_group" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`alter table if exists "customisation_option" drop constraint if exists "customisation_option_group_id_foreign";`);

    this.addSql(`drop index if exists "IDX_customisation_option_group_id";`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "customisation_compatibility_rule" cascade;`);

    this.addSql(`drop table if exists "customisation_product_group" cascade;`);

    this.addSql(`alter table if exists "customisation_option" add constraint "customisation_option_group_id_foreign" foreign key ("group_id") references "customisation_group" ("id") on update cascade;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_customisation_option_group_id" ON "customisation_option" ("group_id") WHERE deleted_at IS NULL;`);
  }

}
