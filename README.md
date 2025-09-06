# ATS Application

This is a full-stack application with .NET Web API backend and Angular frontend.

## Project Structure

```
ATS/
├── api/          # .NET Web API project
├── ui/           # Angular frontend project
├── .vscode/      # VS Code configuration
└── ATS.sln       # .NET solution file
```

## Prerequisites

- .NET 9.0 SDK
- Node.js (LTS version)
- Angular CLI (`npm install -g @angular/cli`)

## Getting Started

### API (Backend)

1. Navigate to the api folder:
   ```bash
   cd api
   ```

2. Run the API:
   ```bash
   dotnet run
   ```

The API will be available at `https://localhost:5001` and `http://localhost:5000`

### UI (Frontend)

1. Navigate to the ui folder:
   ```bash
   cd ui
   ```

2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```

3. Run the Angular development server:
   ```bash
   npm start
   ```

The UI will be available at `http://localhost:4200`

## Development

### Using VS Code Tasks

You can use the predefined VS Code tasks:

- **Ctrl+Shift+P** → "Tasks: Run Task"
  - `start-api` - Start the .NET API
  - `start-ui` - Start the Angular development server
  - `build` - Build the .NET API
  - `build-ui` - Build the Angular application
  - `watch` - Run the API in watch mode

### API Endpoints

- `GET /weatherforecast` - Sample weather forecast endpoint

### Configuration

- The API is configured with CORS to allow requests from `http://localhost:4200`
- Both projects include basic configurations for development
