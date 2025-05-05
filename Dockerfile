# Step 1: Use the official Node.js image as the base image
FROM node:16

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy the package.json (and package-lock.json, if it exists) into the container
COPY ./backend/package.json ./backend/package-lock.json* ./

# Step 4: Install the dependencies inside the container
RUN npm install

# Step 5: Copy the rest of the files from the backend directory to the container
COPY ./backend ./

# Step 6: Expose the port your app will be listening on (adjust if necessary)
EXPOSE 5000

# Step 7: Set the default command to run your app (adjust this based on your app's entry point)
CMD ["npm", "start"]
