# Client Records Management Application

A React application for managing client records with features like file upload, record editing, deletion, and searching.

## Features

- Upload JSON files containing client records
- Automatic removal of duplicate email addresses
- Merge data from multiple file uploads
- Paginated display of client records
- Search functionality by ID, Name, or Email
- Edit and delete records
- Form validation for unique email addresses

## Technical Stack

- React.js
- Material UI for design components
- React Hook Form for form handling
- Yup for form validation

## Setup Instructions

1. Clone the repository
  ```
  git clone https://github.com/pankaj-pithiya/client-records-management.git
  ```
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```
4. Open your browser and navigate to the URL shown in the terminal (typically http://localhost:5173)

## JSON File Format

The application expects JSON files in the following format:

```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
  },
  {
    "id": 2,
    "name": "Jane Smith",
    "email": "jane.smith@example.com",
  }
]
```