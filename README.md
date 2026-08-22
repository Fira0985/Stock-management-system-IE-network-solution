# TrackEqa — Stock Management System

TrackEqa (Trackእቃ) is a web-based **stock and business management system** designed to help businesses manage inventory, sales, purchases, customers, suppliers, and credit transactions in one centralized system.

The system is designed to reduce manual stock management, improve record accuracy, and provide business owners with clear information about the overall health and performance of their business.

## Features

### 👤 Role-Based Access

TrackEqa provides three user roles, each with different responsibilities and permissions.

#### Owner

The owner has full access to the system and can:

* Create and manage system users
* Assign user roles
* Register and manage customers
* Register and manage suppliers
* Manage products and inventory
* Set customer credit limits
* Manage purchases
* Perform and manage sales
* Manage credit sales
* View business health information
* Access sales, purchase, credit, and inventory reports
* Bulk import product and purchase data
* Export business data in bulk

#### Clerk

The clerk is responsible for day-to-day sales operations and can:

* Perform sales
* View products and inventory
* View customer information
* Record normal sales
* Record credit sales according to the customer's available credit limit
* Access other information required for sales operations

#### Auditor

The auditor has read-only access focused on business analysis.

The auditor can:

* View business health information
* Analyze sales
* Analyze purchases
* Review credit-related information
* View inventory information
* Access business reports

The auditor cannot modify business records.

## 📦 Product & Stock Management

TrackEqa allows the business owner to manage products and maintain accurate stock records.

The system supports:

* Product registration
* Product updates
* Stock quantity management
* Stock monitoring
* Stock changes resulting from sales and purchases
* Bulk product import

## 🛒 Sales Management

TrackEqa supports day-to-day sales operations.

Users can record:

* Normal sales
* Customer sales
* Credit sales

Sales records are used to maintain accurate inventory and provide information for business reports.

## 💰 Credit Sales

The system provides a credit management feature for registered customers.

The owner can assign a **credit limit** to each customer. Credit sales are then managed based on the customer's permitted credit limit.

This allows the business to keep track of:

* Customer credit limits
* Credit sales
* Outstanding credit
* Credit-related business information

## 👥 Customer Management

The owner can register and manage customers in the system.

Customer records can be associated with sales and credit transactions, making it easier to maintain organized customer and credit information.

## 🚚 Supplier Management

The owner can register and manage suppliers.

Supplier information is used when managing purchases and maintaining organized purchasing records.

## 🛍️ Purchase Management

TrackEqa allows the owner to record and manage product purchases.

Purchase records help the system maintain inventory information and provide data for purchase-related reports and business analysis.

The owner can also use bulk import functionality when dealing with large amounts of product or purchase data.

## 📊 Business Health & Reports

TrackEqa provides reports and business information to help the owner and auditor understand the performance and health of the business.

Reports include information related to:

* Sales
* Purchases
* Credit
* Inventory
* Business performance

These reports help users analyze business activities and make better decisions based on recorded data.

## 📥 Bulk Import

To reduce repetitive manual data entry, TrackEqa supports bulk data import.

The owner can import large amounts of product or purchase-related information instead of entering records individually.

## 📤 Bulk Export

TrackEqa also supports bulk data export.

Business data can be exported for:

* Record keeping
* Backup
* Further analysis
* Data processing

## 🔐 Access Control

TrackEqa separates system responsibilities through role-based access control.

| Role        | Main Responsibility                 |
| ----------- | ----------------------------------- |
| **Owner**   | Full system and business management |
| **Clerk**   | Sales and day-to-day operations     |
| **Auditor** | Business analysis and reports       |

This separation helps protect business information while ensuring each user has access to the features required for their responsibilities.

## 🎯 Project Objectives

TrackEqa was developed to solve common problems associated with manually managing business stock and records.

The main objectives are to:

* Reduce manual stock management
* Centralize business records
* Improve inventory accuracy
* Simplify sales and purchase management
* Manage customer credit more effectively
* Reduce repetitive data entry
* Provide business reports and analysis
* Help owners understand their business health
* Improve the efficiency of day-to-day business operations

## 🛠️ Technology Stack

### Frontend

* React.js
* JavaScript
* HTML5
* CSS3

### Backend

* Node.js
* Express.js

### Database

* MySQL / SQL

### Other Tools

* Git
* GitHub
* REST APIs
* Excel

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

* Node.js
* npm
* MySQL
* Git

### Clone the Repository

```bash
git clone <your-repository-url>
cd TrackEqa
```

### Install Dependencies

Install the backend dependencies:

```bash
cd server
npm install
```

Install the frontend dependencies:

```bash
cd ../client
npm install
```

### Environment Variables

Create a `.env` file in the backend and configure the required environment variables.

```env
PORT=5000
DB_HOST=localhost
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=trackeqa
```

### Run the Application

Start the backend:

```bash
cd server
npm run dev
```

Start the frontend in another terminal:

```bash
cd client
npm start
```

## Project Status

TrackEqa is a functional stock and business management system developed to support real-world business inventory, sales, purchasing, and reporting operations.

## Author

**Firafis Berhanu**



