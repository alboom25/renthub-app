-- MySQL dump 10.13  Distrib 8.0.33, for Win64 (x86_64)
--
-- Host: localhost    Database: cloud_tena
-- ------------------------------------------------------
-- Server version	8.0.32

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `tbl_ac_payables`
--

DROP TABLE IF EXISTS `tbl_ac_payables`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_ac_payables` (
  `bill_id` varchar(36) NOT NULL,
  `bill_date` datetime NOT NULL,
  `bill_due_date` date NOT NULL,
  `target_group` int NOT NULL DEFAULT '1',
  `target_person_id` varchar(36) DEFAULT NULL,
  `property_code` varchar(6) DEFAULT NULL,
  `is_cancelled` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`bill_id`),
  KEY `property_code` (`property_code`),
  CONSTRAINT `tbl_ac_payables_ibfk_1` FOREIGN KEY (`property_code`) REFERENCES `tbl_properties` (`property_code`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_ac_payables`
--

LOCK TABLES `tbl_ac_payables` WRITE;
/*!40000 ALTER TABLE `tbl_ac_payables` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_ac_payables` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_ac_payables_entries`
--

DROP TABLE IF EXISTS `tbl_ac_payables_entries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_ac_payables_entries` (
  `entry_id` int NOT NULL AUTO_INCREMENT,
  `bill_id` varchar(36) NOT NULL,
  `description` varchar(255) NOT NULL,
  `amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`entry_id`),
  KEY `bill_id` (`bill_id`),
  CONSTRAINT `tbl_ac_payables_entries_ibfk_1` FOREIGN KEY (`bill_id`) REFERENCES `tbl_ac_payables` (`bill_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_ac_payables_entries`
--

LOCK TABLES `tbl_ac_payables_entries` WRITE;
/*!40000 ALTER TABLE `tbl_ac_payables_entries` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_ac_payables_entries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_admin_mpesa_payments`
--

DROP TABLE IF EXISTS `tbl_admin_mpesa_payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_admin_mpesa_payments` (
  `auto_id` varchar(36) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `TransactionType` varchar(40) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `TransID` varchar(40) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `TransTime` varchar(40) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `TransAmount` decimal(10,2) DEFAULT NULL,
  `BusinessShortCode` varchar(15) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `BillRefNumber` varchar(40) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `InvoiceNumber` varchar(40) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `ThirdPartyTransID` varchar(40) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `MSISDN` varchar(36) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `FirstName` varchar(60) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `MiddleName` varchar(60) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `LastName` varchar(60) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `OrgAccountBalance` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`auto_id`,`TransID`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_admin_mpesa_payments`
--

LOCK TABLES `tbl_admin_mpesa_payments` WRITE;
/*!40000 ALTER TABLE `tbl_admin_mpesa_payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_admin_mpesa_payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_admin_mpesa_payments_failed`
--

DROP TABLE IF EXISTS `tbl_admin_mpesa_payments_failed`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_admin_mpesa_payments_failed` (
  `auto_id` varchar(36) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `TransactionType` varchar(40) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `TransID` varchar(40) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `TransTime` varchar(40) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `TransAmount` decimal(10,2) DEFAULT NULL,
  `BusinessShortCode` varchar(15) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `BillRefNumber` varchar(40) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `InvoiceNumber` varchar(40) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `ThirdPartyTransID` varchar(40) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `MSISDN` varchar(36) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `FirstName` varchar(60) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `MiddleName` varchar(60) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `LastName` varchar(60) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `OrgAccountBalance` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`auto_id`,`TransID`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_admin_mpesa_payments_failed`
--

LOCK TABLES `tbl_admin_mpesa_payments_failed` WRITE;
/*!40000 ALTER TABLE `tbl_admin_mpesa_payments_failed` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_admin_mpesa_payments_failed` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_admin_users`
--

DROP TABLE IF EXISTS `tbl_admin_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_admin_users` (
  `user_code` varchar(36) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `username` varchar(36) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `email_address` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `email_verified` tinyint(1) NOT NULL DEFAULT '0',
  `phone_number` int NOT NULL,
  `phone_verified` tinyint(1) NOT NULL DEFAULT '0',
  `first_name` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `last_name` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `other_names` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `avatar_path` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `last_success_login` datetime DEFAULT NULL,
  `password_change_required` tinyint(1) NOT NULL DEFAULT '0',
  `email_verification` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `email_verification_expire` datetime DEFAULT NULL,
  `account_active` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`username`,`user_code`,`email_address`) USING BTREE,
  KEY `user_code` (`user_code`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_admin_users`
--

LOCK TABLES `tbl_admin_users` WRITE;
/*!40000 ALTER TABLE `tbl_admin_users` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_admin_users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_ads`
--

DROP TABLE IF EXISTS `tbl_ads`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_ads` (
  `auto_id` int NOT NULL AUTO_INCREMENT,
  `ad_id` varchar(36) NOT NULL,
  `ad_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `unit_code` varchar(36) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `added_by` varchar(36) NOT NULL,
  `total_views` int NOT NULL DEFAULT '0',
  `ad_comments` varchar(1000) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `viewing_fees` decimal(10,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`auto_id`) USING BTREE,
  KEY `unit_id` (`unit_code`),
  KEY `added_by` (`added_by`),
  CONSTRAINT `tbl_ads_ibfk_1` FOREIGN KEY (`unit_code`) REFERENCES `tbl_units` (`unit_code`),
  CONSTRAINT `tbl_ads_ibfk_2` FOREIGN KEY (`added_by`) REFERENCES `tbl_users` (`user_code`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_ads`
--

LOCK TABLES `tbl_ads` WRITE;
/*!40000 ALTER TABLE `tbl_ads` DISABLE KEYS */;
INSERT INTO `tbl_ads` VALUES (1,'3b7ac47f-c076-46c4-a3e5-c4cef4494db3','2021-11-03 10:47:39','356f33f3-2548-4086-9923-c75e81ed3f04','768afb88-69ce-401d-b8b2-712fd235a11d',0,'',0,400.00),(2,'2811124e-56c2-48ce-b1c7-e83e1c86f7cf','2021-11-03 11:38:09','961af8fa-1c48-4677-8d6a-ac7fce420bb1','768afb88-69ce-401d-b8b2-712fd235a11d',0,'',1,0.00),(3,'54c2d86c-713a-4e53-badc-3fe692366ebf','2021-11-03 11:46:58','caddcae2-b69c-4f5a-b371-d7aeb7a328f5','768afb88-69ce-401d-b8b2-712fd235a11d',0,'',0,560.00),(4,'19f68796-08f0-4bb4-8f7e-c91faef1439a','2021-11-12 15:43:47','48cb0670-845e-4e50-a086-78b7739dcdb8','768afb88-69ce-401d-b8b2-712fd235a11d',0,'',0,0.00),(5,'435be78d-46dd-4bc8-81c3-ad6ee333945f','2021-11-12 15:47:20','4cbfec6f-8634-4edc-976e-9d26bab0685e','768afb88-69ce-401d-b8b2-712fd235a11d',0,'',0,450.00),(6,'4c17f7cd-124a-47c4-941c-4782505fce04','2021-11-12 15:50:31','bd52398f-79e2-44ea-9f2f-05dbbcf6e85d','768afb88-69ce-401d-b8b2-712fd235a11d',0,'',1,100.00);
/*!40000 ALTER TABLE `tbl_ads` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_constituencies`
--

DROP TABLE IF EXISTS `tbl_constituencies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_constituencies` (
  `constituency_id` int NOT NULL AUTO_INCREMENT,
  `constituency_name` varchar(255) DEFAULT NULL,
  `county_id` int NOT NULL,
  PRIMARY KEY (`constituency_id`),
  KEY `county_id` (`county_id`),
  CONSTRAINT `tbl_constituencies_ibfk_1` FOREIGN KEY (`county_id`) REFERENCES `tbl_counties` (`county_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_constituencies`
--

LOCK TABLES `tbl_constituencies` WRITE;
/*!40000 ALTER TABLE `tbl_constituencies` DISABLE KEYS */;
INSERT INTO `tbl_constituencies` VALUES (1,'Dagoretti North',47),(2,'Dagoretti South',47),(3,'Embakasi Central',47);
/*!40000 ALTER TABLE `tbl_constituencies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_counties`
--

DROP TABLE IF EXISTS `tbl_counties`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_counties` (
  `county_id` int NOT NULL AUTO_INCREMENT,
  `county_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`county_id`)
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_counties`
--

LOCK TABLES `tbl_counties` WRITE;
/*!40000 ALTER TABLE `tbl_counties` DISABLE KEYS */;
INSERT INTO `tbl_counties` VALUES (1,'Mombasa'),(2,'Kwale'),(3,'Kilifi'),(4,'Tana River'),(5,'Lamu'),(6,'Taita-Taveta'),(7,'Garissa'),(8,'Wajir'),(9,'Mandera'),(10,'Marsabit'),(11,'Isiolo'),(12,'Meru'),(13,'Tharaka-Nithi'),(14,'Embu'),(15,'Kitui'),(16,'Machakos'),(17,'Makueni'),(18,'Nyandarua'),(19,'Nyeri'),(20,'Kirinyaga'),(21,'Murang\'a'),(22,'Kiambu'),(23,'Turkana'),(24,'West Pokot'),(25,'Samburu'),(26,'Trans-Nzoia'),(27,'Uasin Gishu'),(28,'Elgeyo-Marakwet'),(29,'Nandi'),(30,'Baringo'),(31,'Laikipia'),(32,'Nakuru'),(33,'Narok'),(34,'Kajiado'),(35,'Kericho'),(36,'Bomet'),(37,'Kakamega'),(38,'	Vihiga'),(39,'Bungoma'),(40,'Busia'),(41,'Siaya'),(42,'Kisumu'),(43,'Homa Bay'),(44,'Migori'),(45,'Kisii'),(46,'Nyamira'),(47,'Nairobi');
/*!40000 ALTER TABLE `tbl_counties` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_enquiries`
--

DROP TABLE IF EXISTS `tbl_enquiries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_enquiries` (
  `enquiry_id` varchar(36) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `unit_code` varchar(36) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `full_name` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `phone_number` int NOT NULL,
  `email_address` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `enquiry_message` varchar(400) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `enquiry_date` datetime DEFAULT NULL,
  `responded` tinyint(1) NOT NULL DEFAULT '0',
  `responded_by` varchar(36) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  PRIMARY KEY (`enquiry_id`) USING BTREE,
  KEY `unit_code` (`unit_code`) USING BTREE,
  KEY `responded_by` (`responded_by`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_enquiries`
--

LOCK TABLES `tbl_enquiries` WRITE;
/*!40000 ALTER TABLE `tbl_enquiries` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_enquiries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_expenses`
--

DROP TABLE IF EXISTS `tbl_expenses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_expenses` (
  `expense_id` varchar(36) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `expense_title` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `expense_description` varchar(400) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `created_on` datetime NOT NULL,
  `created_by` varchar(36) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `property_code` varchar(6) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `unit_code` varchar(26) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `is_cancelled` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`expense_id`),
  KEY `created_by` (`created_by`),
  KEY `property_code` (`property_code`),
  CONSTRAINT `tbl_expenses_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `tbl_users` (`user_code`),
  CONSTRAINT `tbl_expenses_ibfk_2` FOREIGN KEY (`property_code`) REFERENCES `tbl_properties` (`property_code`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_expenses`
--

LOCK TABLES `tbl_expenses` WRITE;
/*!40000 ALTER TABLE `tbl_expenses` DISABLE KEYS */;
INSERT INTO `tbl_expenses` VALUES ('2e63a5eb-e09d-4c89-9c26-d89b55447de1','paiting room 1','THIS WAS PAINTED NOW','2021-11-13 06:14:11','768afb88-69ce-401d-b8b2-712fd235a11d','CZCS1V',NULL,0),('ff39da32-e200-4899-acb4-2d9db0f11679','repainting','property 2 repaint','2021-11-10 21:02:41','768afb88-69ce-401d-b8b2-712fd235a11d','3EJAXQ',NULL,0);
/*!40000 ALTER TABLE `tbl_expenses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_expenses_breakdown`
--

DROP TABLE IF EXISTS `tbl_expenses_breakdown`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_expenses_breakdown` (
  `id` int NOT NULL AUTO_INCREMENT,
  `description` varchar(255) NOT NULL,
  `amount` double(10,2) NOT NULL DEFAULT '0.00',
  `expense_id` varchar(36) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `expense_id` (`expense_id`),
  CONSTRAINT `tbl_expenses_breakdown_ibfk_1` FOREIGN KEY (`expense_id`) REFERENCES `tbl_expenses` (`expense_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_expenses_breakdown`
--

LOCK TABLES `tbl_expenses_breakdown` WRITE;
/*!40000 ALTER TABLE `tbl_expenses_breakdown` DISABLE KEYS */;
INSERT INTO `tbl_expenses_breakdown` VALUES (1,'paint',4500.00,'ff39da32-e200-4899-acb4-2d9db0f11679'),(2,'labour',6900.00,'ff39da32-e200-4899-acb4-2d9db0f11679'),(3,'paints',4500.00,'2e63a5eb-e09d-4c89-9c26-d89b55447de1'),(4,'labour',1500.00,'2e63a5eb-e09d-4c89-9c26-d89b55447de1'),(5,'turpwentine',3000.00,'2e63a5eb-e09d-4c89-9c26-d89b55447de1');
/*!40000 ALTER TABLE `tbl_expenses_breakdown` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_expenses_payments`
--

DROP TABLE IF EXISTS `tbl_expenses_payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_expenses_payments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `payment_method` enum('Cash','M-Pesa','Bank Deposit','Cheque','Others') NOT NULL DEFAULT 'Cash',
  `payment_date` datetime NOT NULL,
  `amount` double(10,2) NOT NULL DEFAULT '0.00',
  `expense_id` varchar(36) NOT NULL,
  `reference` varchar(255) DEFAULT NULL,
  `added_by` varchar(36) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `expense_id` (`expense_id`),
  KEY `added_by` (`added_by`),
  CONSTRAINT `tbl_expenses_payments_ibfk_1` FOREIGN KEY (`expense_id`) REFERENCES `tbl_expenses` (`expense_id`),
  CONSTRAINT `tbl_expenses_payments_ibfk_2` FOREIGN KEY (`added_by`) REFERENCES `tbl_users` (`user_code`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_expenses_payments`
--

LOCK TABLES `tbl_expenses_payments` WRITE;
/*!40000 ALTER TABLE `tbl_expenses_payments` DISABLE KEYS */;
INSERT INTO `tbl_expenses_payments` VALUES (1,'Cash','2021-11-13 00:00:00',11400.00,'ff39da32-e200-4899-acb4-2d9db0f11679','N/A','768afb88-69ce-401d-b8b2-712fd235a11d');
/*!40000 ALTER TABLE `tbl_expenses_payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_invoice_payments`
--

DROP TABLE IF EXISTS `tbl_invoice_payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_invoice_payments` (
  `payment_id` varchar(36) NOT NULL,
  `paid_amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `payment_method` varchar(255) NOT NULL DEFAULT 'CASH',
  `payment_date` datetime NOT NULL,
  `paid_by` varchar(255) NOT NULL,
  `payment_ref` varchar(255) NOT NULL,
  `invoice_id` varchar(10) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  PRIMARY KEY (`payment_id`),
  KEY `invoice_id` (`invoice_id`),
  CONSTRAINT `tbl_invoice_payments_ibfk_1` FOREIGN KEY (`invoice_id`) REFERENCES `tbl_invoices` (`invoice_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_invoice_payments`
--

LOCK TABLES `tbl_invoice_payments` WRITE;
/*!40000 ALTER TABLE `tbl_invoice_payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_invoice_payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_invoices`
--

DROP TABLE IF EXISTS `tbl_invoices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_invoices` (
  `invoice_id` varchar(10) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `invoice_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `invoice_due_date` date NOT NULL,
  `invoice_amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `discount_amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `package_id` varchar(36) NOT NULL,
  `user_code` varchar(36) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  PRIMARY KEY (`invoice_id`),
  KEY `package_id` (`package_id`),
  KEY `user_code` (`user_code`),
  CONSTRAINT `tbl_invoices_ibfk_1` FOREIGN KEY (`package_id`) REFERENCES `tbl_packages` (`package_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `tbl_invoices_ibfk_2` FOREIGN KEY (`user_code`) REFERENCES `tbl_users` (`user_code`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_invoices`
--

LOCK TABLES `tbl_invoices` WRITE;
/*!40000 ALTER TABLE `tbl_invoices` DISABLE KEYS */;
INSERT INTO `tbl_invoices` VALUES ('2KDZNDXHLV','2021-10-30 00:46:30','2021-11-06',1800.00,0.00,'r0frmjhy5yzp','768afb88-69ce-401d-b8b2-712fd235a11d'),('AJYU5D6UV6','2021-10-01 07:41:56','2021-10-09',0.00,0.00,'vy0is4ez65sq','7701882d-1592-4706-ac8a-9205c949bc73'),('C35JVA6JBQ','2021-10-01 12:40:04','2021-10-09',0.00,0.00,'vy0is4ez65sq','ce96d023-96b9-4a62-a2b0-4e566092917e'),('F5WGQDG87D','2021-11-05 05:00:03','2021-11-13',2500.00,0.00,'e0h3gvar4hkh','768afb88-69ce-401d-b8b2-712fd235a11d'),('JPS3428LKD','2021-10-13 11:59:50','2021-10-21',0.00,0.00,'vy0is4ez65sq','768afb88-69ce-401d-b8b2-712fd235a11d'),('ZWWY2YS1FY','2021-11-05 04:59:33','2021-11-13',2500.00,0.00,'e0h3gvar4hkh','768afb88-69ce-401d-b8b2-712fd235a11d');
/*!40000 ALTER TABLE `tbl_invoices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_localities`
--

DROP TABLE IF EXISTS `tbl_localities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_localities` (
  `locality_id` int NOT NULL AUTO_INCREMENT,
  `locality_name` varchar(255) DEFAULT NULL,
  `constituency_id` int DEFAULT NULL,
  `image_location` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`locality_id`),
  KEY `constituency_id` (`constituency_id`),
  CONSTRAINT `tbl_localities_ibfk_1` FOREIGN KEY (`constituency_id`) REFERENCES `tbl_constituencies` (`constituency_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_localities`
--

LOCK TABLES `tbl_localities` WRITE;
/*!40000 ALTER TABLE `tbl_localities` DISABLE KEYS */;
INSERT INTO `tbl_localities` VALUES (1,'Kilimani',1,NULL),(2,'Kawangware',1,NULL),(3,'Gatina',1,NULL),(4,'Kileleshwa',1,NULL),(5,'Kabiro',1,NULL);
/*!40000 ALTER TABLE `tbl_localities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_months`
--

DROP TABLE IF EXISTS `tbl_months`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_months` (
  `month_val` int NOT NULL,
  `month_name` varchar(255) NOT NULL,
  PRIMARY KEY (`month_val`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_months`
--

LOCK TABLES `tbl_months` WRITE;
/*!40000 ALTER TABLE `tbl_months` DISABLE KEYS */;
INSERT INTO `tbl_months` VALUES (1,'January'),(2,'February'),(3,'March'),(4,'April'),(5,'May'),(6,'June'),(7,'July'),(8,'August'),(9,'September'),(10,'October'),(11,'November'),(12,'December');
/*!40000 ALTER TABLE `tbl_months` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_mpesa_payments`
--

DROP TABLE IF EXISTS `tbl_mpesa_payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_mpesa_payments` (
  `auto_id` varchar(36) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `TransactionType` varchar(40) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `TransID` varchar(40) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `TransTime` datetime DEFAULT NULL,
  `TransAmount` decimal(10,2) DEFAULT NULL,
  `BusinessShortCode` varchar(15) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `BillRefNumber` varchar(40) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `InvoiceNumber` varchar(40) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `ThirdPartyTransID` varchar(40) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `MSISDN` varchar(36) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `FirstName` varchar(60) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `MiddleName` varchar(60) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `LastName` varchar(60) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `OrgAccountBalance` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`auto_id`,`TransID`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_mpesa_payments`
--

LOCK TABLES `tbl_mpesa_payments` WRITE;
/*!40000 ALTER TABLE `tbl_mpesa_payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_mpesa_payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_mpesa_payments_failed`
--

DROP TABLE IF EXISTS `tbl_mpesa_payments_failed`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_mpesa_payments_failed` (
  `auto_id` varchar(36) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `TransactionType` varchar(40) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `TransID` varchar(40) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `TransTime` varchar(40) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `TransAmount` decimal(10,2) DEFAULT NULL,
  `BusinessShortCode` varchar(15) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `BillRefNumber` varchar(40) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `InvoiceNumber` varchar(40) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `ThirdPartyTransID` varchar(40) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `MSISDN` varchar(36) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `FirstName` varchar(60) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `MiddleName` varchar(60) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `LastName` varchar(60) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `OrgAccountBalance` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`auto_id`,`TransID`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_mpesa_payments_failed`
--

LOCK TABLES `tbl_mpesa_payments_failed` WRITE;
/*!40000 ALTER TABLE `tbl_mpesa_payments_failed` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_mpesa_payments_failed` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_nearby_facilities`
--

DROP TABLE IF EXISTS `tbl_nearby_facilities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_nearby_facilities` (
  `facility_id` varchar(36) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `property_code` varchar(6) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `facility_type` enum('Education','Health & Medical','Food','Others') CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `facility_name` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `facility_description` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  PRIMARY KEY (`facility_id`) USING BTREE,
  KEY `property_code` (`property_code`) USING BTREE,
  CONSTRAINT `tbl_nearby_facilities_ibfk_1` FOREIGN KEY (`property_code`) REFERENCES `tbl_properties` (`property_code`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_nearby_facilities`
--

LOCK TABLES `tbl_nearby_facilities` WRITE;
/*!40000 ALTER TABLE `tbl_nearby_facilities` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_nearby_facilities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_packages`
--

DROP TABLE IF EXISTS `tbl_packages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_packages` (
  `package_id` varchar(36) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `package_name` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `package_rate` decimal(10,2) NOT NULL,
  `maximum_properties` int DEFAULT NULL,
  `maximum_units` int NOT NULL,
  `free_sms_units` int NOT NULL DEFAULT '0',
  `display_class` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT '.bg-info',
  `table_classes` varchar(255) DEFAULT NULL,
  `recursive` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`package_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_packages`
--

LOCK TABLES `tbl_packages` WRITE;
/*!40000 ALTER TABLE `tbl_packages` DISABLE KEYS */;
INSERT INTO `tbl_packages` VALUES ('e0h3gvar4hkh','STANDARD',2500.00,5,50,1000,'btn-danger','border-right-0 border-right-md border-bottom border-bottom-md-0',1),('r0frmjhy5yzp','STARTER',1800.00,2,60,500,'btn-success',' border-right-0 border-right-xxl border-bottom border-bottom-xxl-0',1),('tcik513xafri','PREMIUM',4000.00,10,100,1500,'btn-warning',' ',1),('vy0is4ez65sq','DEMO',0.00,2,20,100,'btn-primary','border-right-0 border-right-md border-bottom border-bottom-xxl-0',0);
/*!40000 ALTER TABLE `tbl_packages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_properties`
--

DROP TABLE IF EXISTS `tbl_properties`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_properties` (
  `property_code` varchar(6) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `user_code` varchar(36) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `property_name` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `locality_id` int NOT NULL,
  `property_description` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `street_address` varchar(180) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `area_size` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `property_type` enum('Resdential','Business-Stalls','Business-Offices','Mixed') CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `unit_types` enum('Single Rooms','Bedsitters','One Bedrooms','Two Bedrooms','Three Bedrooms','Four Bedrooms','Mixed','Others') CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `flat_roof` tinyint(1) NOT NULL DEFAULT '0',
  `year_built` int NOT NULL,
  `floors` int DEFAULT '1',
  `has_cctv` tinyint(1) NOT NULL DEFAULT '0',
  `pet_friendly` tinyint(1) NOT NULL DEFAULT '0',
  `has_garden` tinyint(1) NOT NULL DEFAULT '0',
  `has_parking` tinyint(1) NOT NULL DEFAULT '0',
  `has_swimming_pool` tinyint(1) NOT NULL DEFAULT '0',
  `has_alarm` tinyint(1) NOT NULL DEFAULT '0',
  `has_generator` tinyint(1) NOT NULL DEFAULT '0',
  `disability_features` tinyint(1) NOT NULL DEFAULT '0',
  `has_lift` tinyint(1) NOT NULL DEFAULT '0',
  `sms_notifications` tinyint(1) NOT NULL DEFAULT '1',
  `email_notifications` tinyint(1) NOT NULL DEFAULT '1',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `is_verified` tinyint(1) NOT NULL DEFAULT '0',
  `default_color` varchar(20) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `payment_methods` mediumtext,
  `readable_meters` mediumtext,
  `latitude` varchar(30) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT '0',
  `longitude` varchar(30) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT '0',
  PRIMARY KEY (`property_code`) USING BTREE,
  KEY `user_code` (`user_code`) USING BTREE,
  KEY `locality_code` (`locality_id`) USING BTREE,
  CONSTRAINT `tbl_properties_ibfk_1` FOREIGN KEY (`user_code`) REFERENCES `tbl_users` (`user_code`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `tbl_properties_ibfk_2` FOREIGN KEY (`locality_id`) REFERENCES `tbl_localities` (`locality_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_properties`
--

LOCK TABLES `tbl_properties` WRITE;
/*!40000 ALTER TABLE `tbl_properties` DISABLE KEYS */;
INSERT INTO `tbl_properties` VALUES ('3EJAXQ','768afb88-69ce-401d-b8b2-712fd235a11d','MY SECOND APARTMENT',2,'this si the second apartment','Upper Chokaa, Nairobi, 6818, Kenya',NULL,'Resdential','Single Rooms',0,2002,3,1,0,0,0,1,0,0,0,0,1,1,1,0,'#255ca5',NULL,NULL,NULL,'0','0'),('CZCS1V','768afb88-69ce-401d-b8b2-712fd235a11d','MY AWESOME PROPERTY',1,'this is avery awesome property for me','Meru, East Kenya, Kenya',NULL,'Resdential','Mixed',0,2018,4,1,0,0,0,1,0,0,0,1,1,1,1,0,'#a9a2a4','','[]','[{\"Meter Name\":\"water\",\"Rate\":\"1111\"},{\"Meter Name\":\"Gas\",\"Rate\":\"456\"}]','-0.023559','37.906193'),('JPW6PL','ce96d023-96b9-4a62-a2b0-4e566092917e','MY AWESOME PROPERTY',1,'this is very secure property in ngong with modern features','Hina Flats, Riverside Westlands Lane, Westlands, Nairobi, 97104, Kenya',NULL,'Resdential','Two Bedrooms',0,2012,4,0,0,0,0,0,0,0,0,0,0,0,1,0,'#265639','','[{\"Payment Mode\":\"KCB\",\"Payment Instructions\":\"0787656777\"}]','[{\"Meter Name\":\"Water\",\"Rate\":\"150\"}]','-1.2681216','36.8017408'),('TRNPLQ','7701882d-1592-4706-ac8a-9205c949bc73','ALBOOM FLATS',2,'this is a serene property a few meters away from the road','Koma Rock, Nairobi, 6818, Kenya',NULL,'Resdential','Mixed',0,2002,4,0,0,0,1,0,0,0,0,1,1,1,1,0,'#248671',NULL,NULL,NULL,'-1.2512226','36.9443143');
/*!40000 ALTER TABLE `tbl_properties` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_property_images`
--

DROP TABLE IF EXISTS `tbl_property_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_property_images` (
  `image_id` varchar(36) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `property_code` varchar(6) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `image_description` varchar(255) DEFAULT NULL,
  `is_default` tinyint(1) NOT NULL DEFAULT '0',
  `date_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`image_id`) USING BTREE,
  KEY `property_code` (`property_code`) USING BTREE,
  CONSTRAINT `tbl_property_images_ibfk_1` FOREIGN KEY (`property_code`) REFERENCES `tbl_properties` (`property_code`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_property_images`
--

LOCK TABLES `tbl_property_images` WRITE;
/*!40000 ALTER TABLE `tbl_property_images` DISABLE KEYS */;
INSERT INTO `tbl_property_images` VALUES ('08cbe8fb-01cf-4e7e-bb0e-865eec4f20b7','JPW6PL','main entrance',0,'2021-10-01 12:44:42'),('7ac4a8c6-31e6-423d-a514-8e94d7de5453','JPW6PL','backside',0,'2021-10-01 12:44:54'),('b03aa504-1618-4f00-b1de-52f07b3a9ac3','CZCS1V',NULL,1,'2021-10-16 06:53:11'),('bf1d6ad6-d12d-4bbe-9865-aa1aa0d67bd8','CZCS1V','hillside view',0,'2021-10-16 06:48:34'),('c3cd7fc9-59a7-41f7-a227-715e5d76da45','CZCS1V','',0,'2021-10-16 06:15:46');
/*!40000 ALTER TABLE `tbl_property_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_property_own_requests`
--

DROP TABLE IF EXISTS `tbl_property_own_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_property_own_requests` (
  `request_id` int NOT NULL AUTO_INCREMENT,
  `date_requested` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `user_code` varchar(36) NOT NULL,
  `approved` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`request_id`),
  KEY `user_code` (`user_code`),
  CONSTRAINT `tbl_property_own_requests_ibfk_1` FOREIGN KEY (`user_code`) REFERENCES `tbl_users` (`user_code`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_property_own_requests`
--

LOCK TABLES `tbl_property_own_requests` WRITE;
/*!40000 ALTER TABLE `tbl_property_own_requests` DISABLE KEYS */;
INSERT INTO `tbl_property_own_requests` VALUES (1,'2021-11-10 14:09:31','28d712c6-72cb-45e2-bec2-750c8a79bcdf',0),(2,'2021-11-10 17:26:07','768afb88-69ce-401d-b8b2-712fd235a11d',0),(3,'2021-11-11 05:13:42','d5e060cb-cc1e-4b61-a5b3-a932a9ea0001',0);
/*!40000 ALTER TABLE `tbl_property_own_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_property_user_roles`
--

DROP TABLE IF EXISTS `tbl_property_user_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_property_user_roles` (
  `role_id` int NOT NULL AUTO_INCREMENT,
  `role_name` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `user_code` varchar(36) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `manage_tenants` tinyint(1) NOT NULL DEFAULT '0',
  `manage_units` tinyint(1) NOT NULL DEFAULT '0',
  `manage_payments` tinyint(1) NOT NULL DEFAULT '0',
  `meter_readings` tinyint(1) NOT NULL DEFAULT '0',
  `manage_expenses` tinyint(1) NOT NULL DEFAULT '0',
  `manage_images` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`role_id`) USING BTREE,
  KEY `property_code` (`user_code`) USING BTREE,
  CONSTRAINT `tbl_property_user_roles_ibfk_1` FOREIGN KEY (`user_code`) REFERENCES `tbl_users` (`user_code`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_property_user_roles`
--

LOCK TABLES `tbl_property_user_roles` WRITE;
/*!40000 ALTER TABLE `tbl_property_user_roles` DISABLE KEYS */;
INSERT INTO `tbl_property_user_roles` VALUES (1,'Agents','ce96d023-96b9-4a62-a2b0-4e566092917e',1,1,1,1,1,1),(2,'Agent','768afb88-69ce-401d-b8b2-712fd235a11d',1,1,0,0,0,0),(3,'Admins','768afb88-69ce-401d-b8b2-712fd235a11d',1,1,1,1,1,1);
/*!40000 ALTER TABLE `tbl_property_user_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_property_users`
--

DROP TABLE IF EXISTS `tbl_property_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_property_users` (
  `manager_id` varchar(36) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `email_address` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `phone_number` varchar(12) DEFAULT NULL,
  `first_name` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `last_name` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `role_id` int NOT NULL,
  `property_code` varchar(400) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `account_active` tinyint(1) NOT NULL DEFAULT '1',
  `added_on` datetime NOT NULL,
  `user_code` varchar(36) NOT NULL,
  PRIMARY KEY (`manager_id`) USING BTREE,
  KEY `role_id` (`role_id`) USING BTREE,
  KEY `property_code` (`property_code`) USING BTREE,
  KEY `user_code` (`user_code`),
  CONSTRAINT `tbl_property_users_ibfk_4` FOREIGN KEY (`user_code`) REFERENCES `tbl_users` (`user_code`),
  CONSTRAINT `tbl_property_users_ibfk_5` FOREIGN KEY (`role_id`) REFERENCES `tbl_property_user_roles` (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_property_users`
--

LOCK TABLES `tbl_property_users` WRITE;
/*!40000 ALTER TABLE `tbl_property_users` DISABLE KEYS */;
INSERT INTO `tbl_property_users` VALUES ('9adc4257-6f40-4a02-8a13-9624fd372856','albert.omwega.17@gmail.com','0711223639','Albert','Omwega',1,'JPW6PL',1,'2021-10-04 15:42:05','ce96d023-96b9-4a62-a2b0-4e566092917e'),('eec15af9-b0db-4fb5-9862-53237dc95e09','alboomdj@gmail.com','0700888999','omwega','omwega',2,'3EJAXQ,CZCS1V',1,'2021-11-04 08:02:59','768afb88-69ce-401d-b8b2-712fd235a11d');
/*!40000 ALTER TABLE `tbl_property_users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_referal_codes`
--

DROP TABLE IF EXISTS `tbl_referal_codes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_referal_codes` (
  `referal_code` varchar(6) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `user_code` varchar(36) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  PRIMARY KEY (`referal_code`) USING BTREE,
  KEY `user_code` (`user_code`) USING BTREE,
  CONSTRAINT `tbl_referal_codes_ibfk_1` FOREIGN KEY (`user_code`) REFERENCES `tbl_users` (`user_code`) ON DELETE SET NULL ON UPDATE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_referal_codes`
--

LOCK TABLES `tbl_referal_codes` WRITE;
/*!40000 ALTER TABLE `tbl_referal_codes` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_referal_codes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_sales_reps`
--

DROP TABLE IF EXISTS `tbl_sales_reps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_sales_reps` (
  `user_code` varchar(36) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `username` varchar(36) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `email_address` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `email_verified` tinyint(1) NOT NULL DEFAULT '0',
  `phone_number` int NOT NULL,
  `phone_verified` tinyint(1) NOT NULL DEFAULT '0',
  `first_name` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `last_name` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `other_names` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `avatar_path` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `last_success_login` datetime DEFAULT NULL,
  `password_change_required` tinyint(1) NOT NULL DEFAULT '0',
  `email_verification` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `email_verification_expire` datetime DEFAULT NULL,
  `account_active` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`username`,`user_code`,`email_address`) USING BTREE,
  KEY `user_code` (`user_code`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_sales_reps`
--

LOCK TABLES `tbl_sales_reps` WRITE;
/*!40000 ALTER TABLE `tbl_sales_reps` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_sales_reps` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_sms_message_codes`
--

DROP TABLE IF EXISTS `tbl_sms_message_codes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_sms_message_codes` (
  `code_id` int NOT NULL,
  `description` varchar(255) NOT NULL,
  `message_prefix` varchar(255) NOT NULL,
  PRIMARY KEY (`code_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_sms_message_codes`
--

LOCK TABLES `tbl_sms_message_codes` WRITE;
/*!40000 ALTER TABLE `tbl_sms_message_codes` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_sms_message_codes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_subscriptions`
--

DROP TABLE IF EXISTS `tbl_subscriptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_subscriptions` (
  `subscription_id` varchar(36) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `user_code` varchar(36) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `package_id` varchar(36) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `subscription_date` date NOT NULL,
  `expiry_date` date NOT NULL,
  PRIMARY KEY (`subscription_id`) USING BTREE,
  KEY `user_code` (`user_code`) USING BTREE,
  KEY `package_id` (`package_id`) USING BTREE,
  CONSTRAINT `tbl_subscriptions_ibfk_1` FOREIGN KEY (`user_code`) REFERENCES `tbl_users` (`user_code`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `tbl_subscriptions_ibfk_2` FOREIGN KEY (`package_id`) REFERENCES `tbl_packages` (`package_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_subscriptions`
--

LOCK TABLES `tbl_subscriptions` WRITE;
/*!40000 ALTER TABLE `tbl_subscriptions` DISABLE KEYS */;
INSERT INTO `tbl_subscriptions` VALUES ('a407befb-3cc3-4646-aaaf-aa631a1de1dc','7701882d-1592-4706-ac8a-9205c949bc73','vy0is4ez65sq','2021-11-21','2021-10-09'),('d0c38f00-df4e-49a4-b4eb-70f5bc1081a4','768afb88-69ce-401d-b8b2-712fd235a11d','vy0is4ez65sq','2021-11-23','2021-11-21'),('d1a8e44c-f1cb-4ed6-afd4-6f57817cd325','ce96d023-96b9-4a62-a2b0-4e566092917e','vy0is4ez65sq','2021-11-21','2021-10-09');
/*!40000 ALTER TABLE `tbl_subscriptions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_subscriptions_payments`
--

DROP TABLE IF EXISTS `tbl_subscriptions_payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_subscriptions_payments` (
  `payment_id` varchar(36) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `payment_date` datetime NOT NULL,
  `payment_method` enum('Cash','M-PESA','Card Swipe','Bank Deposit','Bank Transfer','Cheque') CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT 'Cash',
  `payment_amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `payment_ref` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `payment_by` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `subscription_id` varchar(36) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  PRIMARY KEY (`payment_id`) USING BTREE,
  KEY `subscription_id` (`subscription_id`) USING BTREE,
  CONSTRAINT `tbl_subscriptions_payments_ibfk_2` FOREIGN KEY (`subscription_id`) REFERENCES `tbl_subscriptions` (`subscription_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_subscriptions_payments`
--

LOCK TABLES `tbl_subscriptions_payments` WRITE;
/*!40000 ALTER TABLE `tbl_subscriptions_payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_subscriptions_payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_subscriptions_sms_payments`
--

DROP TABLE IF EXISTS `tbl_subscriptions_sms_payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_subscriptions_sms_payments` (
  `payment_id` varchar(36) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `payment_ref` varchar(36) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `payment_date` date NOT NULL,
  `payment_amount` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`payment_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_subscriptions_sms_payments`
--

LOCK TABLES `tbl_subscriptions_sms_payments` WRITE;
/*!40000 ALTER TABLE `tbl_subscriptions_sms_payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_subscriptions_sms_payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_suppliers`
--

DROP TABLE IF EXISTS `tbl_suppliers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_suppliers` (
  `supplier_code` varchar(36) NOT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `company_name` varchar(255) DEFAULT NULL,
  `email_address` varchar(255) DEFAULT NULL,
  `phone_number` varchar(12) DEFAULT NULL,
  `supplier_type` enum('Individual','Company') NOT NULL DEFAULT 'Individual',
  `address` varchar(400) DEFAULT NULL,
  `bank_acc_no` varchar(100) DEFAULT NULL,
  `bank_acc_name` varchar(255) DEFAULT NULL,
  `bank_acc_branch` varchar(255) DEFAULT NULL,
  `bank_name` varchar(255) DEFAULT NULL,
  `kra_pin` varchar(15) DEFAULT NULL,
  `added_on` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `user_code` varchar(36) NOT NULL,
  PRIMARY KEY (`supplier_code`),
  KEY `user_code` (`user_code`),
  CONSTRAINT `tbl_suppliers_ibfk_1` FOREIGN KEY (`user_code`) REFERENCES `tbl_users` (`user_code`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_suppliers`
--

LOCK TABLES `tbl_suppliers` WRITE;
/*!40000 ALTER TABLE `tbl_suppliers` DISABLE KEYS */;
INSERT INTO `tbl_suppliers` VALUES ('420fc2b6-c9a0-4626-9311-98c0bb3dd5e8','jones','zontes',NULL,'joneszontez@gmail.com','0711223639','Company',NULL,NULL,NULL,NULL,NULL,NULL,'2021-10-30 00:43:40','768afb88-69ce-401d-b8b2-712fd235a11d');
/*!40000 ALTER TABLE `tbl_suppliers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_tenant_bills`
--

DROP TABLE IF EXISTS `tbl_tenant_bills`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_tenant_bills` (
  `bill_id` varchar(36) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `bill_code` varchar(10) NOT NULL,
  `unit_code` varchar(36) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `bill_date` date NOT NULL,
  `due_date` date NOT NULL,
  `tenant_id` varchar(36) NOT NULL,
  `is_cancelled` tinyint unsigned NOT NULL DEFAULT '0',
  `cancel_reasons` varchar(255) DEFAULT NULL,
  `lease_id` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`bill_id`) USING BTREE,
  UNIQUE KEY `bill_code` (`bill_code`),
  KEY `unit_code` (`unit_code`),
  KEY `tenant_id` (`tenant_id`),
  CONSTRAINT `tbl_tenant_bills_ibfk_1` FOREIGN KEY (`unit_code`) REFERENCES `tbl_units` (`unit_code`),
  CONSTRAINT `tbl_tenant_bills_ibfk_2` FOREIGN KEY (`tenant_id`) REFERENCES `tbl_tenants` (`tenant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_tenant_bills`
--

LOCK TABLES `tbl_tenant_bills` WRITE;
/*!40000 ALTER TABLE `tbl_tenant_bills` DISABLE KEYS */;
INSERT INTO `tbl_tenant_bills` VALUES ('3ddbe925-045a-4fc3-a639-a58ccfe84ebf','L19XGZ7QXW','4cbfec6f-8634-4edc-976e-9d26bab0685e','2021-11-12','2021-11-12','46dd9529-a844-4f0b-83f8-2a55dc80ac21',0,NULL,NULL),('450c575a-0fd7-4ea5-8ae4-edab57ed2d51','6AY3100DRB','c637f5ab-4ab7-4b8c-ae82-6abf6be92a52','2021-11-09','2021-11-09','cab149bb-5a20-4919-a293-f272a45e8ec4',0,NULL,'9f018b70-2da9-4ac2-aae0-df1752fd77fb'),('63ffbd78-87c3-4bf5-ad05-e8e2bd0136b9','VN0SXA61OJ','95eb3adc-1805-49ae-bcd0-e6cfbbddc834','2021-10-01','2021-10-01','79f492a1-6ca5-48b3-8d85-26c76ebff818',0,NULL,NULL),('7e8bdc5e-ba91-49c4-b235-5fb8d28c1c4a','OEKCIOUR8Z','27b78bad-c278-4023-8de0-983d0782c9f7','2021-10-04','2021-10-04','0d450cc4-2b8d-425f-b015-9d6aa60013e4',0,NULL,NULL),('99d68059-3fa6-464a-8060-5bbf9e3ad908','HDL842FSOT','356f33f3-2548-4086-9923-c75e81ed3f04','2021-11-12','2021-11-12','46dd9529-a844-4f0b-83f8-2a55dc80ac21',0,NULL,NULL),('e2668845-4e24-4eaf-a7be-893188b9e393','EE3AWC3P8J','caddcae2-b69c-4f5a-b371-d7aeb7a328f5','2021-11-12','2021-11-12','cab149bb-5a20-4919-a293-f272a45e8ec4',0,NULL,NULL),('e9a23f33-28ca-4a7d-b1f4-be6fa1fdccd6','HHJRE47UIY','48cb0670-845e-4e50-a086-78b7739dcdb8','2021-11-12','2021-11-12','46dd9529-a844-4f0b-83f8-2a55dc80ac21',0,NULL,NULL);
/*!40000 ALTER TABLE `tbl_tenant_bills` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_tenant_bills_breakdown`
--

DROP TABLE IF EXISTS `tbl_tenant_bills_breakdown`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_tenant_bills_breakdown` (
  `id` int NOT NULL AUTO_INCREMENT,
  `bill_id` varchar(36) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `bill_name` varchar(255) NOT NULL,
  `bill_amount` decimal(10,0) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `bill_code` (`bill_id`),
  CONSTRAINT `tbl_tenant_bills_breakdown_ibfk_1` FOREIGN KEY (`bill_id`) REFERENCES `tbl_tenant_bills` (`bill_id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_tenant_bills_breakdown`
--

LOCK TABLES `tbl_tenant_bills_breakdown` WRITE;
/*!40000 ALTER TABLE `tbl_tenant_bills_breakdown` DISABLE KEYS */;
INSERT INTO `tbl_tenant_bills_breakdown` VALUES (1,'63ffbd78-87c3-4bf5-ad05-e8e2bd0136b9','Rent October',9800),(2,'63ffbd78-87c3-4bf5-ad05-e8e2bd0136b9',' ROOM Deposit',12000),(3,'63ffbd78-87c3-4bf5-ad05-e8e2bd0136b9',' WATER Deposit',2500),(4,'63ffbd78-87c3-4bf5-ad05-e8e2bd0136b9','internet October',1500),(5,'63ffbd78-87c3-4bf5-ad05-e8e2bd0136b9','security October',300),(6,'63ffbd78-87c3-4bf5-ad05-e8e2bd0136b9','garbage October',250),(7,'7e8bdc5e-ba91-49c4-b235-5fb8d28c1c4a','Rent October',12000),(8,'7e8bdc5e-ba91-49c4-b235-5fb8d28c1c4a',' ROOM Deposit',11000),(9,'7e8bdc5e-ba91-49c4-b235-5fb8d28c1c4a','garbage October',250),(10,'7e8bdc5e-ba91-49c4-b235-5fb8d28c1c4a','security October',400),(11,'450c575a-0fd7-4ea5-8ae4-edab57ed2d51','room painting',4500),(12,'99d68059-3fa6-464a-8060-5bbf9e3ad908','Rent November',6789),(13,'99d68059-3fa6-464a-8060-5bbf9e3ad908',' Agreement Fee Deposit',1000),(14,'99d68059-3fa6-464a-8060-5bbf9e3ad908',' Water Deposit Deposit',1500),(15,'99d68059-3fa6-464a-8060-5bbf9e3ad908',' Room Deposit Deposit',12000),(16,'99d68059-3fa6-464a-8060-5bbf9e3ad908','Garbage November',400),(17,'99d68059-3fa6-464a-8060-5bbf9e3ad908','Security November',300),(18,'99d68059-3fa6-464a-8060-5bbf9e3ad908','Internet November',2500),(19,'e9a23f33-28ca-4a7d-b1f4-be6fa1fdccd6','Rent November',1700),(20,'e9a23f33-28ca-4a7d-b1f4-be6fa1fdccd6',' ROOM Deposit',17000),(21,'e9a23f33-28ca-4a7d-b1f4-be6fa1fdccd6',' WATER Deposit',2500),(22,'e9a23f33-28ca-4a7d-b1f4-be6fa1fdccd6','SECURITY November',200),(23,'3ddbe925-045a-4fc3-a639-a58ccfe84ebf','Rent November',12000),(24,'3ddbe925-045a-4fc3-a639-a58ccfe84ebf',' Agreement Fee Deposit',1000),(25,'3ddbe925-045a-4fc3-a639-a58ccfe84ebf',' Water Deposit Deposit',1500),(26,'3ddbe925-045a-4fc3-a639-a58ccfe84ebf',' Room Deposit Deposit',12000),(27,'3ddbe925-045a-4fc3-a639-a58ccfe84ebf','Garbage November',400),(28,'3ddbe925-045a-4fc3-a639-a58ccfe84ebf','Security November',300),(29,'3ddbe925-045a-4fc3-a639-a58ccfe84ebf','Internet November',2500),(30,'e2668845-4e24-4eaf-a7be-893188b9e393','Rent November',12000),(31,'e2668845-4e24-4eaf-a7be-893188b9e393',' Agreement Fee Deposit',1000),(32,'e2668845-4e24-4eaf-a7be-893188b9e393',' Water Deposit Deposit',1500),(33,'e2668845-4e24-4eaf-a7be-893188b9e393',' Room Deposit Deposit',12000),(34,'e2668845-4e24-4eaf-a7be-893188b9e393','Garbage November',400),(35,'e2668845-4e24-4eaf-a7be-893188b9e393','Security November',300),(36,'e2668845-4e24-4eaf-a7be-893188b9e393','Internet November',2500);
/*!40000 ALTER TABLE `tbl_tenant_bills_breakdown` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_tenant_bills_payments`
--

DROP TABLE IF EXISTS `tbl_tenant_bills_payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_tenant_bills_payments` (
  `payment_id` varchar(36) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `payment_date` datetime NOT NULL,
  `payment_method` enum('Cash','M-PESA','Card Swipe','Bank Deposit','Bank Transfer','Cheque','Other') CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT 'Cash',
  `payment_amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `payment_ref` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `payment_by` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `recorded_by` varchar(36) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `bill_id` varchar(36) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `manually_entered` tinyint(1) NOT NULL DEFAULT '1',
  `is_cancelled` tinyint(1) NOT NULL DEFAULT '0',
  `cancel_reasons` varchar(255) DEFAULT NULL,
  `cancelled_by` varchar(36) DEFAULT NULL,
  `cancel_date` datetime DEFAULT NULL,
  PRIMARY KEY (`payment_id`) USING BTREE,
  KEY `recorded_by` (`recorded_by`) USING BTREE,
  KEY `bill_id` (`bill_id`) USING BTREE,
  CONSTRAINT `tbl_tenant_bills_payments_ibfk_1` FOREIGN KEY (`bill_id`) REFERENCES `tbl_tenant_bills` (`bill_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_tenant_bills_payments`
--

LOCK TABLES `tbl_tenant_bills_payments` WRITE;
/*!40000 ALTER TABLE `tbl_tenant_bills_payments` DISABLE KEYS */;
INSERT INTO `tbl_tenant_bills_payments` VALUES ('1904745d-ff6b-41be-8201-142008ad4c37','2021-11-13 00:00:00','Cash',1400.00,'N/A','Albert Omwega','768afb88-69ce-401d-b8b2-712fd235a11d','e9a23f33-28ca-4a7d-b1f4-be6fa1fdccd6',1,0,NULL,NULL,NULL),('1a5c7cfa-e23e-47d3-859d-4268c3d10f23','2021-11-13 00:00:00','Cash',1400.00,'N/A','Albert Omwega','768afb88-69ce-401d-b8b2-712fd235a11d','e9a23f33-28ca-4a7d-b1f4-be6fa1fdccd6',1,0,NULL,NULL,NULL),('1e5ad4a1-30e9-46ba-9966-5c22fd89c3c1','2021-10-01 00:00:00','M-PESA',26350.00,'PTY67YUUYY','Charles Boen','ce96d023-96b9-4a62-a2b0-4e566092917e','63ffbd78-87c3-4bf5-ad05-e8e2bd0136b9',1,0,NULL,NULL,NULL),('ead876b5-2ed7-4821-a027-bcfc048ac7c1','2021-11-09 00:00:00','Cash',1500.00,'N/A','Omwegaaa Tenant','768afb88-69ce-401d-b8b2-712fd235a11d','450c575a-0fd7-4ea5-8ae4-edab57ed2d51',1,0,NULL,NULL,NULL);
/*!40000 ALTER TABLE `tbl_tenant_bills_payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_tenants`
--

DROP TABLE IF EXISTS `tbl_tenants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_tenants` (
  `tenant_id` varchar(36) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `gender` enum('Male','Female','Other') CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT 'Male',
  `first_name` varchar(30) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `last_name` varchar(30) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `company_name` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `id_number` varchar(10) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT '',
  `phone_number` varchar(12) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT '',
  `alt_phone_number` varchar(12) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT '',
  `email_address` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `nationality` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT 'Kenyan',
  `image_path` varchar(400) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `next_of_kins` mediumtext,
  `id_front_path` varchar(255) DEFAULT NULL,
  `id_back_path` varchar(255) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `property_code` varchar(36) NOT NULL,
  `created_on` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `default_color` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`tenant_id`) USING BTREE,
  KEY `property_code` (`property_code`),
  CONSTRAINT `tbl_tenants_ibfk_1` FOREIGN KEY (`property_code`) REFERENCES `tbl_properties` (`property_code`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_tenants`
--

LOCK TABLES `tbl_tenants` WRITE;
/*!40000 ALTER TABLE `tbl_tenants` DISABLE KEYS */;
INSERT INTO `tbl_tenants` VALUES ('0d450cc4-2b8d-425f-b015-9d6aa60013e4','Male','Paweja','Client',NULL,'','','','paweja1730@mxgsby.com','Kenyan',NULL,'[]',NULL,NULL,'2003-10-04','TRNPLQ','2021-10-04 19:44:12','#5354cd'),('2f82739a-daf4-43b7-a99c-d4cf1ad165b6','Male','Albert','Omwega',NULL,'31998352','0711223639','','','Kenyan',NULL,'[]',NULL,NULL,'2003-10-01','TRNPLQ','2021-10-01 08:08:46','#b7913b'),('46dd9529-a844-4f0b-83f8-2a55dc80ac21','Male','Albert','Omwega',NULL,'31998352','0711223639','','alboomdj@gmail.com','Kenyan',NULL,'[]',NULL,NULL,'2003-11-01','CZCS1V','2021-11-01 13:28:47','#12a9da'),('79f492a1-6ca5-48b3-8d85-26c76ebff818','Male','Charles','Boen',NULL,'31889900','0722591434','','','Kenyan',NULL,'[{\"Name\":\"KASEE\",\"Phone Number\":\"0750888999\",\"Relationship\":\"SON\"}]',NULL,NULL,'2003-10-01','JPW6PL','2021-10-01 12:47:57','#413737'),('cab149bb-5a20-4919-a293-f272a45e8ec4','Male','Omwegaaa','Tenant',NULL,'','0711223639','','','Kenyan',NULL,'[]',NULL,NULL,'2003-10-16','CZCS1V','2021-10-16 17:42:41','#098129');
/*!40000 ALTER TABLE `tbl_tenants` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_tenants_ratings`
--

DROP TABLE IF EXISTS `tbl_tenants_ratings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_tenants_ratings` (
  `rating_id` varchar(36) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `unit_code` varchar(36) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `user_rating` int NOT NULL DEFAULT '5',
  `user_comments` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `tenant_id` varchar(36) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `user_code` varchar(36) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `rating_approved` tinyint(1) NOT NULL DEFAULT '0',
  `rating_date` datetime NOT NULL,
  PRIMARY KEY (`rating_id`) USING BTREE,
  KEY `unit_code` (`unit_code`) USING BTREE,
  KEY `user_code` (`user_code`) USING BTREE,
  KEY `tenant_id` (`tenant_id`) USING BTREE,
  CONSTRAINT `tbl_tenants_ratings_ibfk_1` FOREIGN KEY (`unit_code`) REFERENCES `tbl_units` (`unit_code`) ON DELETE SET NULL ON UPDATE SET NULL,
  CONSTRAINT `tbl_tenants_ratings_ibfk_2` FOREIGN KEY (`tenant_id`) REFERENCES `tbl_users` (`user_code`) ON DELETE SET NULL ON UPDATE SET NULL,
  CONSTRAINT `tbl_tenants_ratings_ibfk_3` FOREIGN KEY (`user_code`) REFERENCES `tbl_users` (`user_code`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_tenants_ratings`
--

LOCK TABLES `tbl_tenants_ratings` WRITE;
/*!40000 ALTER TABLE `tbl_tenants_ratings` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_tenants_ratings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_unit_rents`
--

DROP TABLE IF EXISTS `tbl_unit_rents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_unit_rents` (
  `unit_code` varchar(36) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `rent_amount` double(10,0) NOT NULL DEFAULT '0',
  `effective_from` date NOT NULL,
  `effective_to` date DEFAULT NULL,
  KEY `unit_code` (`unit_code`),
  CONSTRAINT `tbl_unit_rents_ibfk_1` FOREIGN KEY (`unit_code`) REFERENCES `tbl_units` (`unit_code`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_unit_rents`
--

LOCK TABLES `tbl_unit_rents` WRITE;
/*!40000 ALTER TABLE `tbl_unit_rents` DISABLE KEYS */;
INSERT INTO `tbl_unit_rents` VALUES ('2e8a50b1-2eaf-4dae-b1f9-1666d10e193f',12000,'2021-10-01',NULL),('27b78bad-c278-4023-8de0-983d0782c9f7',12000,'2021-10-01',NULL),('92b72dab-a214-4e9c-a523-09645946d2bf',12000,'2021-10-01',NULL),('509fd6c5-55e4-42a0-bba5-6b4bd6b56892',12000,'2021-10-01',NULL),('293bc724-1816-4749-9750-2a1efe328113',12000,'2021-10-01',NULL),('83fd9df1-a81a-4837-afb3-aef0d5265eb3',12000,'2021-10-01',NULL),('dcf28f7f-1e7f-4d2a-af91-62bf5b081c82',12000,'2021-10-01',NULL),('95eb3adc-1805-49ae-bcd0-e6cfbbddc834',12000,'2021-10-01',NULL),('405763f7-aa0a-4f68-bdca-494338fc1950',12000,'2021-10-01',NULL),('5a531c49-86fa-4ef6-8174-106c9667f810',12000,'2021-10-01',NULL),('a2dcce86-e271-418a-bca2-14c0f283c4b5',12000,'2021-10-01',NULL),('cbe647d1-b1a4-404f-a540-a291e857b87f',12000,'2021-10-01',NULL),('48cb0670-845e-4e50-a086-78b7739dcdb8',1700,'2021-10-13',NULL),('2988d7cc-2343-49f1-9170-141b0679086b',1700,'2021-10-13',NULL),('c637f5ab-4ab7-4b8c-ae82-6abf6be92a52',1700,'2021-10-13',NULL),('4cbfec6f-8634-4edc-976e-9d26bab0685e',12000,'2021-11-01',NULL),('961af8fa-1c48-4677-8d6a-ac7fce420bb1',12000,'2021-11-01',NULL),('caddcae2-b69c-4f5a-b371-d7aeb7a328f5',12000,'2021-11-01',NULL),('bd52398f-79e2-44ea-9f2f-05dbbcf6e85d',12000,'2021-11-01',NULL),('2e8a50b1-2eaf-4dae-b1f9-1666d10e193f',12000,'2021-10-01',NULL),('27b78bad-c278-4023-8de0-983d0782c9f7',12000,'2021-10-01',NULL),('92b72dab-a214-4e9c-a523-09645946d2bf',12000,'2021-10-01',NULL),('509fd6c5-55e4-42a0-bba5-6b4bd6b56892',12000,'2021-10-01',NULL),('293bc724-1816-4749-9750-2a1efe328113',12000,'2021-10-01',NULL),('83fd9df1-a81a-4837-afb3-aef0d5265eb3',12000,'2021-10-01',NULL),('dcf28f7f-1e7f-4d2a-af91-62bf5b081c82',12000,'2021-10-01',NULL),('95eb3adc-1805-49ae-bcd0-e6cfbbddc834',12000,'2021-10-01',NULL),('405763f7-aa0a-4f68-bdca-494338fc1950',12000,'2021-10-01',NULL),('5a531c49-86fa-4ef6-8174-106c9667f810',12000,'2021-10-01',NULL),('a2dcce86-e271-418a-bca2-14c0f283c4b5',12000,'2021-10-01',NULL),('cbe647d1-b1a4-404f-a540-a291e857b87f',12000,'2021-10-01',NULL),('48cb0670-845e-4e50-a086-78b7739dcdb8',1700,'2021-10-13',NULL),('2988d7cc-2343-49f1-9170-141b0679086b',1700,'2021-10-13',NULL),('c637f5ab-4ab7-4b8c-ae82-6abf6be92a52',1700,'2021-10-13',NULL),('4cbfec6f-8634-4edc-976e-9d26bab0685e',12000,'2021-11-01',NULL),('961af8fa-1c48-4677-8d6a-ac7fce420bb1',12000,'2021-11-01',NULL),('caddcae2-b69c-4f5a-b371-d7aeb7a328f5',12000,'2021-11-01',NULL),('bd52398f-79e2-44ea-9f2f-05dbbcf6e85d',12000,'2021-11-01',NULL);
/*!40000 ALTER TABLE `tbl_unit_rents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_units`
--

DROP TABLE IF EXISTS `tbl_units`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_units` (
  `unit_code` varchar(36) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `unit_name` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `property_code` varchar(6) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `floor` int NOT NULL DEFAULT '0',
  `garages` int NOT NULL DEFAULT '0',
  `bedrooms` int NOT NULL DEFAULT '0',
  `bathrooms` int NOT NULL DEFAULT '1',
  `payment_day` int NOT NULL DEFAULT '1',
  `unit_type` enum('Single Room','Bedsitter','One Bedroom','Two Bedroom','Three Bedroom','Four Bedroom','Five Bedroom','Six Bedroom','Studio','Shop','Office','Stall','Other') CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `electricity_type` enum('Prepaid/Tokens - Owner','Prepaid/Tokens - Shared','Postpaid - Owner','Postpaid - Shared','Not Available') CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `water_source` enum('Tap-Internal','Tap-External','Well/Borehole','Not Available/Outsource') CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `floor_type` enum('Ceramic Tiles','Terrazzo','Porcelain Tiles','Marble Tiles','Granite Tiles','Wooden Tiles','Hardwood','Polished Concrete','Traditional Concrete','Other') NOT NULL DEFAULT 'Traditional Concrete',
  `furnishing` enum('Not Furnished','Semi-Furnished','Full-Furnished') CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `payments_plan` enum('Daily','Weekly','Monthly','Quarterly','Semi-Annually','Annually') CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `internet_available` tinyint(1) NOT NULL DEFAULT '0',
  `tv_cable_available` tinyint(1) NOT NULL DEFAULT '0',
  `has_balcony` tinyint(1) NOT NULL DEFAULT '0',
  `has_laundry_room` tinyint(1) NOT NULL DEFAULT '0',
  `has_closet` tinyint(1) NOT NULL DEFAULT '0',
  `has_garden` tinyint(1) NOT NULL DEFAULT '0',
  `pet_friendly` tinyint(1) NOT NULL DEFAULT '0',
  `active_to_rent` tinyint(1) NOT NULL DEFAULT '1',
  `unit_deposits` mediumtext,
  `unit_fixed_bills` mediumtext,
  `unit_variable_bills` mediumtext,
  PRIMARY KEY (`unit_code`,`bedrooms`) USING BTREE,
  KEY `unit_code` (`unit_code`) USING BTREE,
  KEY `property_code` (`property_code`),
  CONSTRAINT `tbl_units_ibfk_1` FOREIGN KEY (`property_code`) REFERENCES `tbl_properties` (`property_code`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_units`
--

LOCK TABLES `tbl_units` WRITE;
/*!40000 ALTER TABLE `tbl_units` DISABLE KEYS */;
INSERT INTO `tbl_units` VALUES ('27b78bad-c278-4023-8de0-983d0782c9f7','A1','TRNPLQ',0,0,1,1,5,'One Bedroom','Prepaid/Tokens - Owner','Tap-Internal','Ceramic Tiles','Not Furnished','Daily',1,0,1,1,0,0,0,1,'[{\"Deposit Name\":\"ROOM\",\"Amount\":\"11000\"}]','[{\"Bill Name\":\"garbage\",\"Amount\":\"250\"},{\"Bill Name\":\"security\",\"Amount\":\"400\"}]',NULL),('293bc724-1816-4749-9750-2a1efe328113','A2','TRNPLQ',0,0,1,1,5,'One Bedroom','Prepaid/Tokens - Owner','Tap-Internal','Ceramic Tiles','Not Furnished','Daily',1,0,1,1,0,0,0,1,'[{\"Deposit Name\":\"ROOM\",\"Amount\":\"11000\"}]','[{\"Bill Name\":\"garbage\",\"Amount\":\"250\"},{\"Bill Name\":\"security\",\"Amount\":\"400\"}]',NULL),('2988d7cc-2343-49f1-9170-141b0679086b','A2','CZCS1V',0,0,1,1,10,'One Bedroom','Prepaid/Tokens - Owner','Tap-Internal','Ceramic Tiles','Not Furnished','Daily',1,0,1,0,0,0,0,1,'[{\"Deposit Name\":\"ROOM\",\"Amount\":\"17000\"},{\"Deposit Name\":\"WATER\",\"Amount\":\"2500\"}]','[{\"Bill Name\":\"SECURITY\",\"Amount\":\"200\"}]',NULL),('2e8a50b1-2eaf-4dae-b1f9-1666d10e193f','A3','TRNPLQ',0,0,1,1,5,'One Bedroom','Prepaid/Tokens - Owner','Tap-Internal','Ceramic Tiles','Not Furnished','Daily',1,0,1,1,0,0,0,1,'[{\"Deposit Name\":\"ROOM\",\"Amount\":\"11000\"}]','[{\"Bill Name\":\"garbage\",\"Amount\":\"250\"},{\"Bill Name\":\"security\",\"Amount\":\"400\"}]',NULL),('356f33f3-2548-4086-9923-c75e81ed3f04','B1','CZCS1V',1,1,1,1,8,'One Bedroom','Prepaid/Tokens - Owner','Tap-Internal','Ceramic Tiles','Not Furnished','Daily',1,0,0,0,0,0,0,1,'[{\"Deposit Name\":\"Agreement Fee\",\"Amount\":\"1000\"},{\"Deposit Name\":\"Water Deposit\",\"Amount\":\"1500\"},{\"Deposit Name\":\"Room Deposit\",\"Amount\":\"12000\"}]','[{\"Bill Name\":\"Garbage\",\"Amount\":\"400\"},{\"Bill Name\":\"Security\",\"Amount\":\"300\"},{\"Bill Name\":\"Internet\",\"Amount\":\"2500\"}]',NULL),('405763f7-aa0a-4f68-bdca-494338fc1950','A1','JPW6PL',0,0,2,1,10,'Two Bedroom','Prepaid/Tokens - Owner','Tap-Internal','Ceramic Tiles','Not Furnished','Daily',1,1,0,0,1,0,0,1,'[{\"Deposit Name\":\"ROOM\",\"Amount\":\"12000\"},{\"Deposit Name\":\"WATER\",\"Amount\":\"2500\"}]','[{\"Bill Name\":\"internet\",\"Amount\":\"2500\"},{\"Bill Name\":\"security\",\"Amount\":\"300\"},{\"Bill Name\":\"garbage\",\"Amount\":\"250\"}]',NULL),('48cb0670-845e-4e50-a086-78b7739dcdb8','A3','CZCS1V',0,0,1,1,10,'One Bedroom','Prepaid/Tokens - Owner','Tap-Internal','Ceramic Tiles','Not Furnished','Daily',1,0,1,0,0,0,0,1,'[{\"Deposit Name\":\"ROOM\",\"Amount\":\"17000\"},{\"Deposit Name\":\"WATER\",\"Amount\":\"2500\"}]','[{\"Bill Name\":\"SECURITY\",\"Amount\":\"200\"}]',NULL),('4cbfec6f-8634-4edc-976e-9d26bab0685e','B1','CZCS1V',1,0,1,0,8,'One Bedroom','Prepaid/Tokens - Owner','Tap-Internal','Ceramic Tiles','Not Furnished','Daily',1,0,0,0,0,0,0,1,'[{\"Deposit Name\":\"Agreement Fee\",\"Amount\":\"1000\"},{\"Deposit Name\":\"Water Deposit\",\"Amount\":\"1500\"},{\"Deposit Name\":\"Room Deposit\",\"Amount\":\"12000\"}]','[{\"Bill Name\":\"Garbage\",\"Amount\":\"400\"},{\"Bill Name\":\"Security\",\"Amount\":\"300\"},{\"Bill Name\":\"Internet\",\"Amount\":\"2500\"}]',NULL),('509fd6c5-55e4-42a0-bba5-6b4bd6b56892','A4','TRNPLQ',0,0,1,1,5,'One Bedroom','Prepaid/Tokens - Owner','Tap-Internal','Ceramic Tiles','Not Furnished','Daily',1,0,1,1,0,0,0,1,'[{\"Deposit Name\":\"ROOM\",\"Amount\":\"11000\"}]','[{\"Bill Name\":\"garbage\",\"Amount\":\"250\"},{\"Bill Name\":\"security\",\"Amount\":\"400\"}]',NULL),('5a531c49-86fa-4ef6-8174-106c9667f810','A2','JPW6PL',0,0,2,1,10,'Two Bedroom','Prepaid/Tokens - Owner','Tap-Internal','Ceramic Tiles','Not Furnished','Daily',1,1,0,0,1,0,0,1,'[{\"Deposit Name\":\"ROOM\",\"Amount\":\"12000\"},{\"Deposit Name\":\"WATER\",\"Amount\":\"2500\"}]','[{\"Bill Name\":\"internet\",\"Amount\":\"2500\"},{\"Bill Name\":\"security\",\"Amount\":\"300\"},{\"Bill Name\":\"garbage\",\"Amount\":\"250\"}]',NULL),('83fd9df1-a81a-4837-afb3-aef0d5265eb3','A5','TRNPLQ',0,0,1,1,5,'One Bedroom','Prepaid/Tokens - Owner','Tap-Internal','Ceramic Tiles','Not Furnished','Daily',1,0,1,1,0,0,0,1,'[{\"Deposit Name\":\"ROOM\",\"Amount\":\"11000\"}]','[{\"Bill Name\":\"garbage\",\"Amount\":\"250\"},{\"Bill Name\":\"security\",\"Amount\":\"400\"}]',NULL),('92b72dab-a214-4e9c-a523-09645946d2bf','A6','TRNPLQ',0,0,1,1,5,'One Bedroom','Prepaid/Tokens - Owner','Tap-Internal','Ceramic Tiles','Not Furnished','Daily',1,0,1,1,0,0,0,1,'[{\"Deposit Name\":\"ROOM\",\"Amount\":\"11000\"}]','[{\"Bill Name\":\"garbage\",\"Amount\":\"250\"},{\"Bill Name\":\"security\",\"Amount\":\"400\"}]',NULL),('95eb3adc-1805-49ae-bcd0-e6cfbbddc834','A3','JPW6PL',0,0,2,1,10,'Two Bedroom','Prepaid/Tokens - Owner','Tap-Internal','Ceramic Tiles','Not Furnished','Daily',1,1,0,0,1,0,0,1,'[{\"Deposit Name\":\"ROOM\",\"Amount\":\"12000\"},{\"Deposit Name\":\"WATER\",\"Amount\":\"2500\"}]','[{\"Bill Name\":\"internet\",\"Amount\":\"2500\"},{\"Bill Name\":\"security\",\"Amount\":\"300\"},{\"Bill Name\":\"garbage\",\"Amount\":\"250\"}]',NULL),('961af8fa-1c48-4677-8d6a-ac7fce420bb1','B2','CZCS1V',1,0,1,0,8,'One Bedroom','Prepaid/Tokens - Owner','Tap-Internal','Ceramic Tiles','Not Furnished','Daily',1,0,0,0,0,0,0,1,'[{\"Deposit Name\":\"Agreement Fee\",\"Amount\":\"1000\"},{\"Deposit Name\":\"Water Deposit\",\"Amount\":\"1500\"},{\"Deposit Name\":\"Room Deposit\",\"Amount\":\"12000\"}]','[{\"Bill Name\":\"Garbage\",\"Amount\":\"400\"},{\"Bill Name\":\"Security\",\"Amount\":\"300\"},{\"Bill Name\":\"Internet\",\"Amount\":\"2500\"}]',NULL),('a2dcce86-e271-418a-bca2-14c0f283c4b5','A4','JPW6PL',0,0,2,1,10,'Two Bedroom','Prepaid/Tokens - Owner','Tap-Internal','Ceramic Tiles','Not Furnished','Daily',1,1,0,0,1,0,0,1,'[{\"Deposit Name\":\"ROOM\",\"Amount\":\"12000\"},{\"Deposit Name\":\"WATER\",\"Amount\":\"2500\"}]','[{\"Bill Name\":\"internet\",\"Amount\":\"2500\"},{\"Bill Name\":\"security\",\"Amount\":\"300\"},{\"Bill Name\":\"garbage\",\"Amount\":\"250\"}]',NULL),('bd52398f-79e2-44ea-9f2f-05dbbcf6e85d','B3','CZCS1V',1,0,1,0,8,'One Bedroom','Prepaid/Tokens - Owner','Tap-Internal','Ceramic Tiles','Not Furnished','Daily',1,0,0,0,0,0,0,1,'[{\"Deposit Name\":\"Agreement Fee\",\"Amount\":\"1000\"},{\"Deposit Name\":\"Water Deposit\",\"Amount\":\"1500\"},{\"Deposit Name\":\"Room Deposit\",\"Amount\":\"12000\"}]','[{\"Bill Name\":\"Garbage\",\"Amount\":\"400\"},{\"Bill Name\":\"Security\",\"Amount\":\"300\"},{\"Bill Name\":\"Internet\",\"Amount\":\"2500\"}]',NULL),('c637f5ab-4ab7-4b8c-ae82-6abf6be92a52','A4','CZCS1V',0,0,1,1,10,'One Bedroom','Prepaid/Tokens - Owner','Tap-Internal','Ceramic Tiles','Not Furnished','Daily',1,0,1,0,0,0,0,1,'[{\"Deposit Name\":\"ROOM\",\"Amount\":\"17000\"},{\"Deposit Name\":\"WATER\",\"Amount\":\"2500\"}]','[{\"Bill Name\":\"SECURITY\",\"Amount\":\"200\"}]',NULL),('caddcae2-b69c-4f5a-b371-d7aeb7a328f5','B4','CZCS1V',1,0,1,0,8,'One Bedroom','Prepaid/Tokens - Owner','Tap-Internal','Ceramic Tiles','Not Furnished','Daily',1,0,0,0,0,0,0,1,'[{\"Deposit Name\":\"Agreement Fee\",\"Amount\":\"1000\"},{\"Deposit Name\":\"Water Deposit\",\"Amount\":\"1500\"},{\"Deposit Name\":\"Room Deposit\",\"Amount\":\"12000\"}]','[{\"Bill Name\":\"Garbage\",\"Amount\":\"400\"},{\"Bill Name\":\"Security\",\"Amount\":\"300\"},{\"Bill Name\":\"Internet\",\"Amount\":\"2500\"}]',NULL),('cbe647d1-b1a4-404f-a540-a291e857b87f','A5','JPW6PL',0,0,2,1,10,'Two Bedroom','Prepaid/Tokens - Owner','Tap-Internal','Ceramic Tiles','Not Furnished','Daily',1,1,0,0,1,0,0,1,'[{\"Deposit Name\":\"ROOM\",\"Amount\":\"12000\"},{\"Deposit Name\":\"WATER\",\"Amount\":\"2500\"}]','[{\"Bill Name\":\"internet\",\"Amount\":\"2500\"},{\"Bill Name\":\"security\",\"Amount\":\"300\"},{\"Bill Name\":\"garbage\",\"Amount\":\"250\"}]',NULL),('dcf28f7f-1e7f-4d2a-af91-62bf5b081c82','A6','JPW6PL',0,0,2,1,10,'Two Bedroom','Prepaid/Tokens - Owner','Tap-Internal','Ceramic Tiles','Not Furnished','Daily',1,1,0,0,1,0,0,1,'[{\"Deposit Name\":\"ROOM\",\"Amount\":\"12000\"},{\"Deposit Name\":\"WATER\",\"Amount\":\"2500\"}]','[{\"Bill Name\":\"internet\",\"Amount\":\"2500\"},{\"Bill Name\":\"security\",\"Amount\":\"300\"},{\"Bill Name\":\"garbage\",\"Amount\":\"250\"}]',NULL);
/*!40000 ALTER TABLE `tbl_units` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_units_images`
--

DROP TABLE IF EXISTS `tbl_units_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_units_images` (
  `image_id` varchar(36) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `unit_code` varchar(36) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `image_description` varchar(255) DEFAULT NULL,
  `is_default` tinyint(1) NOT NULL DEFAULT '0',
  `date_add` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`image_id`) USING BTREE,
  KEY `unit_code` (`unit_code`) USING BTREE,
  CONSTRAINT `tbl_units_images_ibfk_1` FOREIGN KEY (`unit_code`) REFERENCES `tbl_units` (`unit_code`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_units_images`
--

LOCK TABLES `tbl_units_images` WRITE;
/*!40000 ALTER TABLE `tbl_units_images` DISABLE KEYS */;
INSERT INTO `tbl_units_images` VALUES ('000f0586-8ce1-4b8c-b30d-dff7c672a3b3','2988d7cc-2343-49f1-9170-141b0679086b','outside',0,'2021-10-16 21:19:55'),('0eaa51b2-6451-4acc-b682-e2f83f92ea8a','48cb0670-845e-4e50-a086-78b7739dcdb8','',0,'2021-11-12 15:43:13'),('21204c45-ae8d-415a-9e60-146db73eca75','2988d7cc-2343-49f1-9170-141b0679086b',NULL,1,'2021-10-16 21:24:15'),('2e9ebd68-3000-47fb-8c4a-609ed094c53a','356f33f3-2548-4086-9923-c75e81ed3f04',NULL,1,'2021-11-03 13:57:35'),('72082e01-2aed-4f42-adfe-a896613212b7','356f33f3-2548-4086-9923-c75e81ed3f04','',0,'2021-11-03 13:57:29'),('c658049d-90c7-4575-b5d3-af0a7b7a0257','48cb0670-845e-4e50-a086-78b7739dcdb8','',0,'2021-11-01 14:21:05'),('cc19ae14-d222-4877-bd86-df51a68396f8','48cb0670-845e-4e50-a086-78b7739dcdb8',NULL,1,'2021-11-01 14:21:21'),('db494073-2db3-4b64-ab8a-3813b7398e1b','48cb0670-845e-4e50-a086-78b7739dcdb8','',0,'2021-11-01 14:21:14');
/*!40000 ALTER TABLE `tbl_units_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_units_leases`
--

DROP TABLE IF EXISTS `tbl_units_leases`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_units_leases` (
  `lease_id` varchar(36) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `unit_code` varchar(36) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `tenant_id` varchar(36) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `lease_date` date NOT NULL,
  `expiry_date` date DEFAULT NULL,
  `terminated_by` varchar(36) NOT NULL,
  `leased_by` varchar(36) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `deposists` mediumtext,
  `monthly_rent` decimal(10,2) unsigned NOT NULL DEFAULT '0.00',
  `fixed_monthly_bills` mediumtext CHARACTER SET latin1 COLLATE latin1_swedish_ci,
  `bills_payment_date` int unsigned NOT NULL DEFAULT '1',
  `billing_start_date` date NOT NULL,
  `lease_agreement_path` varchar(255) DEFAULT NULL,
  `file_extension` varchar(5) NOT NULL DEFAULT '.jpg',
  `refund_processed` tinyint(1) NOT NULL DEFAULT '0',
  `refund_invoice_no` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`lease_id`) USING BTREE,
  KEY `unit_code` (`unit_code`) USING BTREE,
  KEY `tenant_id` (`tenant_id`) USING BTREE,
  KEY `leased_by` (`leased_by`) USING BTREE,
  KEY `terminated_by` (`terminated_by`),
  CONSTRAINT `tbl_units_leases_ibfk_1` FOREIGN KEY (`unit_code`) REFERENCES `tbl_units` (`unit_code`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `tbl_units_leases_ibfk_2` FOREIGN KEY (`tenant_id`) REFERENCES `tbl_tenants` (`tenant_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `tbl_units_leases_ibfk_3` FOREIGN KEY (`leased_by`) REFERENCES `tbl_users` (`user_code`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `tbl_units_leases_ibfk_4` FOREIGN KEY (`terminated_by`) REFERENCES `tbl_users` (`user_code`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_units_leases`
--

LOCK TABLES `tbl_units_leases` WRITE;
/*!40000 ALTER TABLE `tbl_units_leases` DISABLE KEYS */;
INSERT INTO `tbl_units_leases` VALUES ('15f4204f-fbbc-44fe-be60-525043330180','caddcae2-b69c-4f5a-b371-d7aeb7a328f5','cab149bb-5a20-4919-a293-f272a45e8ec4','2021-11-12',NULL,'768afb88-69ce-401d-b8b2-712fd235a11d','768afb88-69ce-401d-b8b2-712fd235a11d','[{\"Deposit Name\":\" Agreement Fee\",\"Amount\":\"1000\"},{\"Deposit Name\":\" Water Deposit\",\"Amount\":\"1500\"},{\"Deposit Name\":\" Room Deposit\",\"Amount\":\"12000\"}]',12000.00,'[{\"Bill Name\":\"Garbage\",\"Amount\":\"400\"},{\"Bill Name\":\"Security\",\"Amount\":\"300\"},{\"Bill Name\":\"Internet\",\"Amount\":\"2500\"}]',8,'2021-11-30',NULL,'.jpg',0,NULL),('74ebe0fe-d39f-42fc-9ed5-628f76865e42','48cb0670-845e-4e50-a086-78b7739dcdb8','46dd9529-a844-4f0b-83f8-2a55dc80ac21','2021-11-01','2021-11-05','768afb88-69ce-401d-b8b2-712fd235a11d','768afb88-69ce-401d-b8b2-712fd235a11d','[{\"Deposit Name\":\" ROOM\",\"Amount\":\"17000\"},{\"Deposit Name\":\" WATER\",\"Amount\":\"2500\"}]',15600.00,'[{\"Bill Name\":\"SECURITY\",\"Amount\":\"200\"}]',4,'2021-11-30',NULL,'.jpg',0,NULL),('84c50236-d97b-4674-8228-814c70d517db','95eb3adc-1805-49ae-bcd0-e6cfbbddc834','79f492a1-6ca5-48b3-8d85-26c76ebff818','2021-10-01',NULL,'ce96d023-96b9-4a62-a2b0-4e566092917e','ce96d023-96b9-4a62-a2b0-4e566092917e','[{\"Deposit Name\":\" ROOM\",\"Amount\":\"12000\"},{\"Deposit Name\":\" WATER\",\"Amount\":\"2500\"}]',9800.00,'[{\"Bill Name\":\"internet\",\"Amount\":\"1500\"},{\"Bill Name\":\"security\",\"Amount\":\"300\"},{\"Bill Name\":\"garbage\",\"Amount\":\"250\"}]',7,'2021-11-01',NULL,'.jpg',0,NULL),('92219775-0b2c-4557-9619-dafa7880c839','27b78bad-c278-4023-8de0-983d0782c9f7','0d450cc4-2b8d-425f-b015-9d6aa60013e4','2021-10-04',NULL,'7701882d-1592-4706-ac8a-9205c949bc73','7701882d-1592-4706-ac8a-9205c949bc73','[{\"Deposit Name\":\" ROOM\",\"Amount\":\"11000\"}]',12000.00,'[{\"Bill Name\":\"garbage\",\"Amount\":\"250\"},{\"Bill Name\":\"security\",\"Amount\":\"400\"}]',5,'2021-10-31',NULL,'.jpg',0,NULL),('99123b88-1dfe-4d13-9475-98178a9ecd7d','2988d7cc-2343-49f1-9170-141b0679086b','cab149bb-5a20-4919-a293-f272a45e8ec4','2021-10-16',NULL,'768afb88-69ce-401d-b8b2-712fd235a11d','768afb88-69ce-401d-b8b2-712fd235a11d','[{\"Deposit Name\":\" ROOM\",\"Amount\":\"17000\"},{\"Deposit Name\":\" WATER\",\"Amount\":\"2500\"}]',1700.00,'[{\"Bill Name\":\"SECURITY\",\"Amount\":\"200\"}]',10,'2021-10-31',NULL,'.jpg',0,NULL),('9f018b70-2da9-4ac2-aae0-df1752fd77fb','c637f5ab-4ab7-4b8c-ae82-6abf6be92a52','cab149bb-5a20-4919-a293-f272a45e8ec4','2021-10-17',NULL,'768afb88-69ce-401d-b8b2-712fd235a11d','768afb88-69ce-401d-b8b2-712fd235a11d','[{\"Deposit Name\":\" ROOM\",\"Amount\":\"17000\"},{\"Deposit Name\":\" WATER\",\"Amount\":\"2500\"}]',1700.00,'[{\"Bill Name\":\"SECURITY\",\"Amount\":\"200\"}]',10,'2021-10-31',NULL,'.jpg',0,NULL),('bf2fd250-e892-4a30-9d09-87183fa68566','4cbfec6f-8634-4edc-976e-9d26bab0685e','46dd9529-a844-4f0b-83f8-2a55dc80ac21','2021-11-12',NULL,'768afb88-69ce-401d-b8b2-712fd235a11d','768afb88-69ce-401d-b8b2-712fd235a11d','[{\"Deposit Name\":\" Agreement Fee\",\"Amount\":\"1000\"},{\"Deposit Name\":\" Water Deposit\",\"Amount\":\"1500\"},{\"Deposit Name\":\" Room Deposit\",\"Amount\":\"12000\"}]',12000.00,'[{\"Bill Name\":\"Garbage\",\"Amount\":\"400\"},{\"Bill Name\":\"Security\",\"Amount\":\"300\"},{\"Bill Name\":\"Internet\",\"Amount\":\"2500\"}]',8,'2021-11-30',NULL,'.jpg',0,NULL),('c85da787-ddc7-4c88-8d0f-ffc4a72dfaa5','356f33f3-2548-4086-9923-c75e81ed3f04','46dd9529-a844-4f0b-83f8-2a55dc80ac21','2021-11-12',NULL,'768afb88-69ce-401d-b8b2-712fd235a11d','768afb88-69ce-401d-b8b2-712fd235a11d','[{\"Deposit Name\":\" Agreement Fee\",\"Amount\":\"1000\"},{\"Deposit Name\":\" Water Deposit\",\"Amount\":\"1500\"},{\"Deposit Name\":\" Room Deposit\",\"Amount\":\"12000\"}]',6789.00,'[{\"Bill Name\":\"Garbage\",\"Amount\":\"400\"},{\"Bill Name\":\"Security\",\"Amount\":\"300\"},{\"Bill Name\":\"Internet\",\"Amount\":\"2500\"}]',8,'2021-11-30',NULL,'.jpg',0,NULL),('d9a9f8bc-360e-4682-9819-266c8794d6e7','48cb0670-845e-4e50-a086-78b7739dcdb8','46dd9529-a844-4f0b-83f8-2a55dc80ac21','2021-11-12',NULL,'768afb88-69ce-401d-b8b2-712fd235a11d','768afb88-69ce-401d-b8b2-712fd235a11d','[{\"Deposit Name\":\" ROOM\",\"Amount\":\"17000\"},{\"Deposit Name\":\" WATER\",\"Amount\":\"2500\"}]',1700.00,'[{\"Bill Name\":\"SECURITY\",\"Amount\":\"200\"}]',10,'2021-11-30',NULL,'.jpg',0,NULL);
/*!40000 ALTER TABLE `tbl_units_leases` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `clear_active_ads` AFTER INSERT ON `tbl_units_leases` FOR EACH ROW BEGIN
           UPDATE tbl_ads SET tbl_ads.is_active = 0 WHERE tbl_ads.unit_code = NEW.unit_code;
       END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `tbl_units_meter_readings`
--

DROP TABLE IF EXISTS `tbl_units_meter_readings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_units_meter_readings` (
  `reading_id` int NOT NULL AUTO_INCREMENT,
  `unit_code` varchar(36) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `reading_type` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `read_value` decimal(10,2) NOT NULL DEFAULT '0.00',
  `units_used` decimal(10,2) NOT NULL DEFAULT '0.00',
  `read_date` date NOT NULL,
  `read_by` varchar(36) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `unit_rate` decimal(10,2) NOT NULL DEFAULT '0.00',
  `bill_generated` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`reading_id`) USING BTREE,
  KEY `unit_code` (`unit_code`) USING BTREE,
  KEY `read_by` (`read_by`) USING BTREE,
  CONSTRAINT `tbl_units_meter_readings_ibfk_1` FOREIGN KEY (`unit_code`) REFERENCES `tbl_units` (`unit_code`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `tbl_units_meter_readings_ibfk_2` FOREIGN KEY (`read_by`) REFERENCES `tbl_users` (`user_code`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=376 DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_units_meter_readings`
--

LOCK TABLES `tbl_units_meter_readings` WRITE;
/*!40000 ALTER TABLE `tbl_units_meter_readings` DISABLE KEYS */;
INSERT INTO `tbl_units_meter_readings` VALUES (354,'2988d7cc-2343-49f1-9170-141b0679086b','water',0.00,0.00,'2021-10-17','768afb88-69ce-401d-b8b2-712fd235a11d',1111.00,1),(355,'48cb0670-845e-4e50-a086-78b7739dcdb8','water',0.00,0.00,'2021-10-17','768afb88-69ce-401d-b8b2-712fd235a11d',1111.00,1),(356,'c637f5ab-4ab7-4b8c-ae82-6abf6be92a52','water',0.00,0.00,'2021-10-17','768afb88-69ce-401d-b8b2-712fd235a11d',1111.00,1),(357,'2988d7cc-2343-49f1-9170-141b0679086b','Gas',0.00,0.00,'2021-10-17','768afb88-69ce-401d-b8b2-712fd235a11d',456.00,1),(358,'48cb0670-845e-4e50-a086-78b7739dcdb8','Gas',0.00,0.00,'2021-10-17','768afb88-69ce-401d-b8b2-712fd235a11d',456.00,1),(359,'c637f5ab-4ab7-4b8c-ae82-6abf6be92a52','Gas',0.00,0.00,'2021-10-17','768afb88-69ce-401d-b8b2-712fd235a11d',456.00,1),(360,'2988d7cc-2343-49f1-9170-141b0679086b','water',78.00,78.00,'2021-10-17','768afb88-69ce-401d-b8b2-712fd235a11d',1111.00,0),(361,'2988d7cc-2343-49f1-9170-141b0679086b','water',78.00,78.00,'2021-10-17','768afb88-69ce-401d-b8b2-712fd235a11d',1111.00,0),(362,'2988d7cc-2343-49f1-9170-141b0679086b','water',78.00,78.00,'2021-10-17','768afb88-69ce-401d-b8b2-712fd235a11d',1111.00,0),(363,'2988d7cc-2343-49f1-9170-141b0679086b','water',78.00,78.00,'2021-10-18','768afb88-69ce-401d-b8b2-712fd235a11d',1111.00,0),(364,'2988d7cc-2343-49f1-9170-141b0679086b','water',234.00,234.00,'2021-10-18','768afb88-69ce-401d-b8b2-712fd235a11d',1111.00,0),(365,'2988d7cc-2343-49f1-9170-141b0679086b','water',780.00,546.00,'2021-11-12','768afb88-69ce-401d-b8b2-712fd235a11d',1111.00,0),(366,'48cb0670-845e-4e50-a086-78b7739dcdb8','water',770.00,770.00,'2021-11-12','768afb88-69ce-401d-b8b2-712fd235a11d',1111.00,0),(367,'c637f5ab-4ab7-4b8c-ae82-6abf6be92a52','water',760.00,760.00,'2021-11-12','768afb88-69ce-401d-b8b2-712fd235a11d',1111.00,0),(368,'356f33f3-2548-4086-9923-c75e81ed3f04','water',0.00,0.00,'2021-11-12','768afb88-69ce-401d-b8b2-712fd235a11d',1111.00,0),(369,'356f33f3-2548-4086-9923-c75e81ed3f04','Gas',0.00,0.00,'2021-11-12','768afb88-69ce-401d-b8b2-712fd235a11d',456.00,0),(370,'48cb0670-845e-4e50-a086-78b7739dcdb8','water',0.00,0.00,'2021-11-12','768afb88-69ce-401d-b8b2-712fd235a11d',1111.00,0),(371,'48cb0670-845e-4e50-a086-78b7739dcdb8','Gas',0.00,0.00,'2021-11-12','768afb88-69ce-401d-b8b2-712fd235a11d',456.00,0),(372,'4cbfec6f-8634-4edc-976e-9d26bab0685e','water',0.00,0.00,'2021-11-12','768afb88-69ce-401d-b8b2-712fd235a11d',1111.00,0),(373,'4cbfec6f-8634-4edc-976e-9d26bab0685e','Gas',0.00,0.00,'2021-11-12','768afb88-69ce-401d-b8b2-712fd235a11d',456.00,0),(374,'caddcae2-b69c-4f5a-b371-d7aeb7a328f5','water',0.00,0.00,'2021-11-12','768afb88-69ce-401d-b8b2-712fd235a11d',1111.00,0),(375,'caddcae2-b69c-4f5a-b371-d7aeb7a328f5','Gas',0.00,0.00,'2021-11-12','768afb88-69ce-401d-b8b2-712fd235a11d',456.00,0);
/*!40000 ALTER TABLE `tbl_units_meter_readings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_units_ratings`
--

DROP TABLE IF EXISTS `tbl_units_ratings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_units_ratings` (
  `rating_id` int NOT NULL AUTO_INCREMENT,
  `unit_code` varchar(36) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `user_rating` int NOT NULL DEFAULT '5',
  `user_comments` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `user_code` varchar(36) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `rating_approved` tinyint(1) NOT NULL DEFAULT '0',
  `rating_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `verified_tenant` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`rating_id`) USING BTREE,
  KEY `tbl_units_ratings_ibfk_1` (`unit_code`) USING BTREE,
  KEY `tbl_units_ratings_ibfk_2` (`user_code`) USING BTREE,
  CONSTRAINT `tbl_units_ratings_ibfk_1` FOREIGN KEY (`unit_code`) REFERENCES `tbl_units` (`unit_code`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `tbl_units_ratings_ibfk_2` FOREIGN KEY (`user_code`) REFERENCES `tbl_users` (`user_code`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_units_ratings`
--

LOCK TABLES `tbl_units_ratings` WRITE;
/*!40000 ALTER TABLE `tbl_units_ratings` DISABLE KEYS */;
INSERT INTO `tbl_units_ratings` VALUES (1,'27b78bad-c278-4023-8de0-983d0782c9f7',3,'not very much good','7701882d-1592-4706-ac8a-9205c949bc73',1,'2021-11-12 11:30:14',1),(3,'48cb0670-845e-4e50-a086-78b7739dcdb8',1,'fgfhgfhgfhfghfghfhg',NULL,1,'2021-11-13 06:18:55',1),(4,'48cb0670-845e-4e50-a086-78b7739dcdb8',3,'ercttrcyvrtyrtyrtycryryrtcy',NULL,1,'2021-11-13 06:19:34',1);
/*!40000 ALTER TABLE `tbl_units_ratings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_user_favourites`
--

DROP TABLE IF EXISTS `tbl_user_favourites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_user_favourites` (
  `favourite_id` varchar(36) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `user_code` varchar(36) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `unit_code` varchar(36) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `date_added` datetime NOT NULL,
  PRIMARY KEY (`favourite_id`) USING BTREE,
  KEY `user_code` (`user_code`) USING BTREE,
  KEY `unit_code` (`unit_code`) USING BTREE,
  CONSTRAINT `tbl_user_favourites_ibfk_1` FOREIGN KEY (`user_code`) REFERENCES `tbl_users` (`user_code`) ON DELETE SET NULL ON UPDATE SET NULL,
  CONSTRAINT `tbl_user_favourites_ibfk_2` FOREIGN KEY (`unit_code`) REFERENCES `tbl_units` (`unit_code`) ON DELETE SET NULL ON UPDATE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_user_favourites`
--

LOCK TABLES `tbl_user_favourites` WRITE;
/*!40000 ALTER TABLE `tbl_user_favourites` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_user_favourites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_user_logins`
--

DROP TABLE IF EXISTS `tbl_user_logins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_user_logins` (
  `entry_id` int NOT NULL AUTO_INCREMENT,
  `user_code` varchar(36) NOT NULL,
  `entry_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ip_address` varchar(255) DEFAULT NULL,
  `browser_name` varchar(255) DEFAULT NULL,
  `operating_system` varchar(255) DEFAULT NULL,
  `logged_in` tinyint(1) NOT NULL,
  PRIMARY KEY (`entry_id`),
  KEY `user_code` (`user_code`),
  CONSTRAINT `tbl_user_logins_ibfk_1` FOREIGN KEY (`user_code`) REFERENCES `tbl_users` (`user_code`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_user_logins`
--

LOCK TABLES `tbl_user_logins` WRITE;
/*!40000 ALTER TABLE `tbl_user_logins` DISABLE KEYS */;
INSERT INTO `tbl_user_logins` VALUES (1,'d5e060cb-cc1e-4b61-a5b3-a932a9ea0001','2021-10-01 07:14:37','::1','Chrome, ver: 94','Windows NT 10.0; Win64; x64',1),(2,'d5e060cb-cc1e-4b61-a5b3-a932a9ea0001','2021-10-01 07:37:23','127.0.0.1','Chrome, ver: 94','Windows NT 10.0; Win64; x64',1),(3,'7701882d-1592-4706-ac8a-9205c949bc73','2021-10-01 07:38:06','::1','Chrome, ver: 94','Windows NT 10.0; Win64; x64',1),(4,'d5e060cb-cc1e-4b61-a5b3-a932a9ea0001','2021-10-01 12:36:56','::1','Chrome, ver: 94','Windows NT 10.0; Win64; x64',1),(5,'ce96d023-96b9-4a62-a2b0-4e566092917e','2021-10-01 12:38:21','::1','Chrome, ver: 94','Windows NT 10.0; Win64; x64',1),(6,'ce96d023-96b9-4a62-a2b0-4e566092917e','2021-10-01 12:59:23','::1','Chrome, ver: 94','Windows NT 10.0; Win64; x64',1),(7,'7701882d-1592-4706-ac8a-9205c949bc73','2021-10-04 15:26:50','::1','Chrome, ver: 94','Windows NT 10.0; Win64; x64',1),(8,'ce96d023-96b9-4a62-a2b0-4e566092917e','2021-10-04 15:27:15','::1','Chrome, ver: 94','Windows NT 10.0; Win64; x64',1),(9,'7701882d-1592-4706-ac8a-9205c949bc73','2021-10-04 16:40:30','::1','Chrome, ver: 94','Windows NT 10.0; Win64; x64',1),(10,'768afb88-69ce-401d-b8b2-712fd235a11d','2021-10-04 16:46:53','127.0.0.1','Chrome, ver: 95','Windows NT 10.0; Win64; x64',1),(11,'d5e060cb-cc1e-4b61-a5b3-a932a9ea0001','2021-10-04 17:26:18','127.0.0.1','Chrome, ver: 94','Windows NT 10.0; Win64; x64',0),(12,'d5e060cb-cc1e-4b61-a5b3-a932a9ea0001','2021-10-04 17:26:23','127.0.0.1','Chrome, ver: 94','Windows NT 10.0; Win64; x64',0),(13,'d5e060cb-cc1e-4b61-a5b3-a932a9ea0001','2021-10-04 17:26:28','127.0.0.1','Chrome, ver: 94','Windows NT 10.0; Win64; x64',0),(14,'d5e060cb-cc1e-4b61-a5b3-a932a9ea0001','2021-10-04 17:26:36','127.0.0.1','Chrome, ver: 94','Windows NT 10.0; Win64; x64',0),(15,'768afb88-69ce-401d-b8b2-712fd235a11d','2021-10-04 17:52:59','127.0.0.1','Chrome, ver: 95','Windows NT 10.0; Win64; x64',1),(16,'768afb88-69ce-401d-b8b2-712fd235a11d','2021-10-04 18:00:02','127.0.0.1','Chrome, ver: 95','Windows NT 10.0; Win64; x64',1),(17,'768afb88-69ce-401d-b8b2-712fd235a11d','2021-10-04 18:15:36','127.0.0.1','Chrome, ver: 95','Windows NT 10.0; Win64; x64',1),(18,'768afb88-69ce-401d-b8b2-712fd235a11d','2021-10-04 18:17:55','127.0.0.1','Chrome, ver: 95','Windows NT 10.0; Win64; x64',1),(19,'768afb88-69ce-401d-b8b2-712fd235a11d','2021-10-04 18:18:12','127.0.0.1','Chrome, ver: 95','Windows NT 10.0; Win64; x64',1),(20,'768afb88-69ce-401d-b8b2-712fd235a11d','2021-10-04 18:18:24','127.0.0.1','Chrome, ver: 95','Windows NT 10.0; Win64; x64',1),(21,'768afb88-69ce-401d-b8b2-712fd235a11d','2021-10-04 18:18:42','127.0.0.1','Chrome, ver: 95','Windows NT 10.0; Win64; x64',1),(22,'768afb88-69ce-401d-b8b2-712fd235a11d','2021-10-13 05:40:35','127.0.0.1','Chrome, ver: 95','Windows NT 10.0; Win64; x64',1),(23,'768afb88-69ce-401d-b8b2-712fd235a11d','2021-10-13 10:34:22','127.0.0.1','Chrome, ver: 95','Windows NT 10.0; Win64; x64',1),(24,'768afb88-69ce-401d-b8b2-712fd235a11d','2021-10-14 10:38:44','127.0.0.1','Chrome, ver: 96','Windows NT 10.0; Win64; x64',1),(25,'768afb88-69ce-401d-b8b2-712fd235a11d','2021-10-14 10:42:30','127.0.0.1','Chrome, ver: 96','Windows NT 10.0; Win64; x64',1),(26,'768afb88-69ce-401d-b8b2-712fd235a11d','2021-10-14 10:49:25','127.0.0.1','Chrome, ver: 96','Windows NT 10.0; Win64; x64',1),(27,'768afb88-69ce-401d-b8b2-712fd235a11d','2021-10-14 10:50:25','127.0.0.1','Chrome, ver: 96','Windows NT 10.0; Win64; x64',1),(28,'768afb88-69ce-401d-b8b2-712fd235a11d','2021-10-14 10:52:40','127.0.0.1','Chrome, ver: 96','Windows NT 10.0; Win64; x64',1),(29,'768afb88-69ce-401d-b8b2-712fd235a11d','2021-10-16 11:01:37','127.0.0.1','Chrome, ver: 96','Windows NT 10.0; Win64; x64',1),(30,'768afb88-69ce-401d-b8b2-712fd235a11d','2021-10-16 11:15:55','127.0.0.1','Chrome, ver: 96','Windows NT 10.0; Win64; x64',1),(31,'d5e060cb-cc1e-4b61-a5b3-a932a9ea0001','2021-11-01 10:31:13','127.0.0.1','Chrome, ver: 95','Windows NT 10.0; Win64; x64',0),(32,'d5e060cb-cc1e-4b61-a5b3-a932a9ea0001','2021-11-01 10:31:16','127.0.0.1','Chrome, ver: 95','Windows NT 10.0; Win64; x64',0),(33,'d5e060cb-cc1e-4b61-a5b3-a932a9ea0001','2021-11-01 10:36:52','127.0.0.1','Chrome, ver: 95','Windows NT 10.0; Win64; x64',1),(35,'768afb88-69ce-401d-b8b2-712fd235a11d','2021-11-03 08:38:40','127.0.0.1','Chrome, ver: 96','Windows NT 10.0; Win64; x64',1),(36,'768afb88-69ce-401d-b8b2-712fd235a11d','2021-11-03 11:44:41','127.0.0.1','Chrome, ver: 96','Windows NT 10.0; Win64; x64',1),(37,'768afb88-69ce-401d-b8b2-712fd235a11d','2021-11-03 13:42:05','127.0.0.1','Chrome, ver: 96','Windows NT 10.0; Win64; x64',1),(38,'768afb88-69ce-401d-b8b2-712fd235a11d','2021-11-03 17:21:04','127.0.0.1','Chrome, ver: 95','Windows NT 10.0; Win64; x64',0),(39,'768afb88-69ce-401d-b8b2-712fd235a11d','2021-11-03 17:21:08','127.0.0.1','Chrome, ver: 95','Windows NT 10.0; Win64; x64',0),(40,'768afb88-69ce-401d-b8b2-712fd235a11d','2021-11-03 17:21:13','127.0.0.1','Chrome, ver: 95','Windows NT 10.0; Win64; x64',0),(41,'768afb88-69ce-401d-b8b2-712fd235a11d','2021-11-03 17:21:20','127.0.0.1','Chrome, ver: 95','Windows NT 10.0; Win64; x64',0),(42,'768afb88-69ce-401d-b8b2-712fd235a11d','2021-11-03 17:21:26','127.0.0.1','Chrome, ver: 95','Windows NT 10.0; Win64; x64',0),(43,'d5e060cb-cc1e-4b61-a5b3-a932a9ea0001','2021-11-03 18:26:31','127.0.0.1','Chrome, ver: 95','Windows NT 10.0; Win64; x64',1),(44,'d5e060cb-cc1e-4b61-a5b3-a932a9ea0001','2021-11-04 06:37:31','127.0.0.1','Chrome, ver: 95','Windows NT 10.0; Win64; x64',1),(45,'768afb88-69ce-401d-b8b2-712fd235a11d','2021-11-04 08:21:08','127.0.0.1','Chrome, ver: 96','Windows NT 10.0; Win64; x64',1),(46,'768afb88-69ce-401d-b8b2-712fd235a11d','2021-11-05 06:12:11','127.0.0.1','Chrome, ver: 96','Windows NT 10.0; Win64; x64',1),(47,'28d712c6-72cb-45e2-bec2-750c8a79bcdf','2021-11-09 12:23:45','127.0.0.1','Chrome, ver: 96','Windows NT 10.0; Win64; x64',0),(48,'28d712c6-72cb-45e2-bec2-750c8a79bcdf','2021-11-09 12:23:54','127.0.0.1','Chrome, ver: 96','Windows NT 10.0; Win64; x64',1),(49,'768afb88-69ce-401d-b8b2-712fd235a11d','2021-11-10 17:25:50','127.0.0.1','Chrome, ver: 97','Windows NT 10.0; Win64; x64',1),(50,'768afb88-69ce-401d-b8b2-712fd235a11d','2021-11-12 18:34:09','127.0.0.1','Chrome, ver: 97','Windows NT 10.0; Win64; x64',1);
/*!40000 ALTER TABLE `tbl_user_logins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_user_names_change_log`
--

DROP TABLE IF EXISTS `tbl_user_names_change_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_user_names_change_log` (
  `log_id` int NOT NULL AUTO_INCREMENT,
  `user_code` varchar(36) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `first_name` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `other_names` varchar(255) DEFAULT NULL,
  `company_name` varchar(255) DEFAULT NULL,
  `edit_date` datetime NOT NULL,
  PRIMARY KEY (`log_id`) USING BTREE,
  KEY `user_code` (`user_code`),
  CONSTRAINT `tbl_user_names_change_log_ibfk_1` FOREIGN KEY (`user_code`) REFERENCES `tbl_users` (`user_code`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_user_names_change_log`
--

LOCK TABLES `tbl_user_names_change_log` WRITE;
/*!40000 ALTER TABLE `tbl_user_names_change_log` DISABLE KEYS */;
INSERT INTO `tbl_user_names_change_log` VALUES (1,'ce96d023-96b9-4a62-a2b0-4e566092917e','Getsharp','Developers',NULL,NULL,'2021-10-04 15:40:31'),(2,'768afb88-69ce-401d-b8b2-712fd235a11d','','',NULL,NULL,'2021-10-04 16:51:03'),(3,'28d712c6-72cb-45e2-bec2-750c8a79bcdf','','',NULL,NULL,'2021-11-09 12:30:27');
/*!40000 ALTER TABLE `tbl_user_names_change_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_user_notifications`
--

DROP TABLE IF EXISTS `tbl_user_notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_user_notifications` (
  `note_id` int NOT NULL AUTO_INCREMENT,
  `note_head` varchar(255) NOT NULL,
  `note_message` varchar(255) NOT NULL,
  `note_read` tinyint(1) NOT NULL DEFAULT '0',
  `note_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `user_code` varchar(36) NOT NULL,
  `note_class` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT 'info',
  `note_icon` varchar(255) DEFAULT NULL,
  `hyper_link` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`note_id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_user_notifications`
--

LOCK TABLES `tbl_user_notifications` WRITE;
/*!40000 ALTER TABLE `tbl_user_notifications` DISABLE KEYS */;
INSERT INTO `tbl_user_notifications` VALUES (1,'Account Created','New account has been created. We are excited that you\'ve joined us. If you need any assitance, kindly contact us. We are ready to help.',1,'2021-10-01 07:14:37','d5e060cb-cc1e-4b61-a5b3-a932a9ea0001','success','bx bxs-user-plus',NULL),(3,'Landlord Activated','Your account landlord mode has been activated. You can now add your properties by clicking on \'Landlord\'>\'My Properties\'. If you erroneously opted in you can safely opt out by click on your profile at the to right then \'Landlord (Opt-Out)\'',0,'2021-10-01 07:39:09','7701882d-1592-4706-ac8a-9205c949bc73','success','bx bx-cog',NULL),(4,'Landlord Activated','Your account landlord mode has been activated. You can now add your properties by clicking on \'Landlord\'>\'My Properties\'. If you erroneously opted in you can safely opt out by click on your profile at the to right then \'Landlord (Opt-Out)\'',0,'2021-10-01 07:43:08','7701882d-1592-4706-ac8a-9205c949bc73','success','bx bx-cog',NULL),(5,'Account Created','New account has been created. We are excited that you\'ve joined us. If you need any assitance, kindly contact us. We are ready to help.',0,'2021-10-01 12:38:20','ce96d023-96b9-4a62-a2b0-4e566092917e','success','bx bxs-user-plus',NULL),(6,'Landlord Activated','Your account landlord mode has been activated. You can now add your properties by clicking on \'Landlord\'>\'My Properties\'. If you erroneously opted in you can safely opt out by click on your profile at the to right then \'Landlord (Opt-Out)\'',0,'2021-10-01 12:39:20','ce96d023-96b9-4a62-a2b0-4e566092917e','success','bx bx-cog',NULL),(7,'SMS Failed','SMS to Charles - 0722591434 of A3, MY AWESOME PROPERTY could not be sent!',0,'2021-10-01 12:49:29','ce96d023-96b9-4a62-a2b0-4e566092917e','danger','bx bxs-message-rounded',NULL),(8,'SMS units depleted','Dear Getsharp, This is to remind you that your sms units on  Cloud Tena have been depleted. You will not be able to send any SMS from the system. Please purchase more units!',1,'2021-10-01 12:49:29','ce96d023-96b9-4a62-a2b0-4e566092917e','danger','bx bxs-message-alt-x',NULL),(9,'SMS Failed','SMS to Charles - 0722591434 of , MY AWESOME PROPERTY could not be sent!',1,'2021-10-01 12:50:11','ce96d023-96b9-4a62-a2b0-4e566092917e','danger','bx bxs-message-rounded',NULL),(10,'SMS units depleted','Dear Albert, This is to remind you that your sms units on  Cloud Tena have been depleted. You will not be able to send any SMS from the system. Please purchase more units!',0,'2021-10-04 19:44:25','7701882d-1592-4706-ac8a-9205c949bc73','danger','bx bxs-message-alt-x',NULL),(11,'SMS Failed','SMS to Paweja -  of A1, ALBOOM FLATS could not be sent!',0,'2021-10-04 19:44:25','7701882d-1592-4706-ac8a-9205c949bc73','danger','bx bxs-message-rounded',NULL),(12,'Account Created','New account has been created. We are excited that you\'ve joined us. If you need any assitance, kindly contact us. We are ready to help.',1,'2021-10-04 19:46:00','768afb88-69ce-401d-b8b2-712fd235a11d','success','bx bxs-user-plus',NULL),(14,'SMS Failed','SMS to Omwegaaa -  of A2, MY AWESOME PROPERTY could not be sent!',1,'2021-10-17 06:24:40','768afb88-69ce-401d-b8b2-712fd235a11d','danger','bx bxs-message-rounded',NULL),(15,'SMS units depleted','Dear Paweja, This is to remind you that your sms units on  Cloud Tena have been depleted. You will not be able to send any SMS from the system. Please purchase more units!',1,'2021-10-17 06:24:40','768afb88-69ce-401d-b8b2-712fd235a11d','danger','bx bxs-message-alt-x',NULL),(16,'SMS Failed','SMS to Omwegaaa - 0711223639 of A2, MY AWESOME PROPERTY could not be sent!',1,'2021-10-17 06:25:10','768afb88-69ce-401d-b8b2-712fd235a11d','danger','bx bxs-message-rounded',NULL),(17,'SMS units depleted','Dear Paweja, This is to remind you that your sms units on  Rent Hub have been depleted. You will not be able to send any SMS from the system. Please purchase more units!',1,'2021-11-09 11:17:17','768afb88-69ce-401d-b8b2-712fd235a11d','danger','bx bxs-message-alt-x',NULL),(18,'Account Created','New account has been created. We are excited that you\'ve joined us. If you need any assitance, kindly contact us. We are ready to help.',1,'2021-11-09 12:21:02','28d712c6-72cb-45e2-bec2-750c8a79bcdf','success','bx bxs-user-plus',NULL),(19,'Landlord Activated','Your account landlord mode has been activated. You can now add your properties by clicking on \'Landlord\'>\'My Properties\'. If you erroneously opted in you can safely opt out by click on your profile at the to right then \'Landlord (Opt-Out)\'',1,'2021-11-09 12:32:07','28d712c6-72cb-45e2-bec2-750c8a79bcdf','success','bx bx-cog',NULL),(20,'SMS units depleted','Dear Paweja, This is to remind you that your sms units on  Rent Hub have been depleted. You will not be able to send any SMS from the system. Please purchase more units!',1,'2021-11-12 16:05:11','768afb88-69ce-401d-b8b2-712fd235a11d','danger','bx bxs-message-alt-x',NULL),(21,'SMS Failed','SMS to Albert - 0711223639 of B1, MY AWESOME PROPERTY could not be sent!',1,'2021-11-12 16:05:11','768afb88-69ce-401d-b8b2-712fd235a11d','danger','bx bxs-message-rounded',NULL),(22,'SMS units depleted','Dear Paweja, This is to remind you that your sms units on  Rent Hub have been depleted. You will not be able to send any SMS from the system. Please purchase more units!',1,'2021-11-12 16:06:18','768afb88-69ce-401d-b8b2-712fd235a11d','danger','bx bxs-message-alt-x',NULL),(23,'SMS Failed','SMS to Albert - 0711223639 of A3, MY AWESOME PROPERTY could not be sent!',1,'2021-11-12 16:06:18','768afb88-69ce-401d-b8b2-712fd235a11d','danger','bx bxs-message-rounded',NULL),(24,'SMS units depleted','Dear Paweja, This is to remind you that your sms units on  Rent Hub have been depleted. You will not be able to send any SMS from the system. Please purchase more units!',1,'2021-11-12 16:06:43','768afb88-69ce-401d-b8b2-712fd235a11d','danger','bx bxs-message-alt-x',NULL),(25,'SMS Failed','SMS to Albert - 0711223639 of B1, MY AWESOME PROPERTY could not be sent!',1,'2021-11-12 16:06:43','768afb88-69ce-401d-b8b2-712fd235a11d','danger','bx bxs-message-rounded',NULL),(26,'SMS units depleted','Dear Paweja, This is to remind you that your sms units on  Rent Hub have been depleted. You will not be able to send any SMS from the system. Please purchase more units!',1,'2021-11-12 18:15:19','768afb88-69ce-401d-b8b2-712fd235a11d','danger','bx bxs-message-alt-x',NULL),(27,'SMS Failed','SMS to Omwegaaa - 0711223639 of B4, MY AWESOME PROPERTY could not be sent!',1,'2021-11-12 18:15:19','768afb88-69ce-401d-b8b2-712fd235a11d','danger','bx bxs-message-rounded',NULL),(28,'SMS units depleted','Dear Paweja, This is to remind you that your sms units on  Rent Hub have been depleted. You will not be able to send any SMS from the system. Please purchase more units!',0,'2021-11-13 06:21:07','768afb88-69ce-401d-b8b2-712fd235a11d','danger','bx bxs-message-alt-x',NULL),(29,'SMS units depleted','Dear Paweja, This is to remind you that your sms units on  Rent Hub have been depleted. You will not be able to send any SMS from the system. Please purchase more units!',0,'2021-11-13 06:21:41','768afb88-69ce-401d-b8b2-712fd235a11d','danger','bx bxs-message-alt-x',NULL);
/*!40000 ALTER TABLE `tbl_user_notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_user_profile_edits`
--

DROP TABLE IF EXISTS `tbl_user_profile_edits`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_user_profile_edits` (
  `user_code` varchar(255) NOT NULL,
  `last_edit_time` datetime NOT NULL,
  PRIMARY KEY (`user_code`),
  CONSTRAINT `tbl_user_profile_edits_ibfk_1` FOREIGN KEY (`user_code`) REFERENCES `tbl_users` (`user_code`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_user_profile_edits`
--

LOCK TABLES `tbl_user_profile_edits` WRITE;
/*!40000 ALTER TABLE `tbl_user_profile_edits` DISABLE KEYS */;
INSERT INTO `tbl_user_profile_edits` VALUES ('28d712c6-72cb-45e2-bec2-750c8a79bcdf','2021-11-09 12:30:27'),('768afb88-69ce-401d-b8b2-712fd235a11d','2021-10-04 16:51:04'),('ce96d023-96b9-4a62-a2b0-4e566092917e','2021-10-04 15:40:31');
/*!40000 ALTER TABLE `tbl_user_profile_edits` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_user_sessions`
--

DROP TABLE IF EXISTS `tbl_user_sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_user_sessions` (
  `session_id` varchar(128) CHARACTER SET latin1 COLLATE latin1_bin NOT NULL,
  `expires` int unsigned NOT NULL,
  `session_data` mediumtext CHARACTER SET latin1 COLLATE latin1_bin,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_user_sessions`
--

LOCK TABLES `tbl_user_sessions` WRITE;
/*!40000 ALTER TABLE `tbl_user_sessions` DISABLE KEYS */;
INSERT INTO `tbl_user_sessions` VALUES ('6Ge57HJzj2evKPZ3K1N0A2NGV9rNdTpX',1638852357,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\",\"sameSite\":\"strict\"}}'),('S9jP63ff7rtAm34oVgTXKaQewnRlSx2B',1639370347,'{\"cookie\":{\"originalMaxAge\":2591999991,\"expires\":\"2021-12-13T04:39:06.604Z\",\"httpOnly\":true,\"path\":\"/\",\"sameSite\":\"strict\"},\"logged_in\":true,\"user_code\":\"d5e060cb-cc1e-4b61-a5b3-a932a9ea0001\",\"user_locked\":false}'),('teydA3LEwv73TJSN61eiJMPCYnWIdibv',1639370259,'{\"cookie\":{\"originalMaxAge\":2591999999,\"expires\":\"2021-12-13T04:37:38.753Z\",\"httpOnly\":true,\"path\":\"/\",\"sameSite\":\"strict\"},\"logged_in\":true,\"user_code\":\"768afb88-69ce-401d-b8b2-712fd235a11d\",\"user_locked\":true,\"property_code\":\"CZCS1V\"}');
/*!40000 ALTER TABLE `tbl_user_sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_user_sms_reminder`
--

DROP TABLE IF EXISTS `tbl_user_sms_reminder`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_user_sms_reminder` (
  `user_code` varchar(36) NOT NULL,
  `reminder_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_code`) USING BTREE,
  KEY `user_code` (`user_code`),
  CONSTRAINT `tbl_user_sms_reminder_ibfk_1` FOREIGN KEY (`user_code`) REFERENCES `tbl_users` (`user_code`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_user_sms_reminder`
--

LOCK TABLES `tbl_user_sms_reminder` WRITE;
/*!40000 ALTER TABLE `tbl_user_sms_reminder` DISABLE KEYS */;
INSERT INTO `tbl_user_sms_reminder` VALUES ('768afb88-69ce-401d-b8b2-712fd235a11d','2021-10-17 06:24:40'),('7701882d-1592-4706-ac8a-9205c949bc73','2021-10-04 19:44:25'),('ce96d023-96b9-4a62-a2b0-4e566092917e','2021-10-01 12:49:29');
/*!40000 ALTER TABLE `tbl_user_sms_reminder` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_users`
--

DROP TABLE IF EXISTS `tbl_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_users` (
  `user_code` varchar(36) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `username` varchar(20) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `email_address` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `business_code` varchar(6) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `phone_number` varchar(36) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `email_confirmation_code` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `email_confirmation_code_expiry` datetime DEFAULT NULL,
  `first_name` varchar(20) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `last_name` varchar(20) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `other_names` varchar(20) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `company_name` varchar(30) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `password` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `address` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `referral_code` varchar(5) DEFAULT NULL,
  `last_login_date` datetime DEFAULT NULL,
  `security_qn` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `security_an` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `avatar_path` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT '',
  `avatar_color` varchar(20) DEFAULT NULL,
  `password_reset_key` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `phone_verified` tinyint(1) NOT NULL DEFAULT '0',
  `email_verified` tinyint(1) NOT NULL DEFAULT '0',
  `password_reset_request` tinyint(1) DEFAULT '0',
  `account_active` tinyint(1) NOT NULL DEFAULT '1',
  `is_landlord` tinyint(1) NOT NULL DEFAULT '0',
  `two_fa` tinyint(1) NOT NULL DEFAULT '0',
  `single_device_login` tinyint(1) NOT NULL DEFAULT '0',
  `verified_account` tinyint(1) NOT NULL DEFAULT '0',
  `tour_prompted` tinyint(1) NOT NULL DEFAULT '0',
  `landlord_prompted` tinyint(1) NOT NULL DEFAULT '0',
  `available_sms_units` int NOT NULL DEFAULT '0',
  `referal_code` varchar(6) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `account_creation_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `gender` enum('Male','Female','Other','Prefer not Say') CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `phone_otp` varchar(6) NOT NULL DEFAULT '',
  `phone_otp_time` datetime DEFAULT NULL,
  PRIMARY KEY (`user_code`) USING BTREE,
  UNIQUE KEY `username` (`username`) USING BTREE,
  UNIQUE KEY `username_2` (`username`),
  UNIQUE KEY `email_address` (`email_address`),
  KEY `user_code` (`user_code`) USING BTREE,
  KEY `business_code` (`business_code`) USING BTREE,
  KEY `referal_code` (`referal_code`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_users`
--

LOCK TABLES `tbl_users` WRITE;
/*!40000 ALTER TABLE `tbl_users` DISABLE KEYS */;
INSERT INTO `tbl_users` VALUES ('28d712c6-72cb-45e2-bec2-750c8a79bcdf','9rwejxpykn1z','fatip56086@dukeoo.com',NULL,NULL,NULL,'2021-11-10 12:21:02','Fatip','Fatap','','','$2a$04$Em2RtS9Po5cG8iPyxrhKL.1o8WTUpyM.f75Ma6Ds.DfY91TtV/p.G',NULL,NULL,NULL,NULL,NULL,'','#07978c',NULL,0,1,0,1,0,0,0,0,1,1,0,'','2021-11-09 12:21:02',NULL,'',NULL),('768afb88-69ce-401d-b8b2-712fd235a11d','gp132vq0cm9k','paweja1730@mxgsby.com',NULL,'0711223639',NULL,'2021-10-05 16:46:00','Paweja','Clien','','','$2a$04$MKxKEoka16d4uscExUSY..Yo1r18u4iWGAdTkuz9pTNw.RBOLxsMC',NULL,NULL,NULL,NULL,NULL,'','#6d561a',NULL,1,1,0,1,1,0,0,0,1,1,0,'','2021-10-04 19:45:59',NULL,'',NULL),('7701882d-1592-4706-ac8a-9205c949bc73','p5bh3b3aev8j','albert.omwega.17@gmail.com',NULL,NULL,NULL,NULL,'Albert','Omwega',NULL,NULL,'2bda25ea8a2773c92d301b6aa5be6f868136b2ea',NULL,NULL,NULL,NULL,NULL,'https://lh3.googleusercontent.com/a/AATXAJxbN3FxPLB0jb5GgWQTwt3qgI3ZvGqzcb0a8c44=s96-c','#08a7b8',NULL,0,1,0,1,1,0,0,0,0,0,0,NULL,'2021-10-01 07:38:06',NULL,'',NULL),('ce96d023-96b9-4a62-a2b0-4e566092917e','zkz8fec0yncw','getsharp.dev@gmail.com',NULL,'0711223639',NULL,NULL,'Getsharp','Developers','','','2cd5d1cd8175b1ae233ffdea706f326bd4a5080e','',NULL,NULL,NULL,NULL,'https://lh3.googleusercontent.com/a/AATXAJzrhu9A670hRlmeLyokY-zylIoiWAXgV3Dpnbk-=s96-c','#14d46a',NULL,0,1,0,1,1,0,0,0,0,0,0,NULL,'2021-10-01 12:38:20',NULL,'8606','2021-10-04 15:39:55'),('d5e060cb-cc1e-4b61-a5b3-a932a9ea0001','0z49d3pwdblo','alboomdj@gmail.com',NULL,NULL,NULL,NULL,'Albert','Omwega',NULL,NULL,'$2a$04$w.2j/eBn1am/vR91UztA7e3XqIdFx4qHFYpPrHK5MpVv.WyQPrNim',NULL,NULL,NULL,NULL,NULL,'https://lh3.googleusercontent.com/a-/AOh14GjeisukCc9C-kTsHiEoIV8l2-s_5QB1nUSnq8hQfg=s96-c','#b25b41',NULL,0,1,0,1,0,0,0,0,1,1,0,NULL,'2021-10-01 07:14:37',NULL,'',NULL);
/*!40000 ALTER TABLE `tbl_users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_work_orders`
--

DROP TABLE IF EXISTS `tbl_work_orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_work_orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `description` varchar(255) NOT NULL,
  `unit_code` varchar(36) NOT NULL,
  `date_posted` datetime NOT NULL,
  `completed` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `unit_code` (`unit_code`),
  CONSTRAINT `tbl_work_orders_ibfk_1` FOREIGN KEY (`unit_code`) REFERENCES `tbl_units` (`unit_code`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_work_orders`
--

LOCK TABLES `tbl_work_orders` WRITE;
/*!40000 ALTER TABLE `tbl_work_orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbl_work_orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `vw_active_leases`
--

DROP TABLE IF EXISTS `vw_active_leases`;
/*!50001 DROP VIEW IF EXISTS `vw_active_leases`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_active_leases` AS SELECT 
 1 AS `property_code`,
 1 AS `lease_id`,
 1 AS `unit_code`,
 1 AS `tenant_id`,
 1 AS `lease_date`,
 1 AS `expiry_date`,
 1 AS `terminated_by`,
 1 AS `leased_by`,
 1 AS `deposists`,
 1 AS `monthly_rent`,
 1 AS `fixed_monthly_bills`,
 1 AS `bills_payment_date`,
 1 AS `billing_start_date`,
 1 AS `rn`,
 1 AS `tenant_name`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_ads`
--

DROP TABLE IF EXISTS `vw_ads`;
/*!50001 DROP VIEW IF EXISTS `vw_ads`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_ads` AS SELECT 
 1 AS `auto_id`,
 1 AS `ad_id`,
 1 AS `ad_date`,
 1 AS `unit_code`,
 1 AS `added_by`,
 1 AS `total_views`,
 1 AS `ad_comments`,
 1 AS `is_active`,
 1 AS `viewing_fees`,
 1 AS `unit_name`,
 1 AS `image_id`,
 1 AS `property_code`,
 1 AS `floor`,
 1 AS `garages`,
 1 AS `bedrooms`,
 1 AS `bathrooms`,
 1 AS `payment_day`,
 1 AS `unit_type`,
 1 AS `electricity_type`,
 1 AS `water_source`,
 1 AS `furnishing`,
 1 AS `payments_plan`,
 1 AS `internet_available`,
 1 AS `tv_cable_available`,
 1 AS `has_balcony`,
 1 AS `has_garden`,
 1 AS `pet_friendly`,
 1 AS `active_to_rent`,
 1 AS `has_closet`,
 1 AS `has_laundry_room`,
 1 AS `floor_type`,
 1 AS `unit_deposits`,
 1 AS `unit_fixed_bills`,
 1 AS `unit_variable_bills`,
 1 AS `rent_amount`,
 1 AS `effective_from`,
 1 AS `average_rating`,
 1 AS `occupied`,
 1 AS `property_name`,
 1 AS `locality_id`,
 1 AS `property_type`,
 1 AS `is_verified`,
 1 AS `constituency_id`,
 1 AS `constituency_name`,
 1 AS `county_id`,
 1 AS `county_name`,
 1 AS `locality_name`,
 1 AS `property_description`,
 1 AS `street_address`,
 1 AS `latitude`,
 1 AS `longitude`,
 1 AS `area_size`,
 1 AS `unit_types`,
 1 AS `flat_roof`,
 1 AS `year_built`,
 1 AS `floors`,
 1 AS `has_parking`,
 1 AS `has_swimming_pool`,
 1 AS `address`,
 1 AS `has_alarm`,
 1 AS `has_generator`,
 1 AS `disability_features`,
 1 AS `has_lift`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_daily_property_expenses`
--

DROP TABLE IF EXISTS `vw_daily_property_expenses`;
/*!50001 DROP VIEW IF EXISTS `vw_daily_property_expenses`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_daily_property_expenses` AS SELECT 
 1 AS `amount`,
 1 AS `property_code`,
 1 AS `expense_date`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_daily_property_income`
--

DROP TABLE IF EXISTS `vw_daily_property_income`;
/*!50001 DROP VIEW IF EXISTS `vw_daily_property_income`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_daily_property_income` AS SELECT 
 1 AS `payment_date`,
 1 AS `paid_amount`,
 1 AS `property_code`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_expenses`
--

DROP TABLE IF EXISTS `vw_expenses`;
/*!50001 DROP VIEW IF EXISTS `vw_expenses`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_expenses` AS SELECT 
 1 AS `expense_id`,
 1 AS `expense_title`,
 1 AS `expense_description`,
 1 AS `created_on`,
 1 AS `created_by_id`,
 1 AS `property_code`,
 1 AS `unit_code`,
 1 AS `is_cancelled`,
 1 AS `expense_amount`,
 1 AS `paid_amount`,
 1 AS `created_by`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_invoices`
--

DROP TABLE IF EXISTS `vw_invoices`;
/*!50001 DROP VIEW IF EXISTS `vw_invoices`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_invoices` AS SELECT 
 1 AS `user_code`,
 1 AS `invoice_id`,
 1 AS `invoice_date`,
 1 AS `invoice_due_date`,
 1 AS `invoice_amount`,
 1 AS `paid_amount`,
 1 AS `package_name`,
 1 AS `package_id`,
 1 AS `discount_amount`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_leases`
--

DROP TABLE IF EXISTS `vw_leases`;
/*!50001 DROP VIEW IF EXISTS `vw_leases`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_leases` AS SELECT 
 1 AS `lease_id`,
 1 AS `unit_code`,
 1 AS `tenant_id`,
 1 AS `lease_date`,
 1 AS `expiry_date`,
 1 AS `terminated_by`,
 1 AS `leaser_id`,
 1 AS `leased_by`,
 1 AS `deposists`,
 1 AS `monthly_rent`,
 1 AS `fixed_monthly_bills`,
 1 AS `bills_payment_date`,
 1 AS `billing_start_date`,
 1 AS `unit_name`,
 1 AS `property_code`,
 1 AS `floor`,
 1 AS `tenant_name`,
 1 AS `lease_agreement_path`,
 1 AS `file_extension`,
 1 AS `refund_processed`,
 1 AS `refund_invoice_no`,
 1 AS `is_active`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_leases_full`
--

DROP TABLE IF EXISTS `vw_leases_full`;
/*!50001 DROP VIEW IF EXISTS `vw_leases_full`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_leases_full` AS SELECT 
 1 AS `unit_code`,
 1 AS `unit_name`,
 1 AS `floor`,
 1 AS `unit_type`,
 1 AS `tenant_id`,
 1 AS `lease_id`,
 1 AS `monthly_rent`,
 1 AS `status`,
 1 AS `property_name`,
 1 AS `balance`,
 1 AS `email_address`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_leases_tenants`
--

DROP TABLE IF EXISTS `vw_leases_tenants`;
/*!50001 DROP VIEW IF EXISTS `vw_leases_tenants`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_leases_tenants` AS SELECT 
 1 AS `lease_id`,
 1 AS `unit_code`,
 1 AS `lease_date`,
 1 AS `expiry_date`,
 1 AS `deposists`,
 1 AS `monthly_rent`,
 1 AS `fixed_monthly_bills`,
 1 AS `bills_payment_date`,
 1 AS `billing_start_date`,
 1 AS `unit_name`,
 1 AS `floor`,
 1 AS `electricity_type`,
 1 AS `water_source`,
 1 AS `floor_type`,
 1 AS `unit_type`,
 1 AS `bathrooms`,
 1 AS `bedrooms`,
 1 AS `garages`,
 1 AS `property_name`,
 1 AS `locality_id`,
 1 AS `property_description`,
 1 AS `street_address`,
 1 AS `email_address`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_leases_upcoming`
--

DROP TABLE IF EXISTS `vw_leases_upcoming`;
/*!50001 DROP VIEW IF EXISTS `vw_leases_upcoming`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_leases_upcoming` AS SELECT 
 1 AS `unit_code`,
 1 AS `lease_id`,
 1 AS `tenant_id`,
 1 AS `expiry_date`,
 1 AS `terminated_by`,
 1 AS `unit_name`,
 1 AS `tenant_name`,
 1 AS `refund_processed`,
 1 AS `refund_invoice_no`,
 1 AS `floor`,
 1 AS `property_code`,
 1 AS `property_name`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_properties`
--

DROP TABLE IF EXISTS `vw_properties`;
/*!50001 DROP VIEW IF EXISTS `vw_properties`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_properties` AS SELECT 
 1 AS `property_code`,
 1 AS `user_code`,
 1 AS `property_name`,
 1 AS `image_path`,
 1 AS `locality_id`,
 1 AS `property_description`,
 1 AS `street_address`,
 1 AS `latitude`,
 1 AS `longitude`,
 1 AS `area_size`,
 1 AS `property_type`,
 1 AS `unit_types`,
 1 AS `flat_roof`,
 1 AS `year_built`,
 1 AS `floors`,
 1 AS `has_cctv`,
 1 AS `pet_friendly`,
 1 AS `has_garden`,
 1 AS `has_parking`,
 1 AS `has_swimming_pool`,
 1 AS `sms_notifications`,
 1 AS `email_notifications`,
 1 AS `is_active`,
 1 AS `is_verified`,
 1 AS `default_color`,
 1 AS `address`,
 1 AS `payment_methods`,
 1 AS `readable_meters`,
 1 AS `occupancy`,
 1 AS `available_units`,
 1 AS `occupied_units`,
 1 AS `constituency_id`,
 1 AS `constituency_name`,
 1 AS `county_id`,
 1 AS `county_name`,
 1 AS `locality_name`,
 1 AS `has_alarm`,
 1 AS `has_generator`,
 1 AS `disability_features`,
 1 AS `has_lift`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_properties_all`
--

DROP TABLE IF EXISTS `vw_properties_all`;
/*!50001 DROP VIEW IF EXISTS `vw_properties_all`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_properties_all` AS SELECT 
 1 AS `property_code`,
 1 AS `user_code`,
 1 AS `property_name`,
 1 AS `image_path`,
 1 AS `locality_id`,
 1 AS `property_description`,
 1 AS `street_address`,
 1 AS `latitude`,
 1 AS `longitude`,
 1 AS `area_size`,
 1 AS `property_type`,
 1 AS `unit_types`,
 1 AS `flat_roof`,
 1 AS `year_built`,
 1 AS `floors`,
 1 AS `has_cctv`,
 1 AS `pet_friendly`,
 1 AS `has_garden`,
 1 AS `has_parking`,
 1 AS `has_swimming_pool`,
 1 AS `sms_notifications`,
 1 AS `email_notifications`,
 1 AS `is_active`,
 1 AS `is_verified`,
 1 AS `default_color`,
 1 AS `address`,
 1 AS `payment_methods`,
 1 AS `readable_meters`,
 1 AS `occupancy`,
 1 AS `constituency_id`,
 1 AS `constituency_name`,
 1 AS `county_id`,
 1 AS `county_name`,
 1 AS `locality_name`,
 1 AS `income`,
 1 AS `expenses`,
 1 AS `orders`,
 1 AS `unpaid_invoices`,
 1 AS `available_units`,
 1 AS `occupied_units`,
 1 AS `has_alarm`,
 1 AS `has_generator`,
 1 AS `disability_features`,
 1 AS `has_lift`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_property_users`
--

DROP TABLE IF EXISTS `vw_property_users`;
/*!50001 DROP VIEW IF EXISTS `vw_property_users`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_property_users` AS SELECT 
 1 AS `manager_id`,
 1 AS `email_address`,
 1 AS `phone_number`,
 1 AS `full_name`,
 1 AS `role_id`,
 1 AS `property_code`,
 1 AS `account_active`,
 1 AS `added_on`,
 1 AS `user_code`,
 1 AS `property_name`,
 1 AS `role_name`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_property_work_orders`
--

DROP TABLE IF EXISTS `vw_property_work_orders`;
/*!50001 DROP VIEW IF EXISTS `vw_property_work_orders`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_property_work_orders` AS SELECT 
 1 AS `property_code`,
 1 AS `work_orders`,
 1 AS `date_posted`,
 1 AS `completed`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_tenant_bills_payments`
--

DROP TABLE IF EXISTS `vw_tenant_bills_payments`;
/*!50001 DROP VIEW IF EXISTS `vw_tenant_bills_payments`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_tenant_bills_payments` AS SELECT 
 1 AS `payment_id`,
 1 AS `payment_date`,
 1 AS `payment_method`,
 1 AS `payment_amount`,
 1 AS `payment_ref`,
 1 AS `payment_by`,
 1 AS `recorded_by`,
 1 AS `bill_id`,
 1 AS `manually_entered`,
 1 AS `is_cancelled`,
 1 AS `cancel_reasons`,
 1 AS `unit_name`,
 1 AS `property_code`,
 1 AS `floor`,
 1 AS `bill_code`,
 1 AS `unit_code`,
 1 AS `cancelled_by`,
 1 AS `cancel_date`,
 1 AS `tenant_id`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_tenant_invoices`
--

DROP TABLE IF EXISTS `vw_tenant_invoices`;
/*!50001 DROP VIEW IF EXISTS `vw_tenant_invoices`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_tenant_invoices` AS SELECT 
 1 AS `bill_id`,
 1 AS `bill_code`,
 1 AS `unit_code`,
 1 AS `bill_date`,
 1 AS `due_date`,
 1 AS `tenant_id`,
 1 AS `is_cancelled`,
 1 AS `cancel_reasons`,
 1 AS `bill_month`,
 1 AS `bill_year`,
 1 AS `tenant_name`,
 1 AS `unit_name`,
 1 AS `property_code`,
 1 AS `total_amount`,
 1 AS `bills_breakdown`,
 1 AS `paid_amount`,
 1 AS `payments_breakdown`,
 1 AS `payment_methods`,
 1 AS `property_name`,
 1 AS `property_address`,
 1 AS `first_name`,
 1 AS `last_name`,
 1 AS `email_address`,
 1 AS `phone_number`,
 1 AS `lease_id`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_tenant_payments`
--

DROP TABLE IF EXISTS `vw_tenant_payments`;
/*!50001 DROP VIEW IF EXISTS `vw_tenant_payments`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_tenant_payments` AS SELECT 
 1 AS `tenant_id`,
 1 AS `property_code`,
 1 AS `unit_code`,
 1 AS `payment_id`,
 1 AS `payment_date`,
 1 AS `payment_method`,
 1 AS `payment_amount`,
 1 AS `payment_ref`,
 1 AS `payment_by`,
 1 AS `bill_id`,
 1 AS `bill_code`,
 1 AS `manually_entered`,
 1 AS `is_cancelled`,
 1 AS `cancel_reasons`,
 1 AS `unit_name`,
 1 AS `floor`,
 1 AS `cancelled_by`,
 1 AS `cancel_date`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_tenant_values`
--

DROP TABLE IF EXISTS `vw_tenant_values`;
/*!50001 DROP VIEW IF EXISTS `vw_tenant_values`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_tenant_values` AS SELECT 
 1 AS `tenant_id`,
 1 AS `balance`,
 1 AS `paid_amount`,
 1 AS `completed_invoices`,
 1 AS `pending_invoices`,
 1 AS `cancelled_invoices`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_tenants`
--

DROP TABLE IF EXISTS `vw_tenants`;
/*!50001 DROP VIEW IF EXISTS `vw_tenants`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_tenants` AS SELECT 
 1 AS `tenant_id`,
 1 AS `gender`,
 1 AS `first_name`,
 1 AS `last_name`,
 1 AS `company_name`,
 1 AS `id_number`,
 1 AS `phone_number`,
 1 AS `alt_phone_number`,
 1 AS `email_address`,
 1 AS `nationality`,
 1 AS `image_path`,
 1 AS `next_of_kins`,
 1 AS `id_front_path`,
 1 AS `id_back_path`,
 1 AS `date_of_birth`,
 1 AS `property_code`,
 1 AS `created_on`,
 1 AS `default_color`,
 1 AS `units`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_tenants_brief`
--

DROP TABLE IF EXISTS `vw_tenants_brief`;
/*!50001 DROP VIEW IF EXISTS `vw_tenants_brief`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_tenants_brief` AS SELECT 
 1 AS `property_code`,
 1 AS `tenant_id`,
 1 AS `tenant_name`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_units`
--

DROP TABLE IF EXISTS `vw_units`;
/*!50001 DROP VIEW IF EXISTS `vw_units`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_units` AS SELECT 
 1 AS `unit_code`,
 1 AS `unit_name`,
 1 AS `image_id`,
 1 AS `property_code`,
 1 AS `floor`,
 1 AS `garages`,
 1 AS `bedrooms`,
 1 AS `bathrooms`,
 1 AS `payment_day`,
 1 AS `unit_type`,
 1 AS `electricity_type`,
 1 AS `water_source`,
 1 AS `furnishing`,
 1 AS `payments_plan`,
 1 AS `internet_available`,
 1 AS `tv_cable_available`,
 1 AS `has_balcony`,
 1 AS `has_garden`,
 1 AS `pet_friendly`,
 1 AS `active_to_rent`,
 1 AS `has_closet`,
 1 AS `has_laundry_room`,
 1 AS `floor_type`,
 1 AS `unit_deposits`,
 1 AS `unit_fixed_bills`,
 1 AS `unit_variable_bills`,
 1 AS `rent_amount`,
 1 AS `effective_from`,
 1 AS `tenant_id`,
 1 AS `tenant_name`,
 1 AS `ad_id`,
 1 AS `average_rating`,
 1 AS `occupied`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_units_brief`
--

DROP TABLE IF EXISTS `vw_units_brief`;
/*!50001 DROP VIEW IF EXISTS `vw_units_brief`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_units_brief` AS SELECT 
 1 AS `property_code`,
 1 AS `unit_code`,
 1 AS `unit_name`,
 1 AS `floor`,
 1 AS `unit_type`,
 1 AS `rent_amount`,
 1 AS `tenant_id`,
 1 AS `occupied`,
 1 AS `tenant_name`,
 1 AS `lease_id`,
 1 AS `ad_id`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_units_count`
--

DROP TABLE IF EXISTS `vw_units_count`;
/*!50001 DROP VIEW IF EXISTS `vw_units_count`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_units_count` AS SELECT 
 1 AS `user_code`,
 1 AS `available_units`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_units_full`
--

DROP TABLE IF EXISTS `vw_units_full`;
/*!50001 DROP VIEW IF EXISTS `vw_units_full`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_units_full` AS SELECT 
 1 AS `unit_code`,
 1 AS `unit_name`,
 1 AS `property_code`,
 1 AS `floor`,
 1 AS `garages`,
 1 AS `bedrooms`,
 1 AS `bathrooms`,
 1 AS `payment_day`,
 1 AS `unit_type`,
 1 AS `electricity_type`,
 1 AS `water_source`,
 1 AS `furnishing`,
 1 AS `payments_plan`,
 1 AS `internet_available`,
 1 AS `tv_cable_available`,
 1 AS `has_balcony`,
 1 AS `has_garden`,
 1 AS `has_closet`,
 1 AS `has_laundry_room`,
 1 AS `pet_friendly`,
 1 AS `active_to_rent`,
 1 AS `floor_type`,
 1 AS `unit_deposits`,
 1 AS `unit_fixed_bills`,
 1 AS `unit_variable_bills`,
 1 AS `rent_amount`,
 1 AS `effective_from`,
 1 AS `tenant_id`,
 1 AS `tenant_name`,
 1 AS `occupied`,
 1 AS `unit_images`,
 1 AS `unit_ratings`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_units_invoices_history`
--

DROP TABLE IF EXISTS `vw_units_invoices_history`;
/*!50001 DROP VIEW IF EXISTS `vw_units_invoices_history`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_units_invoices_history` AS SELECT 
 1 AS `unit_code`,
 1 AS `bill_date`,
 1 AS `bill_id`,
 1 AS `bill_code`,
 1 AS `tenant_id`,
 1 AS `tenant_name`,
 1 AS `total_amount`,
 1 AS `paid_amount`,
 1 AS `is_cancelled`,
 1 AS `unit_name`,
 1 AS `property_code`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_units_last_meter_readings`
--

DROP TABLE IF EXISTS `vw_units_last_meter_readings`;
/*!50001 DROP VIEW IF EXISTS `vw_units_last_meter_readings`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_units_last_meter_readings` AS SELECT 
 1 AS `property_code`,
 1 AS `unit_code`,
 1 AS `unit_name`,
 1 AS `unit_type`,
 1 AS `floor`,
 1 AS `reading_type`,
 1 AS `read_value`,
 1 AS `read_date`,
 1 AS `read_by`,
 1 AS `unit_rate`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_units_leases_history`
--

DROP TABLE IF EXISTS `vw_units_leases_history`;
/*!50001 DROP VIEW IF EXISTS `vw_units_leases_history`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_units_leases_history` AS SELECT 
 1 AS `unit_code`,
 1 AS `lease_id`,
 1 AS `lease_date`,
 1 AS `expiry_date`,
 1 AS `bills_payment_date`,
 1 AS `tenant_id`,
 1 AS `tenant_name`,
 1 AS `is_active`,
 1 AS `unit_name`,
 1 AS `property_code`,
 1 AS `floor`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_units_meter_readings`
--

DROP TABLE IF EXISTS `vw_units_meter_readings`;
/*!50001 DROP VIEW IF EXISTS `vw_units_meter_readings`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_units_meter_readings` AS SELECT 
 1 AS `property_code`,
 1 AS `unit_code`,
 1 AS `unit_name`,
 1 AS `unit_type`,
 1 AS `floor`,
 1 AS `reading_type`,
 1 AS `read_value`,
 1 AS `read_date`,
 1 AS `read_by`,
 1 AS `unit_rate`,
 1 AS `bill_generated`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_units_payments_history`
--

DROP TABLE IF EXISTS `vw_units_payments_history`;
/*!50001 DROP VIEW IF EXISTS `vw_units_payments_history`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_units_payments_history` AS SELECT 
 1 AS `unit_code`,
 1 AS `payment_id`,
 1 AS `bill_id`,
 1 AS `payment_date`,
 1 AS `payment_method`,
 1 AS `payment_amount`,
 1 AS `payment_ref`,
 1 AS `payment_by`,
 1 AS `manually_entered`,
 1 AS `is_cancelled`,
 1 AS `cancel_reasons`,
 1 AS `bill_code`,
 1 AS `unit_name`,
 1 AS `property_code`,
 1 AS `unit_type`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_units_ratings`
--

DROP TABLE IF EXISTS `vw_units_ratings`;
/*!50001 DROP VIEW IF EXISTS `vw_units_ratings`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_units_ratings` AS SELECT 
 1 AS `unit_code`,
 1 AS `rating_id`,
 1 AS `user_rating`,
 1 AS `user_comments`,
 1 AS `user_code`,
 1 AS `customer_name`,
 1 AS `rating_date`,
 1 AS `verified_tenant`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_units_rent_history`
--

DROP TABLE IF EXISTS `vw_units_rent_history`;
/*!50001 DROP VIEW IF EXISTS `vw_units_rent_history`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_units_rent_history` AS SELECT 
 1 AS `unit_code`,
 1 AS `rent_amount`,
 1 AS `effective_from`,
 1 AS `effective_to`,
 1 AS `property_code`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_units_values`
--

DROP TABLE IF EXISTS `vw_units_values`;
/*!50001 DROP VIEW IF EXISTS `vw_units_values`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_units_values` AS SELECT 
 1 AS `property_code`,
 1 AS `unit_code`,
 1 AS `unpaid_amount`,
 1 AS `total_revenue`,
 1 AS `work_orders`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_user_payments`
--

DROP TABLE IF EXISTS `vw_user_payments`;
/*!50001 DROP VIEW IF EXISTS `vw_user_payments`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_user_payments` AS SELECT 
 1 AS `payment_date`,
 1 AS `paid_amount`,
 1 AS `payment_method`,
 1 AS `paid_by`,
 1 AS `payment_ref`,
 1 AS `invoice_id`,
 1 AS `user_code`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_user_subscriptions`
--

DROP TABLE IF EXISTS `vw_user_subscriptions`;
/*!50001 DROP VIEW IF EXISTS `vw_user_subscriptions`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_user_subscriptions` AS SELECT 
 1 AS `user_code`,
 1 AS `package_name`,
 1 AS `subscription_date`,
 1 AS `expiry_date`,
 1 AS `is_active`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_users`
--

DROP TABLE IF EXISTS `vw_users`;
/*!50001 DROP VIEW IF EXISTS `vw_users`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_users` AS SELECT 
 1 AS `user_code`,
 1 AS `username`,
 1 AS `email_address`,
 1 AS `business_code`,
 1 AS `phone_number`,
 1 AS `email_confirmation_code`,
 1 AS `email_confirmation_code_expiry`,
 1 AS `first_name`,
 1 AS `last_name`,
 1 AS `other_names`,
 1 AS `company_name`,
 1 AS `password`,
 1 AS `address`,
 1 AS `referral_code`,
 1 AS `last_login_date`,
 1 AS `security_qn`,
 1 AS `security_an`,
 1 AS `avatar_path`,
 1 AS `avatar_color`,
 1 AS `password_reset_key`,
 1 AS `phone_verified`,
 1 AS `email_verified`,
 1 AS `password_reset_request`,
 1 AS `account_active`,
 1 AS `is_landlord`,
 1 AS `two_fa`,
 1 AS `single_device_login`,
 1 AS `verified_account`,
 1 AS `tour_prompted`,
 1 AS `landlord_prompted`,
 1 AS `available_sms_units`,
 1 AS `referal_code`,
 1 AS `account_creation_date`,
 1 AS `gender`,
 1 AS `phone_otp`,
 1 AS `phone_otp_time`,
 1 AS `is_agent`*/;
SET character_set_client = @saved_cs_client;

--
-- Dumping events for database 'cloud_tena'
--

--
-- Dumping routines for database 'cloud_tena'
--

--
-- Final view structure for view `vw_active_leases`
--

/*!50001 DROP VIEW IF EXISTS `vw_active_leases`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_active_leases` AS select `tbl_units`.`property_code` AS `property_code`,`tbl_a`.`lease_id` AS `lease_id`,`tbl_a`.`unit_code` AS `unit_code`,`tbl_a`.`tenant_id` AS `tenant_id`,`tbl_a`.`lease_date` AS `lease_date`,`tbl_a`.`expiry_date` AS `expiry_date`,`tbl_a`.`terminated_by` AS `terminated_by`,`tbl_a`.`leased_by` AS `leased_by`,`tbl_a`.`deposists` AS `deposists`,`tbl_a`.`monthly_rent` AS `monthly_rent`,`tbl_a`.`fixed_monthly_bills` AS `fixed_monthly_bills`,`tbl_a`.`bills_payment_date` AS `bills_payment_date`,`tbl_a`.`billing_start_date` AS `billing_start_date`,`tbl_a`.`rn` AS `rn`,concat(`tbl_tenants`.`first_name`,' ',`tbl_tenants`.`last_name`) AS `tenant_name` from (((select `x`.`lease_id` AS `lease_id`,`x`.`unit_code` AS `unit_code`,`x`.`tenant_id` AS `tenant_id`,`x`.`lease_date` AS `lease_date`,`x`.`expiry_date` AS `expiry_date`,`x`.`terminated_by` AS `terminated_by`,`x`.`leased_by` AS `leased_by`,`x`.`deposists` AS `deposists`,`x`.`monthly_rent` AS `monthly_rent`,`x`.`fixed_monthly_bills` AS `fixed_monthly_bills`,`x`.`bills_payment_date` AS `bills_payment_date`,`x`.`billing_start_date` AS `billing_start_date`,`x`.`rn` AS `rn` from (select `tbl_units_leases`.`lease_id` AS `lease_id`,`tbl_units_leases`.`unit_code` AS `unit_code`,`tbl_units_leases`.`tenant_id` AS `tenant_id`,`tbl_units_leases`.`lease_date` AS `lease_date`,`tbl_units_leases`.`expiry_date` AS `expiry_date`,`tbl_units_leases`.`terminated_by` AS `terminated_by`,`tbl_units_leases`.`leased_by` AS `leased_by`,`tbl_units_leases`.`deposists` AS `deposists`,`tbl_units_leases`.`monthly_rent` AS `monthly_rent`,`tbl_units_leases`.`fixed_monthly_bills` AS `fixed_monthly_bills`,`tbl_units_leases`.`bills_payment_date` AS `bills_payment_date`,`tbl_units_leases`.`billing_start_date` AS `billing_start_date`,`tbl_units_leases`.`lease_agreement_path` AS `lease_agreement_path`,row_number() OVER (PARTITION BY `tbl_units_leases`.`unit_code` ORDER BY `tbl_units_leases`.`expiry_date` desc )  AS `rn` from `tbl_units_leases` where ((`tbl_units_leases`.`expiry_date` is null) or (`tbl_units_leases`.`expiry_date` > curdate()))) `x` where (`x`.`rn` = 1)) `tbl_a` left join `tbl_tenants` on((`tbl_a`.`tenant_id` = `tbl_tenants`.`tenant_id`))) left join `tbl_units` on((`tbl_a`.`unit_code` = `tbl_units`.`unit_code`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_ads`
--

/*!50001 DROP VIEW IF EXISTS `vw_ads`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_ads` AS select `tbl_ads`.`auto_id` AS `auto_id`,`tbl_ads`.`ad_id` AS `ad_id`,`tbl_ads`.`ad_date` AS `ad_date`,`tbl_ads`.`unit_code` AS `unit_code`,`tbl_ads`.`added_by` AS `added_by`,`tbl_ads`.`total_views` AS `total_views`,`tbl_ads`.`ad_comments` AS `ad_comments`,`tbl_ads`.`is_active` AS `is_active`,`tbl_ads`.`viewing_fees` AS `viewing_fees`,`vw_units`.`unit_name` AS `unit_name`,`vw_units`.`image_id` AS `image_id`,`vw_units`.`property_code` AS `property_code`,`vw_units`.`floor` AS `floor`,`vw_units`.`garages` AS `garages`,`vw_units`.`bedrooms` AS `bedrooms`,`vw_units`.`bathrooms` AS `bathrooms`,`vw_units`.`payment_day` AS `payment_day`,`vw_units`.`unit_type` AS `unit_type`,`vw_units`.`electricity_type` AS `electricity_type`,`vw_units`.`water_source` AS `water_source`,`vw_units`.`furnishing` AS `furnishing`,`vw_units`.`payments_plan` AS `payments_plan`,`vw_units`.`internet_available` AS `internet_available`,`vw_units`.`tv_cable_available` AS `tv_cable_available`,`vw_units`.`has_balcony` AS `has_balcony`,`vw_units`.`has_garden` AS `has_garden`,`vw_units`.`pet_friendly` AS `pet_friendly`,`vw_units`.`active_to_rent` AS `active_to_rent`,`vw_units`.`has_closet` AS `has_closet`,`vw_units`.`has_laundry_room` AS `has_laundry_room`,`vw_units`.`floor_type` AS `floor_type`,`vw_units`.`unit_deposits` AS `unit_deposits`,`vw_units`.`unit_fixed_bills` AS `unit_fixed_bills`,`vw_units`.`unit_variable_bills` AS `unit_variable_bills`,`vw_units`.`rent_amount` AS `rent_amount`,`vw_units`.`effective_from` AS `effective_from`,`vw_units`.`average_rating` AS `average_rating`,`vw_units`.`occupied` AS `occupied`,`vw_properties`.`property_name` AS `property_name`,`vw_properties`.`locality_id` AS `locality_id`,`vw_properties`.`property_type` AS `property_type`,`vw_properties`.`is_verified` AS `is_verified`,`vw_properties`.`constituency_id` AS `constituency_id`,`vw_properties`.`constituency_name` AS `constituency_name`,`vw_properties`.`county_id` AS `county_id`,`vw_properties`.`county_name` AS `county_name`,`vw_properties`.`locality_name` AS `locality_name`,`vw_properties`.`property_description` AS `property_description`,`vw_properties`.`street_address` AS `street_address`,`vw_properties`.`latitude` AS `latitude`,`vw_properties`.`longitude` AS `longitude`,`vw_properties`.`area_size` AS `area_size`,`vw_properties`.`unit_types` AS `unit_types`,`vw_properties`.`flat_roof` AS `flat_roof`,`vw_properties`.`year_built` AS `year_built`,`vw_properties`.`floors` AS `floors`,`vw_properties`.`has_parking` AS `has_parking`,`vw_properties`.`has_swimming_pool` AS `has_swimming_pool`,`vw_properties`.`address` AS `address`,`vw_properties`.`has_alarm` AS `has_alarm`,`vw_properties`.`has_generator` AS `has_generator`,`vw_properties`.`disability_features` AS `disability_features`,`vw_properties`.`has_lift` AS `has_lift` from ((`tbl_ads` left join `vw_units` on((`vw_units`.`unit_code` = `tbl_ads`.`unit_code`))) left join `vw_properties` on((`vw_properties`.`property_code` = `vw_units`.`property_code`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_daily_property_expenses`
--

/*!50001 DROP VIEW IF EXISTS `vw_daily_property_expenses`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_daily_property_expenses` AS select ifnull(sum(`tbl_expenses_breakdown`.`amount`),0) AS `amount`,`tbl_expenses`.`property_code` AS `property_code`,cast(`tbl_expenses`.`created_on` as date) AS `expense_date` from (`tbl_expenses_breakdown` join `tbl_expenses` on((`tbl_expenses_breakdown`.`expense_id` = `tbl_expenses`.`expense_id`))) group by `tbl_expenses`.`property_code`,cast(`tbl_expenses`.`created_on` as date) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_daily_property_income`
--

/*!50001 DROP VIEW IF EXISTS `vw_daily_property_income`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_daily_property_income` AS select cast(`tbl_tenant_bills_payments`.`payment_date` as date) AS `payment_date`,ifnull(sum(`tbl_tenant_bills_payments`.`payment_amount`),0) AS `paid_amount`,`tbl_units`.`property_code` AS `property_code` from ((`tbl_tenant_bills_payments` join `tbl_tenant_bills` on((`tbl_tenant_bills_payments`.`bill_id` = `tbl_tenant_bills`.`bill_id`))) join `tbl_units` on((`tbl_tenant_bills`.`unit_code` = `tbl_units`.`unit_code`))) where (`tbl_tenant_bills_payments`.`is_cancelled` = 0) group by `tbl_units`.`property_code`,cast(`tbl_tenant_bills_payments`.`payment_date` as date) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_expenses`
--

/*!50001 DROP VIEW IF EXISTS `vw_expenses`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_expenses` AS select `tbl_expenses`.`expense_id` AS `expense_id`,`tbl_expenses`.`expense_title` AS `expense_title`,`tbl_expenses`.`expense_description` AS `expense_description`,`tbl_expenses`.`created_on` AS `created_on`,`tbl_expenses`.`created_by` AS `created_by_id`,`tbl_expenses`.`property_code` AS `property_code`,`tbl_expenses`.`unit_code` AS `unit_code`,`tbl_expenses`.`is_cancelled` AS `is_cancelled`,ifnull(sum(`tbl_expenses_breakdown`.`amount`),0) AS `expense_amount`,ifnull(sum(`tbl_expenses_payments`.`amount`),0) AS `paid_amount`,concat(`tbl_users`.`first_name`,' ',`tbl_users`.`last_name`) AS `created_by` from (((`tbl_expenses` left join `tbl_expenses_breakdown` on((`tbl_expenses_breakdown`.`expense_id` = `tbl_expenses`.`expense_id`))) left join `tbl_expenses_payments` on((`tbl_expenses_payments`.`expense_id` = `tbl_expenses`.`expense_id`))) left join `tbl_users` on((`tbl_expenses`.`created_by` = `tbl_users`.`user_code`))) group by `tbl_expenses`.`expense_id` order by `tbl_expenses`.`created_on` desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_invoices`
--

/*!50001 DROP VIEW IF EXISTS `vw_invoices`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_invoices` AS select `tbl_invoices`.`user_code` AS `user_code`,`tbl_invoices`.`invoice_id` AS `invoice_id`,date_format(`tbl_invoices`.`invoice_date`,'%d/%m/%Y') AS `invoice_date`,date_format(`tbl_invoices`.`invoice_due_date`,'%d/%m/%Y') AS `invoice_due_date`,`tbl_invoices`.`invoice_amount` AS `invoice_amount`,(select ifnull(sum(`tbl_invoice_payments`.`paid_amount`),0) from `tbl_invoice_payments` where (`tbl_invoice_payments`.`invoice_id` = `tbl_invoices`.`invoice_id`)) AS `paid_amount`,`tbl_packages`.`package_name` AS `package_name`,`tbl_invoices`.`package_id` AS `package_id`,`tbl_invoices`.`discount_amount` AS `discount_amount` from ((`tbl_invoices` left join `tbl_invoice_payments` on((`tbl_invoice_payments`.`invoice_id` = `tbl_invoices`.`invoice_id`))) left join `tbl_packages` on((`tbl_invoices`.`package_id` = `tbl_packages`.`package_id`))) order by `tbl_invoices`.`invoice_date` desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_leases`
--

/*!50001 DROP VIEW IF EXISTS `vw_leases`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_leases` AS select `tbl_units_leases`.`lease_id` AS `lease_id`,`tbl_units_leases`.`unit_code` AS `unit_code`,`tbl_units_leases`.`tenant_id` AS `tenant_id`,`tbl_units_leases`.`lease_date` AS `lease_date`,`tbl_units_leases`.`expiry_date` AS `expiry_date`,`tbl_units_leases`.`terminated_by` AS `terminated_by`,`tbl_units_leases`.`leased_by` AS `leaser_id`,ifnull((select concat(`tbl_property_users`.`first_name`,' ',`tbl_property_users`.`last_name`) from `tbl_property_users` where (`tbl_property_users`.`email_address` = `tbl_users`.`email_address`)),'SELF') AS `leased_by`,`tbl_units_leases`.`deposists` AS `deposists`,`tbl_units_leases`.`monthly_rent` AS `monthly_rent`,`tbl_units_leases`.`fixed_monthly_bills` AS `fixed_monthly_bills`,`tbl_units_leases`.`bills_payment_date` AS `bills_payment_date`,`tbl_units_leases`.`billing_start_date` AS `billing_start_date`,`tbl_units`.`unit_name` AS `unit_name`,`tbl_units`.`property_code` AS `property_code`,`tbl_units`.`floor` AS `floor`,concat(`tbl_tenants`.`first_name`,' ',`tbl_tenants`.`last_name`) AS `tenant_name`,`tbl_units_leases`.`lease_agreement_path` AS `lease_agreement_path`,`tbl_units_leases`.`file_extension` AS `file_extension`,`tbl_units_leases`.`refund_processed` AS `refund_processed`,`tbl_units_leases`.`refund_invoice_no` AS `refund_invoice_no`,((`tbl_units_leases`.`expiry_date` is null) or (`tbl_units_leases`.`expiry_date` > curdate())) AS `is_active` from (((`tbl_units_leases` left join `tbl_units` on((`tbl_units_leases`.`unit_code` = `tbl_units`.`unit_code`))) left join `tbl_tenants` on((`tbl_units_leases`.`tenant_id` = `tbl_tenants`.`tenant_id`))) left join `tbl_users` on((`tbl_users`.`user_code` = `tbl_units_leases`.`leased_by`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_leases_full`
--

/*!50001 DROP VIEW IF EXISTS `vw_leases_full`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_leases_full` AS select `vw_units`.`unit_code` AS `unit_code`,`vw_units`.`unit_name` AS `unit_name`,`vw_units`.`floor` AS `floor`,`vw_units`.`unit_type` AS `unit_type`,`vw_leases`.`tenant_id` AS `tenant_id`,`vw_leases`.`lease_id` AS `lease_id`,`vw_leases`.`monthly_rent` AS `monthly_rent`,if((`vw_leases`.`expiry_date` is null),'Active',if((`vw_leases`.`expiry_date` > cast(now() as date)),'Expiring Soon','Expired')) AS `status`,`tbl_properties`.`property_name` AS `property_name`,(ifnull(sum(`vw_tenant_invoices`.`total_amount`),0) - ifnull(sum(`vw_tenant_invoices`.`paid_amount`),0)) AS `balance`,`vw_tenants`.`email_address` AS `email_address` from ((((`vw_units` left join `vw_leases` on((`vw_units`.`unit_code` = `vw_leases`.`unit_code`))) left join `tbl_properties` on((`vw_units`.`property_code` = `tbl_properties`.`property_code`))) left join `vw_tenant_invoices` on(((`vw_leases`.`tenant_id` = `vw_tenant_invoices`.`tenant_id`) and (`vw_leases`.`unit_code` = `vw_tenant_invoices`.`unit_code`)))) left join `vw_tenants` on((`vw_tenants`.`tenant_id` = `vw_leases`.`tenant_id`))) group by `vw_units`.`unit_code` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_leases_tenants`
--

/*!50001 DROP VIEW IF EXISTS `vw_leases_tenants`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_leases_tenants` AS select `tbl_units_leases`.`lease_id` AS `lease_id`,`tbl_units_leases`.`unit_code` AS `unit_code`,`tbl_units_leases`.`lease_date` AS `lease_date`,`tbl_units_leases`.`expiry_date` AS `expiry_date`,`tbl_units_leases`.`deposists` AS `deposists`,`tbl_units_leases`.`monthly_rent` AS `monthly_rent`,`tbl_units_leases`.`fixed_monthly_bills` AS `fixed_monthly_bills`,`tbl_units_leases`.`bills_payment_date` AS `bills_payment_date`,`tbl_units_leases`.`billing_start_date` AS `billing_start_date`,`tbl_units`.`unit_name` AS `unit_name`,`tbl_units`.`floor` AS `floor`,`tbl_units`.`electricity_type` AS `electricity_type`,`tbl_units`.`water_source` AS `water_source`,`tbl_units`.`floor_type` AS `floor_type`,`tbl_units`.`unit_type` AS `unit_type`,`tbl_units`.`bathrooms` AS `bathrooms`,`tbl_units`.`bedrooms` AS `bedrooms`,`tbl_units`.`garages` AS `garages`,`tbl_properties`.`property_name` AS `property_name`,`tbl_properties`.`locality_id` AS `locality_id`,`tbl_properties`.`property_description` AS `property_description`,`tbl_properties`.`street_address` AS `street_address`,`tbl_tenants`.`email_address` AS `email_address` from (((`tbl_units_leases` left join `tbl_units` on((`tbl_units_leases`.`unit_code` = `tbl_units`.`unit_code`))) left join `tbl_properties` on((`tbl_units`.`property_code` = `tbl_properties`.`property_code`))) left join `tbl_tenants` on(((`tbl_tenants`.`property_code` = `tbl_properties`.`property_code`) and (`tbl_units_leases`.`tenant_id` = `tbl_tenants`.`tenant_id`)))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_leases_upcoming`
--

/*!50001 DROP VIEW IF EXISTS `vw_leases_upcoming`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_leases_upcoming` AS select `vw_leases`.`unit_code` AS `unit_code`,`vw_leases`.`lease_id` AS `lease_id`,`vw_leases`.`tenant_id` AS `tenant_id`,date_format(`vw_leases`.`expiry_date`,'%d-%m-%Y') AS `expiry_date`,ifnull((select concat(`tbl_property_users`.`first_name`,' ',`tbl_property_users`.`last_name`) from `tbl_property_users` where (`tbl_property_users`.`email_address` = `tbl_users`.`email_address`)),'SELF') AS `terminated_by`,`vw_leases`.`unit_name` AS `unit_name`,`vw_leases`.`tenant_name` AS `tenant_name`,`vw_leases`.`refund_processed` AS `refund_processed`,`vw_leases`.`refund_invoice_no` AS `refund_invoice_no`,`vw_leases`.`floor` AS `floor`,`vw_leases`.`property_code` AS `property_code`,`tbl_properties`.`property_name` AS `property_name` from ((`vw_leases` left join `tbl_users` on((`vw_leases`.`terminated_by` = `tbl_users`.`user_code`))) left join `tbl_properties` on((`vw_leases`.`property_code` = `tbl_properties`.`property_code`))) where ((`vw_leases`.`expiry_date` is not null) and ((cast(`vw_leases`.`expiry_date` as date) >= curdate()) or (`vw_leases`.`refund_processed` = 0))) order by date_format(`vw_leases`.`expiry_date`,'%d-%m-%Y') */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_properties`
--

/*!50001 DROP VIEW IF EXISTS `vw_properties`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_properties` AS select `tbl_properties`.`property_code` AS `property_code`,`tbl_properties`.`user_code` AS `user_code`,`tbl_properties`.`property_name` AS `property_name`,(select `tbl_property_images`.`image_id` from `tbl_property_images` where ((`tbl_property_images`.`is_default` = true) and (`tbl_property_images`.`property_code` = `tbl_properties`.`property_code`)) limit 1) AS `image_path`,`tbl_properties`.`locality_id` AS `locality_id`,`tbl_properties`.`property_description` AS `property_description`,`tbl_properties`.`street_address` AS `street_address`,`tbl_properties`.`latitude` AS `latitude`,`tbl_properties`.`longitude` AS `longitude`,`tbl_properties`.`area_size` AS `area_size`,`tbl_properties`.`property_type` AS `property_type`,`tbl_properties`.`unit_types` AS `unit_types`,`tbl_properties`.`flat_roof` AS `flat_roof`,`tbl_properties`.`year_built` AS `year_built`,`tbl_properties`.`floors` AS `floors`,`tbl_properties`.`has_cctv` AS `has_cctv`,`tbl_properties`.`pet_friendly` AS `pet_friendly`,`tbl_properties`.`has_garden` AS `has_garden`,`tbl_properties`.`has_parking` AS `has_parking`,`tbl_properties`.`has_swimming_pool` AS `has_swimming_pool`,`tbl_properties`.`sms_notifications` AS `sms_notifications`,`tbl_properties`.`email_notifications` AS `email_notifications`,`tbl_properties`.`is_active` AS `is_active`,`tbl_properties`.`is_verified` AS `is_verified`,`tbl_properties`.`default_color` AS `default_color`,`tbl_properties`.`address` AS `address`,`tbl_properties`.`payment_methods` AS `payment_methods`,`tbl_properties`.`readable_meters` AS `readable_meters`,round((((select count(`vw_units`.`unit_code`) from `vw_units` where ((`vw_units`.`occupied` = 1) and (`vw_units`.`property_code` = `tbl_properties`.`property_code`))) / (select count(`vw_units`.`unit_code`) from `vw_units` where (`vw_units`.`property_code` = `tbl_properties`.`property_code`))) * 100),2) AS `occupancy`,(select count(`vw_units`.`unit_code`) from `vw_units` where (`vw_units`.`property_code` = `tbl_properties`.`property_code`)) AS `available_units`,(select count(`vw_units`.`unit_code`) from `vw_units` where ((`vw_units`.`occupied` = 1) and (`vw_units`.`property_code` = `tbl_properties`.`property_code`))) AS `occupied_units`,`tbl_constituencies`.`constituency_id` AS `constituency_id`,`tbl_constituencies`.`constituency_name` AS `constituency_name`,`tbl_counties`.`county_id` AS `county_id`,`tbl_counties`.`county_name` AS `county_name`,`tbl_localities`.`locality_name` AS `locality_name`,`tbl_properties`.`has_alarm` AS `has_alarm`,`tbl_properties`.`has_generator` AS `has_generator`,`tbl_properties`.`disability_features` AS `disability_features`,`tbl_properties`.`has_lift` AS `has_lift` from (((`tbl_properties` left join `tbl_localities` on((`tbl_properties`.`locality_id` = `tbl_localities`.`locality_id`))) left join `tbl_constituencies` on((`tbl_localities`.`constituency_id` = `tbl_constituencies`.`constituency_id`))) left join `tbl_counties` on((`tbl_constituencies`.`county_id` = `tbl_counties`.`county_id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_properties_all`
--

/*!50001 DROP VIEW IF EXISTS `vw_properties_all`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_properties_all` AS select `vw_properties`.`property_code` AS `property_code`,`vw_properties`.`user_code` AS `user_code`,`vw_properties`.`property_name` AS `property_name`,`vw_properties`.`image_path` AS `image_path`,`vw_properties`.`locality_id` AS `locality_id`,`vw_properties`.`property_description` AS `property_description`,`vw_properties`.`street_address` AS `street_address`,`vw_properties`.`latitude` AS `latitude`,`vw_properties`.`longitude` AS `longitude`,`vw_properties`.`area_size` AS `area_size`,`vw_properties`.`property_type` AS `property_type`,`vw_properties`.`unit_types` AS `unit_types`,`vw_properties`.`flat_roof` AS `flat_roof`,`vw_properties`.`year_built` AS `year_built`,`vw_properties`.`floors` AS `floors`,`vw_properties`.`has_cctv` AS `has_cctv`,`vw_properties`.`pet_friendly` AS `pet_friendly`,`vw_properties`.`has_garden` AS `has_garden`,`vw_properties`.`has_parking` AS `has_parking`,`vw_properties`.`has_swimming_pool` AS `has_swimming_pool`,`vw_properties`.`sms_notifications` AS `sms_notifications`,`vw_properties`.`email_notifications` AS `email_notifications`,`vw_properties`.`is_active` AS `is_active`,`vw_properties`.`is_verified` AS `is_verified`,`vw_properties`.`default_color` AS `default_color`,`vw_properties`.`address` AS `address`,`vw_properties`.`payment_methods` AS `payment_methods`,`vw_properties`.`readable_meters` AS `readable_meters`,`vw_properties`.`occupancy` AS `occupancy`,`vw_properties`.`constituency_id` AS `constituency_id`,`vw_properties`.`constituency_name` AS `constituency_name`,`vw_properties`.`county_id` AS `county_id`,`vw_properties`.`county_name` AS `county_name`,`vw_properties`.`locality_name` AS `locality_name`,(select ifnull(sum(`vw_daily_property_income`.`paid_amount`),0) from `vw_daily_property_income` where ((year(`vw_daily_property_income`.`payment_date`) = year(curdate())) and (month(`vw_daily_property_income`.`payment_date`) = month(curdate())) and (`vw_daily_property_income`.`property_code` = `vw_properties`.`property_code`))) AS `income`,(select ifnull(sum(`vw_daily_property_expenses`.`amount`),0) from `vw_daily_property_expenses` where ((year(`vw_daily_property_expenses`.`expense_date`) = year(curdate())) and (month(`vw_daily_property_expenses`.`expense_date`) = month(curdate())) and (`vw_daily_property_expenses`.`property_code` = `vw_properties`.`property_code`))) AS `expenses`,(select ifnull(sum(`vw_property_work_orders`.`work_orders`),0) from `vw_property_work_orders` where ((year(`vw_property_work_orders`.`date_posted`) = year(curdate())) and (month(`vw_property_work_orders`.`date_posted`) = month(curdate())) and (`vw_property_work_orders`.`completed` = 0) and (`vw_property_work_orders`.`property_code` = `vw_properties`.`property_code`))) AS `orders`,(select count(`vw_tenant_invoices`.`bill_id`) from `vw_tenant_invoices` where ((`vw_tenant_invoices`.`is_cancelled` = 0) and ((`vw_tenant_invoices`.`total_amount` - `vw_tenant_invoices`.`paid_amount`) > 0) and (`vw_tenant_invoices`.`property_code` = `vw_properties`.`property_code`))) AS `unpaid_invoices`,`vw_properties`.`available_units` AS `available_units`,`vw_properties`.`occupied_units` AS `occupied_units`,`vw_properties`.`has_alarm` AS `has_alarm`,`vw_properties`.`has_generator` AS `has_generator`,`vw_properties`.`disability_features` AS `disability_features`,`vw_properties`.`has_lift` AS `has_lift` from `vw_properties` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_property_users`
--

/*!50001 DROP VIEW IF EXISTS `vw_property_users`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_property_users` AS select `tbl_property_users`.`manager_id` AS `manager_id`,`tbl_property_users`.`email_address` AS `email_address`,`tbl_property_users`.`phone_number` AS `phone_number`,concat_ws(' ',`tbl_property_users`.`first_name`,`tbl_property_users`.`last_name`) AS `full_name`,`tbl_property_users`.`role_id` AS `role_id`,`tbl_property_users`.`property_code` AS `property_code`,`tbl_property_users`.`account_active` AS `account_active`,`tbl_property_users`.`added_on` AS `added_on`,`tbl_property_users`.`user_code` AS `user_code`,`tbl_properties`.`property_name` AS `property_name`,`tbl_property_user_roles`.`role_name` AS `role_name` from ((`tbl_property_users` left join `tbl_properties` on((`tbl_property_users`.`property_code` = `tbl_properties`.`property_code`))) left join `tbl_property_user_roles` on((`tbl_property_users`.`role_id` = `tbl_property_user_roles`.`role_id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_property_work_orders`
--

/*!50001 DROP VIEW IF EXISTS `vw_property_work_orders`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_property_work_orders` AS select `tbl_units`.`property_code` AS `property_code`,ifnull(count(`tbl_work_orders`.`id`),0) AS `work_orders`,`tbl_work_orders`.`date_posted` AS `date_posted`,`tbl_work_orders`.`completed` AS `completed` from (`tbl_work_orders` join `tbl_units` on((`tbl_work_orders`.`unit_code` = `tbl_units`.`unit_code`))) group by `tbl_units`.`property_code`,`tbl_work_orders`.`date_posted` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_tenant_bills_payments`
--

/*!50001 DROP VIEW IF EXISTS `vw_tenant_bills_payments`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_tenant_bills_payments` AS select `tbl_tenant_bills_payments`.`payment_id` AS `payment_id`,`tbl_tenant_bills_payments`.`payment_date` AS `payment_date`,`tbl_tenant_bills_payments`.`payment_method` AS `payment_method`,`tbl_tenant_bills_payments`.`payment_amount` AS `payment_amount`,`tbl_tenant_bills_payments`.`payment_ref` AS `payment_ref`,`tbl_tenant_bills_payments`.`payment_by` AS `payment_by`,`tbl_tenant_bills_payments`.`recorded_by` AS `recorded_by`,`tbl_tenant_bills_payments`.`bill_id` AS `bill_id`,`tbl_tenant_bills_payments`.`manually_entered` AS `manually_entered`,`tbl_tenant_bills_payments`.`is_cancelled` AS `is_cancelled`,`tbl_tenant_bills_payments`.`cancel_reasons` AS `cancel_reasons`,`tbl_units`.`unit_name` AS `unit_name`,`tbl_units`.`property_code` AS `property_code`,`tbl_units`.`floor` AS `floor`,`tbl_tenant_bills`.`bill_code` AS `bill_code`,`tbl_units`.`unit_code` AS `unit_code`,`tbl_tenant_bills_payments`.`cancelled_by` AS `cancelled_by`,`tbl_tenant_bills_payments`.`cancel_date` AS `cancel_date`,`tbl_tenant_bills`.`tenant_id` AS `tenant_id` from ((`tbl_tenant_bills_payments` join `tbl_tenant_bills` on((`tbl_tenant_bills_payments`.`bill_id` = `tbl_tenant_bills`.`bill_id`))) join `tbl_units` on((`tbl_tenant_bills`.`unit_code` = `tbl_units`.`unit_code`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_tenant_invoices`
--

/*!50001 DROP VIEW IF EXISTS `vw_tenant_invoices`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_tenant_invoices` AS select `tbl_tenant_bills`.`bill_id` AS `bill_id`,`tbl_tenant_bills`.`bill_code` AS `bill_code`,`tbl_tenant_bills`.`unit_code` AS `unit_code`,`tbl_tenant_bills`.`bill_date` AS `bill_date`,`tbl_tenant_bills`.`due_date` AS `due_date`,`tbl_tenant_bills`.`tenant_id` AS `tenant_id`,`tbl_tenant_bills`.`is_cancelled` AS `is_cancelled`,`tbl_tenant_bills`.`cancel_reasons` AS `cancel_reasons`,month(`tbl_tenant_bills`.`bill_date`) AS `bill_month`,year(`tbl_tenant_bills`.`bill_date`) AS `bill_year`,concat(`tbl_tenants`.`first_name`,' ',`tbl_tenants`.`last_name`) AS `tenant_name`,`tbl_units`.`unit_name` AS `unit_name`,`tbl_units`.`property_code` AS `property_code`,(select ifnull(sum(`tbl_tenant_bills_breakdown`.`bill_amount`),0) from `tbl_tenant_bills_breakdown` where (`tbl_tenant_bills_breakdown`.`bill_id` = `tbl_tenant_bills`.`bill_id`)) AS `total_amount`,(select concat('[',ifnull(group_concat(json_object('bill_name',`tbl_tenant_bills_breakdown`.`bill_name`,'bill_amount',`tbl_tenant_bills_breakdown`.`bill_amount`) separator ','),''),']') from `tbl_tenant_bills_breakdown` where (`tbl_tenant_bills_breakdown`.`bill_id` = `tbl_tenant_bills`.`bill_id`)) AS `bills_breakdown`,(select ifnull(sum(`tbl_tenant_bills_payments`.`payment_amount`),0) from `tbl_tenant_bills_payments` where ((`tbl_tenant_bills_payments`.`is_cancelled` = 0) and (`tbl_tenant_bills_payments`.`bill_id` = `tbl_tenant_bills`.`bill_id`))) AS `paid_amount`,(select concat('[',ifnull(group_concat(json_object('payment_date',date_format(`tbl_tenant_bills_payments`.`payment_date`,'%d-%m-%Y %h:%i %p'),'payment_method',`tbl_tenant_bills_payments`.`payment_method`,'payment_amount',`tbl_tenant_bills_payments`.`payment_amount`,'payment_ref',`tbl_tenant_bills_payments`.`payment_ref`) order by `tbl_tenant_bills_payments`.`payment_date` DESC separator ','),''),']') from `tbl_tenant_bills_payments` where ((`tbl_tenant_bills_payments`.`is_cancelled` = false) and (`tbl_tenant_bills_payments`.`bill_id` = `tbl_tenant_bills`.`bill_id`))) AS `payments_breakdown`,`tbl_properties`.`payment_methods` AS `payment_methods`,`tbl_properties`.`property_name` AS `property_name`,`tbl_properties`.`address` AS `property_address`,`tbl_tenants`.`first_name` AS `first_name`,`tbl_tenants`.`last_name` AS `last_name`,`tbl_tenants`.`email_address` AS `email_address`,`tbl_tenants`.`phone_number` AS `phone_number`,`tbl_tenant_bills`.`lease_id` AS `lease_id` from ((((`tbl_tenant_bills` left join `tbl_tenants` on((`tbl_tenant_bills`.`tenant_id` = `tbl_tenants`.`tenant_id`))) left join `tbl_units` on((`tbl_tenant_bills`.`unit_code` = `tbl_units`.`unit_code`))) left join `tbl_tenant_bills_payments` on((`tbl_tenant_bills_payments`.`bill_id` = `tbl_tenant_bills`.`bill_id`))) left join `tbl_properties` on((`tbl_properties`.`property_code` = `tbl_units`.`property_code`))) group by `tbl_tenant_bills`.`bill_id` order by `tbl_tenant_bills`.`bill_date` desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_tenant_payments`
--

/*!50001 DROP VIEW IF EXISTS `vw_tenant_payments`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_tenant_payments` AS select `vw_tenant_bills_payments`.`tenant_id` AS `tenant_id`,`vw_tenant_bills_payments`.`property_code` AS `property_code`,`vw_tenant_bills_payments`.`unit_code` AS `unit_code`,`vw_tenant_bills_payments`.`payment_id` AS `payment_id`,date_format(`vw_tenant_bills_payments`.`payment_date`,'%d-%m-%Y') AS `payment_date`,`vw_tenant_bills_payments`.`payment_method` AS `payment_method`,`vw_tenant_bills_payments`.`payment_amount` AS `payment_amount`,`vw_tenant_bills_payments`.`payment_ref` AS `payment_ref`,`vw_tenant_bills_payments`.`payment_by` AS `payment_by`,`vw_tenant_bills_payments`.`bill_id` AS `bill_id`,`vw_tenant_bills_payments`.`bill_code` AS `bill_code`,`vw_tenant_bills_payments`.`manually_entered` AS `manually_entered`,`vw_tenant_bills_payments`.`is_cancelled` AS `is_cancelled`,`vw_tenant_bills_payments`.`cancel_reasons` AS `cancel_reasons`,`vw_tenant_bills_payments`.`unit_name` AS `unit_name`,`vw_tenant_bills_payments`.`floor` AS `floor`,ifnull((select concat(`tbl_property_users`.`first_name`,' ',`tbl_property_users`.`last_name`) from `tbl_property_users` where (`tbl_property_users`.`email_address` = `tbl_users`.`email_address`)),'SELF') AS `cancelled_by`,date_format(`vw_tenant_bills_payments`.`cancel_date`,'%d-%m-%Y %h:%i %p') AS `cancel_date` from (`vw_tenant_bills_payments` left join `tbl_users` on((`vw_tenant_bills_payments`.`cancelled_by` = `tbl_users`.`user_code`))) order by cast(`vw_tenant_bills_payments`.`payment_date` as date) desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_tenant_values`
--

/*!50001 DROP VIEW IF EXISTS `vw_tenant_values`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_tenant_values` AS select `tb_a`.`tenant_id` AS `tenant_id`,ifnull(`tb_b`.`balance`,0) AS `balance`,ifnull(`tb_c`.`paid_amount`,0) AS `paid_amount`,ifnull(`tb_d`.`completed_invoices`,0) AS `completed_invoices`,ifnull(`tb_e`.`pending_invoices`,0) AS `pending_invoices`,ifnull(`tb_f`.`cancelled_invoices`,0) AS `cancelled_invoices` from ((((((select `tbl_tenants`.`tenant_id` AS `tenant_id` from `tbl_tenants`) `tb_a` left join (select `vw_tenant_invoices`.`tenant_id` AS `tenant_id`,sum((`vw_tenant_invoices`.`total_amount` - `vw_tenant_invoices`.`paid_amount`)) AS `balance` from `vw_tenant_invoices` where (`vw_tenant_invoices`.`is_cancelled` = false) group by `vw_tenant_invoices`.`tenant_id`) `tb_b` on((`tb_b`.`tenant_id` = `tb_a`.`tenant_id`))) left join (select `vw_tenant_invoices`.`tenant_id` AS `tenant_id`,sum(`vw_tenant_invoices`.`paid_amount`) AS `paid_amount` from `vw_tenant_invoices` group by `vw_tenant_invoices`.`tenant_id`) `tb_c` on((`tb_c`.`tenant_id` = `tb_a`.`tenant_id`))) left join (select `vw_tenant_invoices`.`tenant_id` AS `tenant_id`,count(`vw_tenant_invoices`.`bill_id`) AS `completed_invoices` from `vw_tenant_invoices` where ((`vw_tenant_invoices`.`is_cancelled` = false) and ((`vw_tenant_invoices`.`total_amount` - `vw_tenant_invoices`.`paid_amount`) <= 0)) group by `vw_tenant_invoices`.`tenant_id`) `tb_d` on((`tb_d`.`tenant_id` = `tb_a`.`tenant_id`))) left join (select `vw_tenant_invoices`.`tenant_id` AS `tenant_id`,count(`vw_tenant_invoices`.`bill_id`) AS `pending_invoices` from `vw_tenant_invoices` where ((`vw_tenant_invoices`.`is_cancelled` = false) and ((`vw_tenant_invoices`.`total_amount` - `vw_tenant_invoices`.`paid_amount`) > 0)) group by `vw_tenant_invoices`.`tenant_id`) `tb_e` on((`tb_e`.`tenant_id` = `tb_a`.`tenant_id`))) left join (select `vw_tenant_invoices`.`tenant_id` AS `tenant_id`,count(`vw_tenant_invoices`.`bill_id`) AS `cancelled_invoices` from `vw_tenant_invoices` where (`vw_tenant_invoices`.`is_cancelled` = true) group by `vw_tenant_invoices`.`tenant_id`) `tb_f` on((`tb_f`.`tenant_id` = `tb_a`.`tenant_id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_tenants`
--

/*!50001 DROP VIEW IF EXISTS `vw_tenants`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_tenants` AS select `tbl_tenants`.`tenant_id` AS `tenant_id`,`tbl_tenants`.`gender` AS `gender`,`tbl_tenants`.`first_name` AS `first_name`,`tbl_tenants`.`last_name` AS `last_name`,`tbl_tenants`.`company_name` AS `company_name`,`tbl_tenants`.`id_number` AS `id_number`,`tbl_tenants`.`phone_number` AS `phone_number`,`tbl_tenants`.`alt_phone_number` AS `alt_phone_number`,`tbl_tenants`.`email_address` AS `email_address`,`tbl_tenants`.`nationality` AS `nationality`,`tbl_tenants`.`image_path` AS `image_path`,`tbl_tenants`.`next_of_kins` AS `next_of_kins`,`tbl_tenants`.`id_front_path` AS `id_front_path`,`tbl_tenants`.`id_back_path` AS `id_back_path`,`tbl_tenants`.`date_of_birth` AS `date_of_birth`,`tbl_tenants`.`property_code` AS `property_code`,`tbl_tenants`.`created_on` AS `created_on`,`tbl_tenants`.`default_color` AS `default_color`,(select group_concat(`tbl_units`.`unit_name` separator ',') from (`vw_active_leases` left join `tbl_units` on((`tbl_units`.`unit_code` = `vw_active_leases`.`unit_code`))) where (`vw_active_leases`.`tenant_id` = `tbl_tenants`.`tenant_id`)) AS `units` from `tbl_tenants` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_tenants_brief`
--

/*!50001 DROP VIEW IF EXISTS `vw_tenants_brief`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_tenants_brief` AS select `tbl_tenants`.`property_code` AS `property_code`,`tbl_tenants`.`tenant_id` AS `tenant_id`,if(((`tbl_tenants`.`phone_number` is null) or (`tbl_tenants`.`phone_number` = '')),concat(`tbl_tenants`.`first_name`,' ',`tbl_tenants`.`last_name`),concat(`tbl_tenants`.`first_name`,' ',`tbl_tenants`.`last_name`,' - ',`tbl_tenants`.`phone_number`)) AS `tenant_name` from `tbl_tenants` order by cast(`tbl_tenants`.`created_on` as date) desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_units`
--

/*!50001 DROP VIEW IF EXISTS `vw_units`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_units` AS select `tb_a`.`unit_code` AS `unit_code`,`tb_a`.`unit_name` AS `unit_name`,`tb_images`.`image_id` AS `image_id`,`tb_a`.`property_code` AS `property_code`,`tb_a`.`floor` AS `floor`,`tb_a`.`garages` AS `garages`,`tb_a`.`bedrooms` AS `bedrooms`,`tb_a`.`bathrooms` AS `bathrooms`,`tb_a`.`payment_day` AS `payment_day`,`tb_a`.`unit_type` AS `unit_type`,`tb_a`.`electricity_type` AS `electricity_type`,`tb_a`.`water_source` AS `water_source`,`tb_a`.`furnishing` AS `furnishing`,`tb_a`.`payments_plan` AS `payments_plan`,`tb_a`.`internet_available` AS `internet_available`,`tb_a`.`tv_cable_available` AS `tv_cable_available`,`tb_a`.`has_balcony` AS `has_balcony`,`tb_a`.`has_garden` AS `has_garden`,`tb_a`.`pet_friendly` AS `pet_friendly`,`tb_a`.`active_to_rent` AS `active_to_rent`,`tb_a`.`has_closet` AS `has_closet`,`tb_a`.`has_laundry_room` AS `has_laundry_room`,`tb_a`.`floor_type` AS `floor_type`,`tb_a`.`unit_deposits` AS `unit_deposits`,`tb_a`.`unit_fixed_bills` AS `unit_fixed_bills`,`tb_a`.`unit_variable_bills` AS `unit_variable_bills`,`tb_b`.`rent_amount` AS `rent_amount`,`tb_b`.`effective_from` AS `effective_from`,`tb_c`.`tenant_id` AS `tenant_id`,`tb_c`.`tenant_name` AS `tenant_name`,`tbl_ads`.`ad_id` AS `ad_id`,`tb_d`.`average_rating` AS `average_rating`,if((`tb_c`.`tenant_id` is null),0,1) AS `occupied` from ((((((select `tbl_units`.`unit_code` AS `unit_code`,`tbl_units`.`unit_name` AS `unit_name`,`tbl_units`.`property_code` AS `property_code`,`tbl_units`.`floor` AS `floor`,`tbl_units`.`garages` AS `garages`,`tbl_units`.`bedrooms` AS `bedrooms`,`tbl_units`.`bathrooms` AS `bathrooms`,`tbl_units`.`payment_day` AS `payment_day`,`tbl_units`.`unit_type` AS `unit_type`,`tbl_units`.`electricity_type` AS `electricity_type`,`tbl_units`.`water_source` AS `water_source`,`tbl_units`.`furnishing` AS `furnishing`,`tbl_units`.`payments_plan` AS `payments_plan`,`tbl_units`.`internet_available` AS `internet_available`,`tbl_units`.`tv_cable_available` AS `tv_cable_available`,`tbl_units`.`has_balcony` AS `has_balcony`,`tbl_units`.`has_garden` AS `has_garden`,`tbl_units`.`has_closet` AS `has_closet`,`tbl_units`.`has_laundry_room` AS `has_laundry_room`,`tbl_units`.`floor_type` AS `floor_type`,`tbl_units`.`pet_friendly` AS `pet_friendly`,`tbl_units`.`active_to_rent` AS `active_to_rent`,`tbl_units`.`unit_deposits` AS `unit_deposits`,`tbl_units`.`unit_fixed_bills` AS `unit_fixed_bills`,`tbl_units`.`unit_variable_bills` AS `unit_variable_bills` from `tbl_units`) `tb_a` left join (select `tbl_units_images`.`image_id` AS `image_id`,`tbl_units_images`.`unit_code` AS `unit_code` from `tbl_units_images` where (`tbl_units_images`.`is_default` = 1)) `tb_images` on((`tb_a`.`unit_code` = `tb_images`.`unit_code`))) left join (select `x`.`unit_code` AS `unit_code`,`x`.`rent_amount` AS `rent_amount`,`x`.`effective_from` AS `effective_from` from (select `tbl_unit_rents`.`unit_code` AS `unit_code`,`tbl_unit_rents`.`rent_amount` AS `rent_amount`,`tbl_unit_rents`.`effective_from` AS `effective_from`,row_number() OVER (PARTITION BY `tbl_unit_rents`.`unit_code` ORDER BY `tbl_unit_rents`.`effective_from` desc )  AS `rn` from `tbl_unit_rents` where (`tbl_unit_rents`.`effective_from` <= curdate())) `x` where (`x`.`rn` = 1)) `tb_b` on((`tb_a`.`unit_code` = `tb_b`.`unit_code`))) left join (select `tbl_a`.`unit_code` AS `unit_code`,`tbl_a`.`tenant_id` AS `tenant_id`,concat(`tbl_tenants`.`first_name`,' ',`tbl_tenants`.`last_name`) AS `tenant_name` from ((select `x`.`unit_code` AS `unit_code`,`x`.`tenant_id` AS `tenant_id` from (select `tbl_units_leases`.`lease_id` AS `lease_id`,`tbl_units_leases`.`unit_code` AS `unit_code`,`tbl_units_leases`.`tenant_id` AS `tenant_id`,`tbl_units_leases`.`lease_date` AS `lease_date`,`tbl_units_leases`.`expiry_date` AS `expiry_date`,`tbl_units_leases`.`terminated_by` AS `terminated_by`,`tbl_units_leases`.`leased_by` AS `leased_by`,`tbl_units_leases`.`deposists` AS `deposists`,`tbl_units_leases`.`monthly_rent` AS `monthly_rent`,`tbl_units_leases`.`fixed_monthly_bills` AS `fixed_monthly_bills`,`tbl_units_leases`.`bills_payment_date` AS `bills_payment_date`,`tbl_units_leases`.`billing_start_date` AS `billing_start_date`,`tbl_units_leases`.`lease_agreement_path` AS `lease_agreement_path`,row_number() OVER (PARTITION BY `tbl_units_leases`.`unit_code` ORDER BY `tbl_units_leases`.`expiry_date` desc )  AS `rn` from `tbl_units_leases` where ((`tbl_units_leases`.`expiry_date` is null) or (`tbl_units_leases`.`expiry_date` > curdate()))) `x` where (`x`.`rn` = 1)) `tbl_a` left join `tbl_tenants` on((`tbl_a`.`tenant_id` = `tbl_tenants`.`tenant_id`)))) `tb_c` on((`tb_a`.`unit_code` = `tb_c`.`unit_code`))) left join (select `tbl_units_ratings`.`unit_code` AS `unit_code`,(sum(`tbl_units_ratings`.`user_rating`) / count(`tbl_units_ratings`.`unit_code`)) AS `average_rating` from `tbl_units_ratings` where (`tbl_units_ratings`.`rating_approved` = 1)) `tb_d` on((`tb_d`.`unit_code` = `tb_a`.`unit_code`))) left join `tbl_ads` on(((`tbl_ads`.`unit_code` = `tb_a`.`unit_code`) and (`tbl_ads`.`ad_id` is not null) and (`tbl_ads`.`is_active` = 1)))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_units_brief`
--

/*!50001 DROP VIEW IF EXISTS `vw_units_brief`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_units_brief` AS select `vw_units`.`property_code` AS `property_code`,`vw_units`.`unit_code` AS `unit_code`,`vw_units`.`unit_name` AS `unit_name`,`vw_units`.`floor` AS `floor`,`vw_units`.`unit_type` AS `unit_type`,`vw_units`.`rent_amount` AS `rent_amount`,`vw_units`.`tenant_id` AS `tenant_id`,`vw_units`.`occupied` AS `occupied`,`vw_units`.`tenant_name` AS `tenant_name`,`vw_active_leases`.`lease_id` AS `lease_id`,`vw_units`.`ad_id` AS `ad_id` from (`vw_units` left join `vw_active_leases` on((`vw_units`.`unit_code` = `vw_active_leases`.`unit_code`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_units_count`
--

/*!50001 DROP VIEW IF EXISTS `vw_units_count`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_units_count` AS select `tbl_properties`.`user_code` AS `user_code`,count(`vw_units`.`unit_code`) AS `available_units` from (`vw_units` left join `tbl_properties` on((`tbl_properties`.`property_code` = `vw_units`.`property_code`))) group by `tbl_properties`.`user_code` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_units_full`
--

/*!50001 DROP VIEW IF EXISTS `vw_units_full`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_units_full` AS select `vw_units`.`unit_code` AS `unit_code`,`vw_units`.`unit_name` AS `unit_name`,`vw_units`.`property_code` AS `property_code`,`vw_units`.`floor` AS `floor`,`vw_units`.`garages` AS `garages`,`vw_units`.`bedrooms` AS `bedrooms`,`vw_units`.`bathrooms` AS `bathrooms`,`vw_units`.`payment_day` AS `payment_day`,`vw_units`.`unit_type` AS `unit_type`,`vw_units`.`electricity_type` AS `electricity_type`,`vw_units`.`water_source` AS `water_source`,`vw_units`.`furnishing` AS `furnishing`,`vw_units`.`payments_plan` AS `payments_plan`,`vw_units`.`internet_available` AS `internet_available`,`vw_units`.`tv_cable_available` AS `tv_cable_available`,`vw_units`.`has_balcony` AS `has_balcony`,`vw_units`.`has_garden` AS `has_garden`,`vw_units`.`has_closet` AS `has_closet`,`vw_units`.`has_laundry_room` AS `has_laundry_room`,`vw_units`.`pet_friendly` AS `pet_friendly`,`vw_units`.`active_to_rent` AS `active_to_rent`,`vw_units`.`floor_type` AS `floor_type`,`vw_units`.`unit_deposits` AS `unit_deposits`,`vw_units`.`unit_fixed_bills` AS `unit_fixed_bills`,`vw_units`.`unit_variable_bills` AS `unit_variable_bills`,`vw_units`.`rent_amount` AS `rent_amount`,date_format(`vw_units`.`effective_from`,'%Y-%m-%d') AS `effective_from`,`vw_units`.`tenant_id` AS `tenant_id`,`vw_units`.`tenant_name` AS `tenant_name`,`vw_units`.`occupied` AS `occupied`,(select concat('[',ifnull(group_concat(json_object('image_id',`tbl_units_images`.`image_id`,'image_description',`tbl_units_images`.`image_description`,'is_default',`tbl_units_images`.`is_default`) separator ','),''),']') from `tbl_units_images` where (`tbl_units_images`.`unit_code` = `vw_units`.`unit_code`)) AS `unit_images`,(select concat('[',json_object('average_rating',ifnull(round((ifnull(sum(`tbl_units_ratings`.`user_rating`),0) / count(`tbl_units_ratings`.`user_rating`)),0),0),'ratings_count',count(`tbl_units_ratings`.`user_rating`)),']') from `tbl_units_ratings` where ((`tbl_units_ratings`.`rating_approved` = 1) and (`tbl_units_ratings`.`unit_code` = `vw_units`.`unit_code`))) AS `unit_ratings` from `vw_units` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_units_invoices_history`
--

/*!50001 DROP VIEW IF EXISTS `vw_units_invoices_history`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_units_invoices_history` AS select `vw_tenant_invoices`.`unit_code` AS `unit_code`,date_format(`vw_tenant_invoices`.`bill_date`,'%d-%m-%Y') AS `bill_date`,`vw_tenant_invoices`.`bill_id` AS `bill_id`,`vw_tenant_invoices`.`bill_code` AS `bill_code`,`vw_tenant_invoices`.`tenant_id` AS `tenant_id`,`vw_tenant_invoices`.`tenant_name` AS `tenant_name`,`vw_tenant_invoices`.`total_amount` AS `total_amount`,`vw_tenant_invoices`.`paid_amount` AS `paid_amount`,`vw_tenant_invoices`.`is_cancelled` AS `is_cancelled`,`vw_tenant_invoices`.`unit_name` AS `unit_name`,`vw_tenant_invoices`.`property_code` AS `property_code` from `vw_tenant_invoices` order by `vw_tenant_invoices`.`bill_date` desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_units_last_meter_readings`
--

/*!50001 DROP VIEW IF EXISTS `vw_units_last_meter_readings`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_units_last_meter_readings` AS select `vw_units_meter_readings`.`property_code` AS `property_code`,`vw_units_meter_readings`.`unit_code` AS `unit_code`,`vw_units_meter_readings`.`unit_name` AS `unit_name`,`vw_units_meter_readings`.`unit_type` AS `unit_type`,`vw_units_meter_readings`.`floor` AS `floor`,`vw_units_meter_readings`.`reading_type` AS `reading_type`,`vw_units_meter_readings`.`read_value` AS `read_value`,max(`vw_units_meter_readings`.`read_date`) AS `read_date`,`vw_units_meter_readings`.`read_by` AS `read_by`,`vw_units_meter_readings`.`unit_rate` AS `unit_rate` from `vw_units_meter_readings` group by `vw_units_meter_readings`.`unit_code`,`vw_units_meter_readings`.`reading_type` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_units_leases_history`
--

/*!50001 DROP VIEW IF EXISTS `vw_units_leases_history`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_units_leases_history` AS select `vw_leases`.`unit_code` AS `unit_code`,`vw_leases`.`lease_id` AS `lease_id`,date_format(`vw_leases`.`lease_date`,'%d-%m-%Y') AS `lease_date`,date_format(`vw_leases`.`expiry_date`,'%d-%m-%Y') AS `expiry_date`,`vw_leases`.`bills_payment_date` AS `bills_payment_date`,`vw_leases`.`tenant_id` AS `tenant_id`,`vw_leases`.`tenant_name` AS `tenant_name`,((`vw_leases`.`expiry_date` is null) or (`vw_leases`.`expiry_date` > curdate())) AS `is_active`,`tbl_units`.`unit_name` AS `unit_name`,`tbl_units`.`property_code` AS `property_code`,`tbl_units`.`floor` AS `floor` from (`vw_leases` left join `tbl_units` on((`tbl_units`.`unit_code` = `vw_leases`.`unit_code`))) order by `vw_leases`.`lease_date` desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_units_meter_readings`
--

/*!50001 DROP VIEW IF EXISTS `vw_units_meter_readings`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_units_meter_readings` AS select `vw_units`.`property_code` AS `property_code`,`tbl_units_meter_readings`.`unit_code` AS `unit_code`,`vw_units`.`unit_name` AS `unit_name`,`vw_units`.`unit_type` AS `unit_type`,`vw_units`.`floor` AS `floor`,`tbl_units_meter_readings`.`reading_type` AS `reading_type`,`tbl_units_meter_readings`.`read_value` AS `read_value`,`tbl_units_meter_readings`.`read_date` AS `read_date`,`tbl_units_meter_readings`.`read_by` AS `read_by`,`tbl_units_meter_readings`.`unit_rate` AS `unit_rate`,`tbl_units_meter_readings`.`bill_generated` AS `bill_generated` from (`tbl_units_meter_readings` left join `vw_units` on((`vw_units`.`unit_code` = `tbl_units_meter_readings`.`unit_code`))) order by `tbl_units_meter_readings`.`read_date` desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_units_payments_history`
--

/*!50001 DROP VIEW IF EXISTS `vw_units_payments_history`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_units_payments_history` AS select `tbl_tenant_bills`.`unit_code` AS `unit_code`,`tbl_tenant_bills_payments`.`payment_id` AS `payment_id`,`tbl_tenant_bills`.`bill_id` AS `bill_id`,date_format(`tbl_tenant_bills_payments`.`payment_date`,'%d-%m-%Y') AS `payment_date`,`tbl_tenant_bills_payments`.`payment_method` AS `payment_method`,`tbl_tenant_bills_payments`.`payment_amount` AS `payment_amount`,`tbl_tenant_bills_payments`.`payment_ref` AS `payment_ref`,`tbl_tenant_bills_payments`.`payment_by` AS `payment_by`,`tbl_tenant_bills_payments`.`manually_entered` AS `manually_entered`,`tbl_tenant_bills_payments`.`is_cancelled` AS `is_cancelled`,`tbl_tenant_bills_payments`.`cancel_reasons` AS `cancel_reasons`,`tbl_tenant_bills`.`bill_code` AS `bill_code`,`tbl_units`.`unit_name` AS `unit_name`,`tbl_units`.`property_code` AS `property_code`,`tbl_units`.`unit_type` AS `unit_type` from ((`tbl_tenant_bills_payments` left join `tbl_tenant_bills` on((`tbl_tenant_bills_payments`.`bill_id` = `tbl_tenant_bills`.`bill_id`))) left join `tbl_units` on((`tbl_tenant_bills`.`unit_code` = `tbl_units`.`unit_code`))) order by `tbl_tenant_bills_payments`.`payment_date` desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_units_ratings`
--

/*!50001 DROP VIEW IF EXISTS `vw_units_ratings`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_units_ratings` AS select `tbl_units_ratings`.`unit_code` AS `unit_code`,`tbl_units_ratings`.`rating_id` AS `rating_id`,`tbl_units_ratings`.`user_rating` AS `user_rating`,`tbl_units_ratings`.`user_comments` AS `user_comments`,`tbl_units_ratings`.`user_code` AS `user_code`,ifnull(concat(`tbl_users`.`first_name`,' ',`tbl_users`.`last_name`),'Anonymous') AS `customer_name`,date_format(`tbl_units_ratings`.`rating_date`,'%d %M, %Y') AS `rating_date`,`tbl_units_ratings`.`verified_tenant` AS `verified_tenant` from (`tbl_units_ratings` left join `tbl_users` on((`tbl_users`.`user_code` = `tbl_units_ratings`.`user_code`))) where ((`tbl_units_ratings`.`rating_approved` = 1) and ((`tbl_units_ratings`.`user_comments` is not null) or (`tbl_units_ratings`.`user_comments` <> ''))) order by `tbl_units_ratings`.`rating_id` desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_units_rent_history`
--

/*!50001 DROP VIEW IF EXISTS `vw_units_rent_history`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_units_rent_history` AS select `tbl_unit_rents`.`unit_code` AS `unit_code`,`tbl_unit_rents`.`rent_amount` AS `rent_amount`,date_format(`tbl_unit_rents`.`effective_from`,'%d-%m-%Y') AS `effective_from`,date_format(`tbl_unit_rents`.`effective_to`,'%d-%m-%Y') AS `effective_to`,`tbl_units`.`property_code` AS `property_code` from (`tbl_unit_rents` left join `tbl_units` on((`tbl_unit_rents`.`unit_code` = `tbl_units`.`unit_code`))) where (`tbl_unit_rents`.`effective_from` <= curdate()) order by date_format(`tbl_unit_rents`.`effective_from`,'%d-%m-%Y') */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_units_values`
--

/*!50001 DROP VIEW IF EXISTS `vw_units_values`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_units_values` AS select `tb_a`.`property_code` AS `property_code`,`tb_a`.`unit_code` AS `unit_code`,ifnull(`tb_b`.`unpaid_amount`,0) AS `unpaid_amount`,ifnull(`tb_c`.`total_revenue`,0) AS `total_revenue`,ifnull(`tb_d`.`work_orders`,0) AS `work_orders` from ((((select `tbl_units`.`property_code` AS `property_code`,`tbl_units`.`unit_code` AS `unit_code` from `tbl_units`) `tb_a` left join (select `vw_tenant_invoices`.`unit_code` AS `unit_code`,sum((`vw_tenant_invoices`.`total_amount` - `vw_tenant_invoices`.`paid_amount`)) AS `unpaid_amount` from `vw_tenant_invoices` where (`vw_tenant_invoices`.`is_cancelled` = 0) group by `vw_tenant_invoices`.`unit_code`) `tb_b` on((`tb_b`.`unit_code` = `tb_a`.`unit_code`))) left join (select `vw_tenant_invoices`.`unit_code` AS `unit_code`,sum(`vw_tenant_invoices`.`paid_amount`) AS `total_revenue` from `vw_tenant_invoices` where (`vw_tenant_invoices`.`is_cancelled` = 0) group by `vw_tenant_invoices`.`unit_code`) `tb_c` on((`tb_c`.`unit_code` = `tb_a`.`unit_code`))) left join (select `tbl_work_orders`.`unit_code` AS `unit_code`,count(`tbl_work_orders`.`id`) AS `work_orders` from `tbl_work_orders` where (`tbl_work_orders`.`completed` <> 1) group by `tbl_work_orders`.`unit_code`) `tb_d` on((`tb_d`.`unit_code` = `tb_a`.`unit_code`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_user_payments`
--

/*!50001 DROP VIEW IF EXISTS `vw_user_payments`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_user_payments` AS select date_format(`tbl_invoice_payments`.`payment_date`,'%d-%m-%Y') AS `payment_date`,format(`tbl_invoice_payments`.`paid_amount`,2) AS `paid_amount`,`tbl_invoice_payments`.`payment_method` AS `payment_method`,`tbl_invoice_payments`.`paid_by` AS `paid_by`,`tbl_invoice_payments`.`payment_ref` AS `payment_ref`,`tbl_invoices`.`invoice_id` AS `invoice_id`,`tbl_invoices`.`user_code` AS `user_code` from (`tbl_invoice_payments` left join `tbl_invoices` on((`tbl_invoices`.`invoice_id` = `tbl_invoice_payments`.`invoice_id`))) order by cast(`tbl_invoice_payments`.`payment_date` as date) desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_user_subscriptions`
--

/*!50001 DROP VIEW IF EXISTS `vw_user_subscriptions`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_user_subscriptions` AS select `tbl_subscriptions`.`user_code` AS `user_code`,`tbl_packages`.`package_name` AS `package_name`,date_format(`tbl_subscriptions`.`subscription_date`,'%d-%m-%Y') AS `subscription_date`,date_format(`tbl_subscriptions`.`expiry_date`,'%d-%m-%Y') AS `expiry_date`,if((cast(now() as date) > cast(`tbl_subscriptions`.`expiry_date` as date)),false,true) AS `is_active` from (`tbl_subscriptions` left join `tbl_packages` on((`tbl_subscriptions`.`package_id` = `tbl_packages`.`package_id`))) order by cast(`tbl_subscriptions`.`expiry_date` as date) desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_users`
--

/*!50001 DROP VIEW IF EXISTS `vw_users`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_users` AS select `tbl_users`.`user_code` AS `user_code`,`tbl_users`.`username` AS `username`,`tbl_users`.`email_address` AS `email_address`,`tbl_users`.`business_code` AS `business_code`,`tbl_users`.`phone_number` AS `phone_number`,`tbl_users`.`email_confirmation_code` AS `email_confirmation_code`,`tbl_users`.`email_confirmation_code_expiry` AS `email_confirmation_code_expiry`,`tbl_users`.`first_name` AS `first_name`,`tbl_users`.`last_name` AS `last_name`,`tbl_users`.`other_names` AS `other_names`,`tbl_users`.`company_name` AS `company_name`,`tbl_users`.`password` AS `password`,`tbl_users`.`address` AS `address`,`tbl_users`.`referral_code` AS `referral_code`,`tbl_users`.`last_login_date` AS `last_login_date`,`tbl_users`.`security_qn` AS `security_qn`,`tbl_users`.`security_an` AS `security_an`,`tbl_users`.`avatar_path` AS `avatar_path`,`tbl_users`.`avatar_color` AS `avatar_color`,`tbl_users`.`password_reset_key` AS `password_reset_key`,`tbl_users`.`phone_verified` AS `phone_verified`,`tbl_users`.`email_verified` AS `email_verified`,`tbl_users`.`password_reset_request` AS `password_reset_request`,`tbl_users`.`account_active` AS `account_active`,`tbl_users`.`is_landlord` AS `is_landlord`,`tbl_users`.`two_fa` AS `two_fa`,`tbl_users`.`single_device_login` AS `single_device_login`,`tbl_users`.`verified_account` AS `verified_account`,`tbl_users`.`tour_prompted` AS `tour_prompted`,`tbl_users`.`landlord_prompted` AS `landlord_prompted`,`tbl_users`.`available_sms_units` AS `available_sms_units`,`tbl_users`.`referal_code` AS `referal_code`,`tbl_users`.`account_creation_date` AS `account_creation_date`,`tbl_users`.`gender` AS `gender`,`tbl_users`.`phone_otp` AS `phone_otp`,`tbl_users`.`phone_otp_time` AS `phone_otp_time`,if((`tbl_property_users`.`email_address` is null),0,1) AS `is_agent` from (`tbl_users` left join `tbl_property_users` on((`tbl_property_users`.`email_address` = `tbl_users`.`email_address`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-04-23  6:58:05
