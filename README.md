# Web App for Book Reading and Automatic Test Creation

This web application enhances student learning by providing a platform for reading books and automatically generating tests based on the material. The app ensures students are well-prepared and engaged with their learning materials.

## Table of Contents
- [Project Overview](#project-overview)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Running the Application](#running-the-application)
  - [Frontend](#frontend)
  - [Backend](#backend)
  - [AI Module](#ai-module)
- [PDF to Quiz Feature](#pdf-to-quiz-feature)
  - [Prerequisites](#prerequisites)
  - [Usage](#usage)
- [Screens](#screens)

## Project Overview

The application leverages modern web technologies and frameworks including React, Node.js, GraphQL, PostgreSQL, PDF.js, websockets, Tailwind CSS, Vite, TypeScript, OpenAI API, and LangChain. It provides a seamless reading experience and automatic test generation to facilitate effective study and revision.

Watch a [short video (2 min)](https://tornadosky.github.io/img/ek.MP4) showcasing the app.


## Technologies Used

- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, GraphQL, PostgreSQL, Websockets
- **Other Libraries**: PDF.js for displaying book content, OpenAI API for generating test questions, LangChain for natural language processing tasks

## Installation

The repository is organized into three main directories: `frontend`, `backend`, and `ai`. Each folder has its own `README` with specific setup instructions. Below are the high-level steps for installing and running the application.

### Prerequisites

Ensure you have the following installed on your system:
- Node.js
- Python (for the AI module)
- Docker (optional, if you prefer running the app in a container)

### Running the Application

#### Frontend

1. Navigate to the `frontend` folder:
   ```sh
   cd frontend
   ```
2. Install dependencies and run the development server:
   ```sh
   npm install
   npm run dev
   ```
   Make sure you have data in your SQLite database, as the frontend relies on it.

#### Backend

![DB schema](https://tornadosky.github.io/img/readex_dbd.png)

1. Navigate to the `backend` folder:
   ```sh
   cd backend
   ```
2. Install dependencies and start the backend server:
   ```sh
   npm install
   npm run dev
   ```

#### AI Module

1. Navigate to the `ai` folder:
   ```sh
   cd ai
   ```
2. Install the required Python packages:
   ```sh
   pip install -r requirements.txt
   ```
3. Run the FastAPI backend:
   ```sh
   python api.py
   ```
To run the Streamlit UI for PDF-to-quiz feature:
   ```sh
   streamlit run ui.py
   ```

Alternatively, you can run the AI module using Docker:
```sh
docker build -t pdf-to-quizz .
docker run -e OPENAI_API_KEY=[your-api-key] -p 8501:8501 pdf-to-quizz
```

## PDF to Quiz Feature

### Prerequisites

To use the PDF-to-quiz feature, you need an OpenAI API key. You can get one from [OpenAI's platform](https://platform.openai.com/account/api-keys). 

Store your API key in your terminal:
```sh
export OPENAI_API_KEY=[Your-API-key]
```

Alternatively, save the key in a `.env` file (in ai folder).

### Usage

This feature allows users to upload a multiple-page PDF and generate a quiz with multiple-choice questions. For each page of the PDF, N questions will be generated using LangChain to interface with the OpenAI API.

- To run the API for question generation, run:
  ```sh
  python api.py
  ```

- To run the Streamlit-based user interface, execute:
  ```sh
  streamlit run ui.py
  ```

## Screens

### Main Screen
The main screen offers a book reading interface with highlighted sections that can be used to generate quizzes.

![Main Screen](https://tornadosky.github.io/img/readex-main.png)

### Test Screen
The test screen presents automatically generated questions with multiple-choice answers based on the book content.

![Test Screen](https://tornadosky.github.io/img/readex-tests.png)
