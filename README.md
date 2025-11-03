☀️ Solar Power Forecasting: The Bias-Variance Tradeoff App

Live Application: https://solar-power-forecasting.vercel.app/

<!-- TODO: Add a screenshot of the app here! -->

<!--  -->

📖 Project Overview

This is an interactive web application designed as an educational tool for students to explore the "Bias-Variance Tradeoff" in machine learning. It uses a real-world dataset of solar power forecasting for Västerås, Sweden.

The app allows users to incrementally add features to a machine learning model and instantly see how the model's complexity affects its accuracy, demonstrating the core concepts of underfitting, optimal fitting, and overfitting.

This project was bootstrapped using the Google AI Studio app builder (Vite + React) and is based on the analysis from the PowerForecasting.pdf (Jupyter Notebook).

🎓 Key Learning Concepts

This app allows students to interactively discover:

Feature Selection: How adding features one-by-one (incremental feature selection) impacts model accuracy.

High Bias (Underfitting): Why a model with too few features (e.g., 1-3) is too simple and has a high error.

High Variance (Overfitting): Why a model with too many features (e.g., all 38) performs worse on unseen test data than a simpler, "just right" model.

The Bias-Variance Tradeoff: How the 15-feature model finds the "sweet spot" with the lowest error, balancing simplicity and complexity.

💻 How to Run Locally

This project was built with Vite + React. To run it on your local machine:

Clone (or download and unzip) this repository.

Install Node.js (LTS version recommended).

Open a terminal in the project's root folder.

Install the necessary dependencies:

npm install


Start the local development server:

npm run dev


Open the provided URL (usually http://localhost:5173) in your browser.

🛠️ Technology & Data

App Framework: Vite + React + TypeScript

Visualization: D3.js

Data Source: NASA POWER API (for Västerås weather data)

Forecasting Model: XGBoost (as used in the original Python notebook)
