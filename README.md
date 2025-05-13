# Patient Registration App

This is a simple web application built with **Next.js** that allows users to register patient details such as name and age. It uses a local SQLite database, powered by the `PGlite` library, and leverages the `localStorage` API to persist data across page refreshes and tabs.

## Features

- **Patient Registration**: Allows users to enter and save patient details (name and age).
- **Persist Data**: Patient data is persisted across page refreshes using `localStorage`.
- **Multi-tab Synchronization**: Data entered in one tab is synchronized across all open tabs in the same browser.
- **Run SQL Queries**: You can execute custom SQL queries to interact with the SQLite database.
- **Clear Results**: Option to clear query results.

## Technologies Used

- **Next.js**: A React framework for building server-side rendered (SSR) applications.
- **PGlite**: A lightweight SQLite library for browser-based SQL storage.
- **CSS Modules**: Scoped styles for components.

## View the Demo page

To view the page. go to this url - 

## Setup Instructions

To run this project locally, follow these steps:

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) (Node Package Manager)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/patient-registration-app.git
   cd patient-registration-app
   npm install
   npm run dev
