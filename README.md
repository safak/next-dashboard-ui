MUIC Social Listening Dashboard - Deployment Instructions

PREREQUISITES:

- Docker Desktop must be installed and running.

STEP 1: SETUP ENVIRONMENT

1. Unzip the project folder.
2. Create a file named ".env" in the root folder.
3. Add these lines to the .env file:
   DATABASE_URL="postgresql://postgres:password@db:5432/muic_db?schema=public"
   DIRECT_URL="postgresql://postgres:password@db:5432/muic_db?schema=public"
   GOOGLE_API_KEY="[Insert Your Google API Key Here]"

STEP 2: START THE APP

1. Open a terminal in the project folder.
2. Run the command:
   docker compose up -d --build

   (Wait for the containers "muic_dashboard_web" and "muic_dashboard_db" to start).

STEP 3: LOAD THE DATA (CRITICAL)
The database starts empty. You must run this command to load the 91 Posts and Comments from the CSV files:

docker exec -it muic_dashboard_web npm run load-data

(Wait for the success message: "Successfully inserted 91 posts" and "Successfully inserted comments").

STEP 4: ACCESS THE DASHBOARD

1. Open your browser to: http://localhost:3000
2. The dashboard should now display all posts, content, and sentiment analysis.
