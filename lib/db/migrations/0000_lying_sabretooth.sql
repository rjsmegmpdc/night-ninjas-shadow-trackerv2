CREATE TABLE `activities` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`source` text NOT NULL,
	`source_id` text NOT NULL,
	`name` text,
	`type` text NOT NULL,
	`sport_type` text,
	`start_date_utc` text NOT NULL,
	`start_date_local` text NOT NULL,
	`distance_m` real,
	`moving_time_s` integer,
	`elapsed_time_s` integer,
	`elevation_gain_m` real,
	`avg_speed_ms` real,
	`max_speed_ms` real,
	`avg_hr` real,
	`max_hr` real,
	`avg_cadence` real,
	`suffer_score` integer,
	`kudos` integer,
	`raw_json` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `activities_source_idx` ON `activities` (`source`,`source_id`);--> statement-breakpoint
CREATE INDEX `activities_date_idx` ON `activities` (`start_date_local`);--> statement-breakpoint
CREATE INDEX `activities_type_idx` ON `activities` (`type`);--> statement-breakpoint
CREATE TABLE `journal` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`date` text NOT NULL,
	`sleep_quality` integer,
	`sleep_hours` real,
	`work_stress` integer,
	`perceived_effort` integer,
	`energy` integer,
	`hrv_ms` real,
	`resting_hr` integer,
	`body_battery` integer,
	`training_readiness` integer,
	`hrv_source` text,
	`notes` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `journal_date_unique` ON `journal` (`date`);--> statement-breakpoint
CREATE TABLE `plans` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`dojo` text NOT NULL,
	`goal_distance_km` real NOT NULL,
	`goal_time_s` integer NOT NULL,
	`level` text NOT NULL,
	`weekly_volume_cap_km` real,
	`long_run_cap_km` real,
	`pace_zones_json` text NOT NULL,
	`custom_week_json` text,
	`start_date` text NOT NULL,
	`is_active` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `settings` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `sync_log` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`source` text NOT NULL,
	`started_at` integer DEFAULT (unixepoch()) NOT NULL,
	`finished_at` integer,
	`activities_added` integer DEFAULT 0,
	`activities_updated` integer DEFAULT 0,
	`status` text NOT NULL,
	`error_message` text
);
