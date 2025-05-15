#  Monday.com API Automation – Setup Instructions

This mini task automates the creation of items on a Monday.com board using their GraphQL API.

##  Setup Instructions

### 1. Clone the Repository

git clone ==> repolink

cd HUBSPOT

### 2.Install Dependencies

npm install

### 3.Start the Application

npm start

### 4. View API Documentation (Swagger)

http://localhost:8000/api-docs/

### 5.Run Tests

npm test

### 6.How would you verify webhook authenticity in production?

In production, I verify the webhook using a JWT token. I include a secret token (like a key) in the Monday.com webhook setup. When Monday sends the request, my server checks if the token in the header matches what I expect. If it’s valid, I allow the request and process it. If the token is missing or incorrect, I return an error. This helps make sure only trusted calls from Monday.com are accepted.

### 7.What is your approach to ensure idempotency if the webhook is received multiple times?

To ensure idempotency, I generate a unique identifier from the webhook payload, such as the event ID. I then store this identifier in D. Before processing a webhook and creating a new item, I check the database to see if this event ID already exists. If it does, I avoid creating a duplicate and return a clear duplicate error message. This way, I prevent processing the same webhook multiple times.

### 8.How would you handle API rate limits effectively?

To handle rate limits, I used an Express middleware with express-rate-limit that restricts clients to 5 requests per minute. If the limit is exceeded, the server responds with a 429 error and a clear message. This approach prevents abuse and ensures the API remains stable under load.