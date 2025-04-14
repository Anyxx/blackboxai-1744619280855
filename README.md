
Built by https://www.blackbox.ai

---

```markdown
# GPS Tracking Link Generator

## Project Overview

The **GPS Tracking Link Generator** is a web application designed to create tracking links that monitor GPS locations of visitors. With this project, users can generate unique short links, track who visits those links, and view data about each visit including location and user agent information.

## Installation

To get started with the project, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/gps-tracking-link-generator.git
   cd gps-tracking-link-generator
   ```

2. **Install the dependencies:**
   ```bash
   npm install
   ```

3. **Start the server:**
   ```bash
   npm start
   ```

4. **Access the application:**
   Open your web browser and navigate to `http://localhost:8000`.

## Usage

### Endpoints

- **Generate Tracking Link**
  - **POST** `/api/generate`
    - **Request Body**: JSON containing `url` (string)
    - **Response**: Returns the short link and original URL.
  
- **Get All Links**
  - **GET** `/api/links`
    - **Response**: Returns a list of all generated links.

- **Get Specific Link Data**
  - **GET** `/api/links/:id`
    - **Response**: Returns data for a specific link by ID.

- **Track Visits**
  - **POST** `/api/track/:id`
    - **Request Body**: JSON containing `latitude`, `longitude`, `accuracy`, `userAgent`.
    - **Response**: Returns the original URL and success confirmation.

- **Redirect without Tracking**
  - **GET** `/api/redirect/:id`
    - **Response**: Returns the original URL.

- **Tracking Link Redirect**
  - **GET** `/t/:id`
    - **Response**: Serves a tracking page that collects visit data.

- **Dashboard for Individual Links**
  - **GET** `/dashboard/:id`
    - **Response**: Serves a dashboard view for link statistics.

## Features

- Generate unique short links that redirect to a provided URL.
- Track the geographical location of users accessing the links.
- Retrieve detailed visit statistics, including timestamps and user data.
- User-friendly dashboard for viewing link statistics.

## Dependencies

This project requires the following npm packages:

- **express**: ^4.18.2

These dependencies are specified in the `package.json` file.

## Project Structure

```
gps-tracking-link-generator/
├── package.json
├── package-lock.json
└── server.js
└── public/
    ├── index.html
    └── redirect.html
    └── dashboard.html
```

- `server.js`: The main backend server file responsible for handling API requests.
- `public/`: Directory containing the static HTML files served to the client, including the main page, tracking page, and interactive dashboard.

## License

This project is open-source and available under the MIT License.
```