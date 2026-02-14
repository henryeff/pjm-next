# PJM Next.js App

This is the new Next.js version of the Perkasa Jaya Marine website.

## Getting Started

1.  Open the terminal in this directory.
2.  Run the development server:
    ```bash
    npm run dev
    ```
3.  Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## How to Update Content

### update/add News or Products

The content for News and Products is stored in JSON files for easy updates without touching the code.

-   **News**: Edit `src/data/news.json`. Each item is an object like this:
    ```json
    {
      "id": "new-id",
      "header": "New Title",
      "image": "/images/News/image.jpg",
      "details": "Details here...",
      "date": "Date here"
    }
    ```
-   **Products**: Edit `src/data/two-strokes.json` or `src/data/four-strokes.json`.

### Images

Place new images in the `public/images` folder. You can create subfolders if needed.
Reference them in JSON as `/images/filename.jpg`.

## Project Structure

-   `src/app`: Contains the pages and layout.
-   `src/components`: Reusable components (Navbar, Footer, etc.).
-   `src/data`: JSON data files.
-   `src/app/globals.css`: Global styles and theme variables.
