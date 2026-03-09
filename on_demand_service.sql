
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
DROP TABLE IF EXISTS `_prisma_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `_prisma_migrations` WRITE;
/*!40000 ALTER TABLE `_prisma_migrations` DISABLE KEYS */;
INSERT INTO `_prisma_migrations` VALUES ('591304f1-c15c-4dda-a35a-2b672eb2bde8','2a730bac769c6b9ab9596ef0d6e001a72c97b0b4c0d6f49fdf75e4845ae6d50e','2026-03-09 12:57:17.620','20260306134138_init',NULL,NULL,'2026-03-09 12:57:17.054',1),('697c2342-5c5f-48ed-b3e3-7870e0e54649','ab0e065487981f0c2c224ff98e25213224a38cec43d24e17c98a1d914e71e599','2026-03-09 12:57:17.721','20260306144553_add_booking_fields',NULL,NULL,'2026-03-09 12:57:17.626',1),('d7a380bf-f5b9-4427-bd91-df311dcedfe9','feceaef15e18ef7cad701c5125adb8f690ed42f537a7344cd4f88e6fc909f337','2026-03-09 12:57:29.370','20260309125729_add_refresh_token',NULL,NULL,'2026-03-09 12:57:29.089',1);
/*!40000 ALTER TABLE `_prisma_migrations` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `booking`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `booking` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `scheduledAt` datetime(3) NOT NULL,
  `status` enum('PENDING','ACCEPTED','REJECTED','COMPLETED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `totalAmount` decimal(10,2) NOT NULL,
  `customerId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `providerId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `serviceId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `address` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `notes` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `Booking_customerId_fkey` (`customerId`),
  KEY `Booking_providerId_fkey` (`providerId`),
  KEY `Booking_serviceId_fkey` (`serviceId`),
  CONSTRAINT `Booking_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Booking_providerId_fkey` FOREIGN KEY (`providerId`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Booking_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `service` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `booking` WRITE;
/*!40000 ALTER TABLE `booking` DISABLE KEYS */;
INSERT INTO `booking` VALUES ('3a6c7bed-81e9-4934-8b6c-d04fa64b4946','2026-02-26 00:01:00.683','COMPLETED',100.00,'03b6862f-2fa6-4e87-a4c6-78d6e2609806','167045de-b246-49fe-b4ec-a0256132c117','b0362ce4-209b-48b2-b7ff-a9a14bc26c54','2026-03-09 13:47:40.683','2026-03-09 13:47:40.683','123 Fake Street',NULL),('483e3895-2c24-4c51-b84d-d1be53712f92','2026-02-26 00:01:00.670','COMPLETED',100.00,'03b6862f-2fa6-4e87-a4c6-78d6e2609806','167045de-b246-49fe-b4ec-a0256132c117','bfd7e7bc-fe12-4388-b538-e92a2df08fae','2026-03-09 13:47:40.673','2026-03-09 13:47:40.673','123 Fake Street',NULL),('53efc095-0190-4396-8e4a-de2ab6d24484','2026-02-25 23:52:34.385','COMPLETED',100.00,'03b6862f-2fa6-4e87-a4c6-78d6e2609806','e158bf10-ba55-4af5-8e4b-5ebb97f5d75a','b4420aad-92c3-4468-80ed-2939a67f69d4','2026-03-09 13:39:14.386','2026-03-09 13:39:14.386','123 Fake Street',NULL),('602f891e-86ed-4cb3-8fa6-99ae0e4639c8','2026-02-26 00:01:00.723','COMPLETED',100.00,'03b6862f-2fa6-4e87-a4c6-78d6e2609806','e158bf10-ba55-4af5-8e4b-5ebb97f5d75a','bfd7e7bc-fe12-4388-b538-e92a2df08fae','2026-03-09 13:47:40.723','2026-03-09 13:47:40.723','123 Fake Street',NULL),('6ab8544d-5bca-431f-86e3-ff75bb898b96','2026-02-26 00:01:00.753','COMPLETED',100.00,'03b6862f-2fa6-4e87-a4c6-78d6e2609806','82f2b74b-5e7b-4ddc-873e-1c283af11862','a7f7b243-537e-493c-817c-ffec3cf0b6f9','2026-03-09 13:47:40.753','2026-03-09 13:47:40.753','123 Fake Street',NULL),('7889b081-2f60-489a-a9d9-5ab9981f754f','2026-02-25 23:52:34.293','COMPLETED',100.00,'03b6862f-2fa6-4e87-a4c6-78d6e2609806','167045de-b246-49fe-b4ec-a0256132c117','b0362ce4-209b-48b2-b7ff-a9a14bc26c54','2026-03-09 13:39:14.294','2026-03-09 13:39:14.294','123 Fake Street',NULL),('78ae437f-e1d8-43e7-89e7-2208f1d833eb','2026-02-26 00:01:00.696','COMPLETED',100.00,'03b6862f-2fa6-4e87-a4c6-78d6e2609806','9981d735-19d7-44a9-9c56-58c3e3b73e58','a7f7b243-537e-493c-817c-ffec3cf0b6f9','2026-03-09 13:47:40.696','2026-03-09 13:47:40.696','123 Fake Street',NULL),('8cae4dae-2a8a-49a7-ac9b-e78721acfcb7','2026-02-26 00:01:00.733','COMPLETED',100.00,'03b6862f-2fa6-4e87-a4c6-78d6e2609806','e158bf10-ba55-4af5-8e4b-5ebb97f5d75a','b4420aad-92c3-4468-80ed-2939a67f69d4','2026-03-09 13:47:40.733','2026-03-09 13:47:40.733','123 Fake Street',NULL),('a4e0073e-2eae-48ba-a92a-b9ce56686b46','2026-02-25 23:52:34.279','COMPLETED',100.00,'03b6862f-2fa6-4e87-a4c6-78d6e2609806','167045de-b246-49fe-b4ec-a0256132c117','bfd7e7bc-fe12-4388-b538-e92a2df08fae','2026-03-09 13:39:14.281','2026-03-09 13:39:14.281','123 Fake Street',NULL),('c919e697-2f60-4953-9b84-bae1e2b354a4','2026-02-25 23:52:34.343','COMPLETED',100.00,'03b6862f-2fa6-4e87-a4c6-78d6e2609806','9981d735-19d7-44a9-9c56-58c3e3b73e58','b4420aad-92c3-4468-80ed-2939a67f69d4','2026-03-09 13:39:14.343','2026-03-09 13:39:14.343','123 Fake Street',NULL),('e0af6edc-915e-4aa1-a188-7c5c2cfcd096','2026-02-25 23:52:34.410','COMPLETED',100.00,'03b6862f-2fa6-4e87-a4c6-78d6e2609806','82f2b74b-5e7b-4ddc-873e-1c283af11862','a7f7b243-537e-493c-817c-ffec3cf0b6f9','2026-03-09 13:39:14.411','2026-03-09 13:39:14.411','123 Fake Street',NULL),('e1b729df-485b-4834-a60c-e9344638fd6a','2026-02-25 23:52:34.328','COMPLETED',100.00,'03b6862f-2fa6-4e87-a4c6-78d6e2609806','9981d735-19d7-44a9-9c56-58c3e3b73e58','a7f7b243-537e-493c-817c-ffec3cf0b6f9','2026-03-09 13:39:14.329','2026-03-09 13:39:14.329','123 Fake Street',NULL),('e9d56d52-325f-4d37-81cf-82ca032eb94f','2026-02-25 23:52:34.372','COMPLETED',100.00,'03b6862f-2fa6-4e87-a4c6-78d6e2609806','e158bf10-ba55-4af5-8e4b-5ebb97f5d75a','bfd7e7bc-fe12-4388-b538-e92a2df08fae','2026-03-09 13:39:14.373','2026-03-09 13:39:14.373','123 Fake Street',NULL),('ee202481-9c40-41a9-a07d-956547a467f7','2026-02-26 00:01:00.705','COMPLETED',100.00,'03b6862f-2fa6-4e87-a4c6-78d6e2609806','9981d735-19d7-44a9-9c56-58c3e3b73e58','b4420aad-92c3-4468-80ed-2939a67f69d4','2026-03-09 13:47:40.705','2026-03-09 13:47:40.705','123 Fake Street',NULL);
/*!40000 ALTER TABLE `booking` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Category_name_key` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES ('2589f5ae-444e-4d14-937a-48ff21b9836e','Painting','Interior and exterior home painting','2026-03-09 13:47:40.575','2026-03-09 13:47:40.575'),('3014d81c-78ad-4230-8898-117d4f1f7c2f','Electrician','Safe and certified electrical work','2026-03-09 13:47:40.549','2026-03-09 13:47:40.549'),('919acd72-3b93-404e-aad7-6bcbee94e43f','Repair','Home appliance and hardware repairs','2026-03-09 13:39:14.172','2026-03-09 13:39:14.172'),('a8b0bed8-a89d-45cd-b826-f0394636ae87','Cleaning','Professional home and office cleaning services','2026-03-09 13:39:14.126','2026-03-09 13:39:14.126'),('ea782fdc-eaaf-4a83-8c0a-fe3ebfdcd78b','Plumbing','Residential and commercial plumbing solutions','2026-03-09 13:47:40.498','2026-03-09 13:47:40.498');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notification` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `isRead` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Notification_userId_fkey` (`userId`),
  CONSTRAINT `Notification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `notification` WRITE;
/*!40000 ALTER TABLE `notification` DISABLE KEYS */;
/*!40000 ALTER TABLE `notification` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `service`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `service` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `categoryId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Service_categoryId_fkey` (`categoryId`),
  CONSTRAINT `Service_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `category` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `service` WRITE;
/*!40000 ALTER TABLE `service` DISABLE KEYS */;
INSERT INTO `service` VALUES ('156006b8-f01c-47e2-98c6-48a8d07a0363','Switchboard Repair','Fixing faulty switches',300.00,'3014d81c-78ad-4230-8898-117d4f1f7c2f','2026-03-09 13:47:40.549','2026-03-09 13:47:40.549'),('3f99ed2b-9e1c-46bf-bf3f-aacfe2827548','Wood Polishing','Restore furniture and doors',2000.00,'2589f5ae-444e-4d14-937a-48ff21b9836e','2026-03-09 13:47:40.575','2026-03-09 13:47:40.575'),('4a342f18-c139-407a-a30c-3011b3621b90','Leaky Pipe Fix','Fixing minor leaks in faucets and pipes',400.00,'ea782fdc-eaaf-4a83-8c0a-fe3ebfdcd78b','2026-03-09 13:47:40.498','2026-03-09 13:47:40.498'),('5a1f1592-6bee-449f-b0f7-a8577b597987','Drainage Unclogging','Clearing blocked kitchen or bath drains',600.00,'ea782fdc-eaaf-4a83-8c0a-fe3ebfdcd78b','2026-03-09 13:47:40.498','2026-03-09 13:47:40.498'),('645f5197-cd96-499e-be0c-be7572fc9ac5','Fan Installation','Fitting and wiring ceiling fans',500.00,'3014d81c-78ad-4230-8898-117d4f1f7c2f','2026-03-09 13:47:40.549','2026-03-09 13:47:40.549'),('6ebe18a0-f7a1-45bb-bc23-6d1b4eff20e8','Interior Wall Painting','Single wall or full room painting',5000.00,'2589f5ae-444e-4d14-937a-48ff21b9836e','2026-03-09 13:47:40.575','2026-03-09 13:47:40.575'),('709f4d27-35d3-41e5-b1fb-6df898b048d3','Custom Wiring','New socket points and internal wiring',1500.00,'3014d81c-78ad-4230-8898-117d4f1f7c2f','2026-03-09 13:47:40.549','2026-03-09 13:47:40.549'),('a7f7b243-537e-493c-817c-ffec3cf0b6f9','AC Service','Routine AC maintenance',1200.00,'919acd72-3b93-404e-aad7-6bcbee94e43f','2026-03-09 13:39:14.172','2026-03-09 13:39:14.172'),('b0362ce4-209b-48b2-b7ff-a9a14bc26c54','Sofa Cleaning','Expert upholstery cleaning',800.00,'a8b0bed8-a89d-45cd-b826-f0394636ae87','2026-03-09 13:39:14.126','2026-03-09 13:39:14.126'),('b4420aad-92c3-4468-80ed-2939a67f69d4','Plumbing','Leaky pipes and fixture fixes',500.00,'919acd72-3b93-404e-aad7-6bcbee94e43f','2026-03-09 13:39:14.172','2026-03-09 13:39:14.172'),('bc29f911-f4aa-4c29-b295-74aea9e46036','Bathroom Fitting','Installing new taps and shower heads',1000.00,'ea782fdc-eaaf-4a83-8c0a-fe3ebfdcd78b','2026-03-09 13:47:40.498','2026-03-09 13:47:40.498'),('bfd7e7bc-fe12-4388-b538-e92a2df08fae','Deep Home Cleaning','Complete house scrub-down',1500.00,'a8b0bed8-a89d-45cd-b826-f0394636ae87','2026-03-09 13:39:14.126','2026-03-09 13:39:14.126');
/*!40000 ALTER TABLE `service` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('ADMIN','PROVIDER','CUSTOMER') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'CUSTOMER',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `avatarUrl` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `categoryId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `providerStatus` enum('PENDING','APPROVED','REJECTED') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `refreshToken` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_email_key` (`email`),
  KEY `User_categoryId_fkey` (`categoryId`),
  CONSTRAINT `User_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `category` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES ('0150f642-2956-4942-b041-ce9b596ef5eb','John Doe','provider@brandsspark.com','$2b$10$y7k3MO3UCYVwGQrBDWgJROXmkTm4QMkdahddKWEqbuLU18DxoluDS','PROVIDER','2026-03-09 13:52:40.015','2026-03-09 13:53:40.796',NULL,'3014d81c-78ad-4230-8898-117d4f1f7c2f','APPROVED','9c5328bde8a0cfbab308f21c7cd6f946f00c31ea7a1d1f45e633396c5aebdb3c'),('03b6862f-2fa6-4e87-a4c6-78d6e2609806','System Admin','admin@brandspark.com','$2b$10$PlLU/8qKqzk4DBAT3M1zhObIZzRDrWiE7X3elvueERJAgGzP18gB.','ADMIN','2026-03-09 13:39:14.003','2026-03-09 13:41:19.375',NULL,NULL,NULL,'d50d263b802363dd1761b2bbee5c5595da4e90875c6afc03d4efb4c5e63f9506'),('167045de-b246-49fe-b4ec-a0256132c117','John the Cleaner','john.cleaning@brandspark.com','$2b$10$GxKtN0NlJKelaXvsqKoSQuc9fOp3ixy8KKb3H/fze9zyS9tPljr2S','PROVIDER','2026-03-09 13:39:14.262','2026-03-09 13:39:14.262','https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop',NULL,NULL,NULL),('82f2b74b-5e7b-4ddc-873e-1c283af11862','David Electric & AC','david.tech@brandspark.com','$2b$10$GxKtN0NlJKelaXvsqKoSQuc9fOp3ixy8KKb3H/fze9zyS9tPljr2S','PROVIDER','2026-03-09 13:39:14.399','2026-03-09 13:39:14.399','https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop',NULL,NULL,NULL),('8a4c4512-ff1a-458a-8640-ebe69f4c669c','osama','osama1@gamil.com','$2b$10$CZTDSQOtftelvxbwb01JvevGlsf3vaaGk7HjDWUxR/anAdeV.pjm2','PROVIDER','2026-03-09 13:40:05.038','2026-03-09 13:43:43.413',NULL,'a8b0bed8-a89d-45cd-b826-f0394636ae87','APPROVED','688568c10914f25e894580578ef4f206ab0fbc62c456c2744bda2f7075df6f57'),('9529fee3-fdf8-4e87-afa0-e1054fdfaaee','John Doe','customer@brandspark.com','$2b$10$.udk/5lydGsGkqsCOfFsdewVsRmtDAmtBUloAq66REXJACYdFTHPC','CUSTOMER','2026-03-09 13:53:30.063','2026-03-09 13:53:30.102',NULL,NULL,NULL,'0ef06716920701609d0eadc44e06f6e032ecfe6c45eccfe6d719b93a5f335187'),('9981d735-19d7-44a9-9c56-58c3e3b73e58','Mike FixIt','mike.repair@brandspark.com','$2b$10$GxKtN0NlJKelaXvsqKoSQuc9fOp3ixy8KKb3H/fze9zyS9tPljr2S','PROVIDER','2026-03-09 13:39:14.311','2026-03-09 13:39:14.311','https://images.unsplash.com/photo-1520333789090-1afc82db536a?q=80&w=100&auto=format&fit=crop',NULL,NULL,NULL),('b01719de-594b-46aa-8914-1a8406f7c39f','Waqas','faheem1@gmail.com','$2b$10$VcYbZowXVQI78MjMa7jnoe8jxIYO856R9KLvfPn4W4JlU2CH7wV7W','CUSTOMER','2026-03-09 13:05:53.902','2026-03-09 13:05:53.926',NULL,NULL,NULL,'501b0064225fa5c83d2d3983b05b40961b4f8f1db6c83faaea004b22ad3e5fef'),('cf7b1444-4df1-4dfe-bf10-9903bfc0b2fb','Waqas','faheem9266792@gmail.com','$2b$10$g/Ofsk6WjqZVLYR8pLcrIef9rR3pyntY8NPfvbN/bFM3mwHEbSKrC','CUSTOMER','2026-03-09 13:01:21.882','2026-03-09 13:44:06.661',NULL,NULL,NULL,'6ead764e0a87a1448ba0efd5be3ff8505d9138d666cfc252fd54048e46e18470'),('e158bf10-ba55-4af5-8e4b-5ebb97f5d75a','Sarah ProServices','sarah.allaround@brandspark.com','$2b$10$GxKtN0NlJKelaXvsqKoSQuc9fOp3ixy8KKb3H/fze9zyS9tPljr2S','PROVIDER','2026-03-09 13:39:14.357','2026-03-09 13:39:14.357','https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop',NULL,NULL,NULL),('f8e5bb0d-d75f-4cae-ade2-3cf64ff7c4fd','Waqas','faheem@gmail.com','$2b$10$zfwaFuOCLzw6JbhzyaUCNe36WcY4ChTejP86geQ.h.7Ay3XnUhhnW','CUSTOMER','2026-03-09 13:02:40.173','2026-03-09 13:02:40.173',NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

