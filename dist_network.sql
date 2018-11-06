-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 06, 2018 at 03:02 PM
-- Server version: 10.1.28-MariaDB
-- PHP Version: 7.1.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `dist_network`
--

-- --------------------------------------------------------

--
-- Table structure for table `distributor_list`
--

CREATE TABLE `distributor_list` (
  `DNO` int(11) NOT NULL,
  `DNAME` varchar(500) NOT NULL,
  `DEMAIL` varchar(200) NOT NULL,
  `DADDR` text NOT NULL,
  `DPHONE` varchar(100) NOT NULL,
  `DCITY` varchar(200) NOT NULL,
  `DCOUNTRY` varchar(200) NOT NULL,
  `DWEBSITE` varchar(200) NOT NULL,
  `DCONTACTNAME` varchar(500) NOT NULL,
  `FREZE` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `item_list`
--

CREATE TABLE `item_list` (
  `INO` int(11) NOT NULL,
  `INAME` varchar(200) NOT NULL,
  `ITRADEP` float NOT NULL,
  `ISALEP` float NOT NULL,
  `CCODE` int(11) NOT NULL,
  `DESC` text NOT NULL,
  `FREZE` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
