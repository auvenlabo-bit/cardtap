ALTER TABLE `cards` ADD `current_projects` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `cards` ADD `past_projects` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `cards` ADD `custom_color` text DEFAULT '#7c3aed' NOT NULL;