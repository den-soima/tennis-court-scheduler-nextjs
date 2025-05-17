# SCHEDULER

Hosted on Vercel: https://scheduler-nextjs-three.vercel.app/

# Overview

This is a scheduling app for a tennis club. It allows users to:

View and choose a tennis court location from the homepage. For now only one location is available, the other two will be added in the future.

Book a training session: After choosing a location, users can see a calendar with available dates and book a session.

View other users' bookings to avoid conflicts.

In the future, the app will include Telegram authentication for users.

# Authentication

To book a training session, users must be authenticated with their phone number (for now there is no confirmation SMS, it is enough to insert a phone number).

If a user clicks on the "Book the court" button without being logged in, a modal window will appear, prompting them to authenticate by entering their name and phone number.

For creating a new account a user must use their name, phone number and a password. After registering a user can log into their account to book a training session, view and delete their own bookings.

# Booking Details

Maximum booking window: Users can book training sessions up to 14 days in advance.

Booking time: From 5:00 AM to 11:00 PM.

Minimum session duration is 1 hour.

# Dependencies

Node v22.14.0

NPM 10.9.2

react-router-dom

# Technologies

# Frontend

Next.js

TypeScript

fetch API

SCSS

HTML5

# Backend

Next.js API Routes

Mongoose

MongoDB Atlas



<img width="377" alt="Screenshot 2025-05-17 at 12 41 35" src="https://github.com/user-attachments/assets/b9c16a68-f996-43a9-966c-3f867a96d504" />

<img width="382" alt="Screenshot 2025-05-17 at 12 41 54" src="https://github.com/user-attachments/assets/ed48c6e4-1499-4933-bd4d-f140ba380d1c" />

<img width="380" alt="Screenshot 2025-05-17 at 12 41 43" src="https://github.com/user-attachments/assets/9dab5aa1-7e63-47fb-9ae3-1b1a50b06d75" />

<img width="375" alt="Screenshot 2025-05-17 at 12 42 02" src="https://github.com/user-attachments/assets/dcd1a346-2744-4769-a94f-a2131586e215" />

<img width="375" alt="Screenshot 2025-05-17 at 12 41 57" src="https://github.com/user-attachments/assets/57b82c83-6f10-45c6-abfb-8100190cf573" />

<img width="373" alt="Screenshot 2025-05-17 at 12 42 10" src="https://github.com/user-attachments/assets/84a19f79-f631-4aec-a2f4-728bd7cd0a4a" />

<img width="378" alt="Screenshot 2025-05-17 at 12 42 30" src="https://github.com/user-attachments/assets/b7e9e470-1e4e-4ac0-9db1-bc1575e3b60c" />

<img width="377" alt="Screenshot 2025-05-17 at 13 03 33" src="https://github.com/user-attachments/assets/2c0bfee7-59ac-48ad-9a41-79ed40dde0e7" />

