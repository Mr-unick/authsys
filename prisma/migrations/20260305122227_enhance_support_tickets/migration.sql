-- CreateTable
CREATE TABLE `business` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL,
    `business_name` VARCHAR(191) NOT NULL,
    `gst_number` VARCHAR(191) NOT NULL,
    `pan_number` VARCHAR(191) NOT NULL,
    `business_address` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NOT NULL,
    `pin_code` VARCHAR(191) NOT NULL,
    `contact_number` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `website` VARCHAR(191) NULL,
    `owner_name` VARCHAR(191) NOT NULL,
    `owner_contact` VARCHAR(191) NOT NULL,
    `owner_email` VARCHAR(191) NOT NULL,
    `business_description` TEXT NULL,
    `deleted_at` DATETIME(3) NULL,
    `subscription_status` VARCHAR(191) NULL DEFAULT 'INACTIVE',
    `subscription_plan` VARCHAR(191) NULL DEFAULT 'BASIC',
    `trial_expiry` TIMESTAMP(0) NULL,
    `is_on_trial` BOOLEAN NOT NULL DEFAULT false,
    `max_branches` INTEGER NOT NULL DEFAULT 1,
    `max_users_per_branch` INTEGER NOT NULL DEFAULT 10,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `business_feature` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `business_id` INTEGER NOT NULL,
    `feature_key` VARCHAR(100) NOT NULL,
    `is_enabled` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `business_feature_business_id_feature_key_key`(`business_id`, `feature_key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,
    `buisnesId` INTEGER NULL,
    `branchId` INTEGER NULL,
    `roleId` INTEGER NULL,
    `password` VARCHAR(191) NOT NULL,
    `is_branch_admin` BOOLEAN NOT NULL DEFAULT false,
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    INDEX `users_buisnesId_fkey`(`buisnesId`),
    INDEX `users_roleId_fkey`(`roleId`),
    INDEX `users_branchId_fkey`(`branchId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `leads` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `lead_source` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `stageId` INTEGER NULL,
    `businessId` INTEGER NULL,
    `branchId` INTEGER NULL,
    `address` VARCHAR(191) NULL,
    `status` VARCHAR(191) NULL DEFAULT 'active',
    `second_phone` VARCHAR(191) NULL,
    `city` VARCHAR(191) NULL,
    `state` VARCHAR(191) NULL,
    `country` VARCHAR(191) NULL DEFAULT 'india',
    `notes` TEXT NULL,
    `pincode` VARCHAR(191) NULL,
    `deleted_at` DATETIME(3) NULL,
    `next_follow_up` DATETIME(3) NULL,

    INDEX `leads_businessId_fkey`(`businessId`),
    INDEX `leads_stageId_fkey`(`stageId`),
    INDEX `leads_branchId_fkey`(`branchId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lead_users` (
    `lead_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,

    INDEX `lead_users_user_id_fkey`(`user_id`),
    PRIMARY KEY (`lead_id`, `user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `roles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,
    `buisnesId` INTEGER NULL,
    `branchId` INTEGER NULL,
    `deleted_at` DATETIME(3) NULL,

    INDEX `roles_branchId_fkey`(`branchId`),
    INDEX `roles_buisnesId_fkey`(`buisnesId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `permissions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `permission` VARCHAR(191) NOT NULL,
    `action` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `policyId` INTEGER NULL,
    `deleted_at` DATETIME(3) NULL,

    INDEX `permissions_policyId_fkey`(`policyId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `role_has_permissions` (
    `role_id` INTEGER NOT NULL,
    `permission_id` INTEGER NOT NULL,

    INDEX `role_has_permissions_permission_id_fkey`(`permission_id`),
    PRIMARY KEY (`role_id`, `permission_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `policy` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `branch` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `buisnessId` INTEGER NULL,
    `email` VARCHAR(191) NOT NULL,
    `branch_code` VARCHAR(191) NOT NULL,
    `number` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NOT NULL,
    `district` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `pincode` VARCHAR(191) NOT NULL,
    `discription` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,
    `deleted_at` DATETIME(3) NULL,

    INDEX `branch_buisnessId_fkey`(`buisnessId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `area_of_operations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `region_code` VARCHAR(191) NULL,
    `business_id` INTEGER NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,
    `deleted_at` DATETIME(3) NULL,
    `address` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `number` VARCHAR(191) NULL,

    INDEX `area_of_operations_business_id_fkey`(`business_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lead_stages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `stage_name` VARCHAR(191) NOT NULL,
    `colour` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,
    `buisnessId` INTEGER NULL,
    `branchId` INTEGER NULL,
    `discription` VARCHAR(191) NULL,
    `deleted_at` DATETIME(3) NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `stage_type` VARCHAR(191) NOT NULL DEFAULT 'ONGOING',

    INDEX `lead_stages_buisnessId_fkey`(`buisnessId`),
    INDEX `lead_stages_branchId_fkey`(`branchId`),
    UNIQUE INDEX `lead_stages_stage_name_buisnessId_branchId_key`(`stage_name`, `buisnessId`, `branchId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `status_change_history` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `changed_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `reason` VARCHAR(191) NULL,
    `stageId` INTEGER NULL,
    `lead_id` INTEGER NULL,
    `changed_by` INTEGER NULL,
    `deleted_at` DATETIME(3) NULL,

    INDEX `status_change_history_changed_by_fkey`(`changed_by`),
    INDEX `status_change_history_lead_id_fkey`(`lead_id`),
    INDEX `status_change_history_stageId_fkey`(`stageId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `comment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `comment` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `leadId` INTEGER NULL,
    `userId` INTEGER NULL,
    `type` VARCHAR(191) NULL,
    `deleted_at` DATETIME(3) NULL,
    `url` VARCHAR(1000) NULL,

    INDEX `comment_leadId_fkey`(`leadId`),
    INDEX `comment_userId_fkey`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `activity` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userId` INTEGER NULL,
    `super_admin_id` INTEGER NULL,
    `leadId` INTEGER NULL,
    `deleted_at` DATETIME(3) NULL,

    INDEX `activity_leadId_fkey`(`leadId`),
    INDEX `activity_userId_fkey`(`userId`),
    INDEX `activity_super_admin_id_idx`(`super_admin_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `login_logout_logs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `action` VARCHAR(191) NOT NULL,
    `timestamp` DATETIME(3) NOT NULL,
    `ip_address` VARCHAR(191) NOT NULL,
    `user_agent` VARCHAR(191) NOT NULL,
    `userId` INTEGER NULL,
    `deleted_at` DATETIME(3) NULL,

    INDEX `login_logout_logs_userId_fkey`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notifications` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `message` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'unread',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `userId` INTEGER NULL,
    `url` VARCHAR(191) NULL,

    INDEX `notifications_userId_fkey`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `super_admin` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `role_id` INTEGER NULL,

    UNIQUE INDEX `super_admin_email_key`(`email`),
    INDEX `super_admin_role_id_idx`(`role_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `buisness_admin` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `buisness_admin_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `push_subscriptions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `endpoint` VARCHAR(500) NOT NULL,
    `p256dh` VARCHAR(191) NOT NULL,
    `auth` VARCHAR(191) NOT NULL,
    `userId` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `push_subscriptions_endpoint_key`(`endpoint`),
    INDEX `push_subscriptions_userId_fkey`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `integrations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `business_id` INTEGER NOT NULL,
    `provider` VARCHAR(191) NOT NULL,
    `display_name` VARCHAR(191) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'disconnected',
    `webhook_secret` VARCHAR(191) NULL,
    `api_key` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `account_name` VARCHAR(191) NULL,
    `last_sync` DATETIME(3) NULL,
    `last_sync_status` VARCHAR(191) NULL,
    `config` JSON NULL,

    INDEX `integrations_business_id_provider_idx`(`business_id`, `provider`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `integration_tokens` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `business_id` INTEGER NOT NULL,
    `integration_id` INTEGER NOT NULL,
    `access_token` TEXT NOT NULL,
    `refresh_token` TEXT NULL,
    `token_type` VARCHAR(191) NOT NULL DEFAULT 'bearer',
    `expires_at` DATETIME(3) NULL,
    `scopes` VARCHAR(191) NULL,
    `iv` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `provider` VARCHAR(191) NOT NULL DEFAULT 'unknown',

    INDEX `integration_tokens_integration_id_fkey`(`integration_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `external_leads` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `business_id` INTEGER NOT NULL,
    `integration_id` INTEGER NOT NULL,
    `external_lead_id` VARCHAR(300) NOT NULL,
    `provider` VARCHAR(191) NOT NULL,
    `crm_lead_id` INTEGER NULL,
    `raw_payload` LONGTEXT NULL,
    `mapped_payload` LONGTEXT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'raw',
    `error_message` TEXT NULL,
    `received_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `imported_at` DATETIME(3) NULL,

    INDEX `external_leads_integration_id_fkey`(`integration_id`),
    UNIQUE INDEX `external_leads_business_id_provider_external_lead_id_key`(`business_id`, `provider`, `external_lead_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `webhook_logs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `business_id` INTEGER NULL,
    `integration_id` INTEGER NULL,
    `provider` VARCHAR(191) NOT NULL,
    `event_type` VARCHAR(191) NULL,
    `payload` LONGTEXT NULL,
    `signature` VARCHAR(500) NULL,
    `signature_valid` BOOLEAN NULL,
    `processed` BOOLEAN NOT NULL DEFAULT false,
    `error` TEXT NULL,
    `received_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `processed_at` DATETIME(3) NULL,

    INDEX `webhook_logs_integration_id_fkey`(`integration_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lead_source_mappings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `business_id` INTEGER NOT NULL,
    `integration_id` INTEGER NOT NULL,
    `form_id` VARCHAR(191) NULL,
    `form_name` VARCHAR(191) NULL,
    `external_field` VARCHAR(191) NOT NULL,
    `crm_field` VARCHAR(191) NOT NULL,
    `transform` VARCHAR(191) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `lead_source_mappings_integration_id_fkey`(`integration_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sync_logs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `business_id` INTEGER NOT NULL,
    `integration_id` INTEGER NOT NULL,
    `sync_type` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'running',
    `leads_received` INTEGER NOT NULL DEFAULT 0,
    `leads_imported` INTEGER NOT NULL DEFAULT 0,
    `leads_failed` INTEGER NOT NULL DEFAULT 0,
    `leads_duplicate` INTEGER NOT NULL DEFAULT 0,
    `started_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `error_message` TEXT NULL,
    `finished_at` DATETIME(3) NULL,

    INDEX `sync_logs_integration_id_fkey`(`integration_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `integration_assignment_rules` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `business_id` INTEGER NOT NULL,
    `integration_id` INTEGER NOT NULL,
    `form_id` VARCHAR(191) NULL,
    `strategy` VARCHAR(191) NOT NULL DEFAULT 'round_robin',
    `user_ids` TEXT NOT NULL,
    `stage_id` INTEGER NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `integration_assignment_rules_integration_id_fkey`(`integration_id`),
    UNIQUE INDEX `integration_assignment_rules_business_id_integration_id_form_key`(`business_id`, `integration_id`, `form_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `assignment_rr_state` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `rule_id` INTEGER NOT NULL,
    `current_index` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `assignment_rr_state_rule_id_key`(`rule_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `support_tickets` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `subject` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'open',
    `priority` VARCHAR(191) NOT NULL DEFAULT 'medium',
    `category` VARCHAR(191) NULL,
    `business_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `assigned_to_id` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `last_responded_at` DATETIME(3) NULL,

    INDEX `support_tickets_business_id_idx`(`business_id`),
    INDEX `support_tickets_user_id_idx`(`user_id`),
    INDEX `support_tickets_assigned_to_id_idx`(`assigned_to_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ticket_messages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ticket_id` INTEGER NOT NULL,
    `sender_id` INTEGER NOT NULL,
    `is_admin` BOOLEAN NOT NULL DEFAULT false,
    `message` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ticket_messages_ticket_id_idx`(`ticket_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ticket_internal_notes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ticket_id` INTEGER NOT NULL,
    `admin_id` INTEGER NOT NULL,
    `note` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ticket_internal_notes_ticket_id_idx`(`ticket_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ticket_activity_logs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ticket_id` INTEGER NOT NULL,
    `actor_id` INTEGER NOT NULL,
    `actor_name` VARCHAR(191) NOT NULL,
    `is_admin` BOOLEAN NOT NULL DEFAULT false,
    `type` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ticket_activity_logs_ticket_id_idx`(`ticket_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `business_feature` ADD CONSTRAINT `business_feature_business_id_fkey` FOREIGN KEY (`business_id`) REFERENCES `business`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_buisnesId_fkey` FOREIGN KEY (`buisnesId`) REFERENCES `business`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `roles`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `branch`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `leads` ADD CONSTRAINT `leads_businessId_fkey` FOREIGN KEY (`businessId`) REFERENCES `business`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `leads` ADD CONSTRAINT `leads_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `branch`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `leads` ADD CONSTRAINT `leads_stageId_fkey` FOREIGN KEY (`stageId`) REFERENCES `lead_stages`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lead_users` ADD CONSTRAINT `lead_users_lead_id_fkey` FOREIGN KEY (`lead_id`) REFERENCES `leads`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lead_users` ADD CONSTRAINT `lead_users_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `roles` ADD CONSTRAINT `roles_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `branch`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `roles` ADD CONSTRAINT `roles_buisnesId_fkey` FOREIGN KEY (`buisnesId`) REFERENCES `business`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `permissions` ADD CONSTRAINT `permissions_policyId_fkey` FOREIGN KEY (`policyId`) REFERENCES `policy`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `role_has_permissions` ADD CONSTRAINT `role_has_permissions_permission_id_fkey` FOREIGN KEY (`permission_id`) REFERENCES `permissions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `role_has_permissions` ADD CONSTRAINT `role_has_permissions_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `branch` ADD CONSTRAINT `branch_buisnessId_fkey` FOREIGN KEY (`buisnessId`) REFERENCES `business`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `area_of_operations` ADD CONSTRAINT `area_of_operations_business_id_fkey` FOREIGN KEY (`business_id`) REFERENCES `business`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lead_stages` ADD CONSTRAINT `lead_stages_buisnessId_fkey` FOREIGN KEY (`buisnessId`) REFERENCES `business`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lead_stages` ADD CONSTRAINT `lead_stages_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `branch`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `status_change_history` ADD CONSTRAINT `status_change_history_changed_by_fkey` FOREIGN KEY (`changed_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `status_change_history` ADD CONSTRAINT `status_change_history_lead_id_fkey` FOREIGN KEY (`lead_id`) REFERENCES `leads`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `status_change_history` ADD CONSTRAINT `status_change_history_stageId_fkey` FOREIGN KEY (`stageId`) REFERENCES `lead_stages`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comment` ADD CONSTRAINT `comment_leadId_fkey` FOREIGN KEY (`leadId`) REFERENCES `leads`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comment` ADD CONSTRAINT `comment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `activity` ADD CONSTRAINT `activity_leadId_fkey` FOREIGN KEY (`leadId`) REFERENCES `leads`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `activity` ADD CONSTRAINT `activity_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `activity` ADD CONSTRAINT `activity_super_admin_id_fkey` FOREIGN KEY (`super_admin_id`) REFERENCES `super_admin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `login_logout_logs` ADD CONSTRAINT `login_logout_logs_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `super_admin` ADD CONSTRAINT `super_admin_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `push_subscriptions` ADD CONSTRAINT `push_subscriptions_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `integrations` ADD CONSTRAINT `integrations_business_id_fkey` FOREIGN KEY (`business_id`) REFERENCES `business`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `integration_tokens` ADD CONSTRAINT `integration_tokens_integration_id_fkey` FOREIGN KEY (`integration_id`) REFERENCES `integrations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `external_leads` ADD CONSTRAINT `external_leads_integration_id_fkey` FOREIGN KEY (`integration_id`) REFERENCES `integrations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `webhook_logs` ADD CONSTRAINT `webhook_logs_integration_id_fkey` FOREIGN KEY (`integration_id`) REFERENCES `integrations`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lead_source_mappings` ADD CONSTRAINT `lead_source_mappings_integration_id_fkey` FOREIGN KEY (`integration_id`) REFERENCES `integrations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sync_logs` ADD CONSTRAINT `sync_logs_integration_id_fkey` FOREIGN KEY (`integration_id`) REFERENCES `integrations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `integration_assignment_rules` ADD CONSTRAINT `integration_assignment_rules_integration_id_fkey` FOREIGN KEY (`integration_id`) REFERENCES `integrations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `assignment_rr_state` ADD CONSTRAINT `assignment_rr_state_rule_id_fkey` FOREIGN KEY (`rule_id`) REFERENCES `integration_assignment_rules`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `support_tickets` ADD CONSTRAINT `support_tickets_business_id_fkey` FOREIGN KEY (`business_id`) REFERENCES `business`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `support_tickets` ADD CONSTRAINT `support_tickets_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `support_tickets` ADD CONSTRAINT `support_tickets_assigned_to_id_fkey` FOREIGN KEY (`assigned_to_id`) REFERENCES `super_admin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ticket_messages` ADD CONSTRAINT `ticket_messages_ticket_id_fkey` FOREIGN KEY (`ticket_id`) REFERENCES `support_tickets`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ticket_internal_notes` ADD CONSTRAINT `ticket_internal_notes_ticket_id_fkey` FOREIGN KEY (`ticket_id`) REFERENCES `support_tickets`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ticket_activity_logs` ADD CONSTRAINT `ticket_activity_logs_ticket_id_fkey` FOREIGN KEY (`ticket_id`) REFERENCES `support_tickets`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
