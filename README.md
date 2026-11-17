# Job Board

A small job board application built for the insiderOne work sample. Users can browse available jobs, search by title, company, or location, and save or remove jobs from their saved list.

The jobs and companies are fictional.

## Requirements

- Node.js 20 or newer
- No external packages required

## Getting Started

Clone the repository:

```bash
git clone https://github.com/Abhishek-Achuthan/Job-board.git
cd Job-board
```

Start the application:

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Running Tests

Run the automated tests using Node.js's built-in test runner:

```bash
npm test
```

## Features

- Browse available jobs.
- Search jobs by title, company, or location.
- Save jobs to a saved jobs list.
- View saved jobs separately.
- Remove jobs from the saved list.
- Prevent duplicate saved job entries.
- Persist saved jobs using a local JSON file.
- Validate job IDs and handle invalid requests with appropriate HTTP errors.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/jobs` | Get all jobs |
| GET | `/api/jobs?q=keyword` | Search jobs |
| GET | `/api/saved` | Get saved jobs |
| POST | `/api/saved` | Save a job |
| DELETE | `/api/saved/:jobId` | Remove a saved job |

### Save a Job

**POST** `/api/saved`

Request body:

```json
{
  "jobId": "j1"
}
```

## Project Structure

```text
.
├── jobs.json
├── saved-jobs.json
├── lib/
│   ├── jobs.js
│   └── saved-jobs.js
├── public/
│   ├── app.js
│   ├── index.css
│   └── index.html
├── test/
│   ├── jobs.test.js
│   └── saved-jobs.test.js
├── server.js
├── package.json
└── README.md
```

## Technical Decisions

- **Separation of concerns:** Kept job-related operations and saved-job operations in separate modules to make the code easier to maintain.
- **Asynchronous file operations:** Used Node.js promise based file system APIs to avoid blocking the event loop during file reads and writes.
- **REST API design:** Used appropriate HTTP methods and status codes for retrieving, creating, and deleting saved jobs.
- **Input validation:** Validated incoming request bodies and job IDs before performing operations.
- **Lightweight persistence:** Used JSON files instead of introducing a database, keeping the implementation aligned with the scope of the assignment.

## Possible Improvements

- Improve client-side error handling and user feedback.
- Introduce a database and proper data isolation if the application needs multiple users.
- Add pagination to the jobs API to handle larger job listings efficiently.