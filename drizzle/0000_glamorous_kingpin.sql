CREATE TABLE `cards` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`name_kana` text DEFAULT '' NOT NULL,
	`role` text DEFAULT '' NOT NULL,
	`company` text DEFAULT '' NOT NULL,
	`bio` text DEFAULT '' NOT NULL,
	`email` text DEFAULT '' NOT NULL,
	`phone` text DEFAULT '' NOT NULL,
	`website` text DEFAULT '' NOT NULL,
	`social` text DEFAULT '' NOT NULL,
	`theme` text DEFAULT 'cobalt' NOT NULL,
	`created_at` integer NOT NULL
);
