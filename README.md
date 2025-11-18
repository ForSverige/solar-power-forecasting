# ☀️ Solar Power Forecasting: The Bias-Variance Tradeoff App

<img width="1024" height="1024" alt="image" src="https://github.com/user-attachments/assets/f65d85e1-0c8f-4a50-835f-5bf6817e3f1d" />


[![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/react-%2320232a.svg?style=flat&logo=react&logoColor=%2361DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![D3.js](https://img.shields.io/badge/d3.js-F9A03C?style=flat&logo=d3.js&logoColor=white)](https://d3js.org/)

## 🔗 Live Application
👉 **[Click here to explore the live app](https://solar-power-forecasting.vercel.app/)**

---

## 📖 Project Overview

This interactive web application is an educational tool designed to help students and data scientists intuitively understand the **Bias-Variance Tradeoff** in machine learning.

Built on real-world solar power forecasting data for **Västerås, Sweden**, the app allows users to "build" a machine learning model step-by-step. By incrementally adding features, users visualize the immediate impact on model complexity and accuracy, bridging the gap between theoretical concepts and practical application.

*This project was bootstrapped using the Google AI Studio app builder and is based on the analytical findings from the `PowerForecasting.pdf` Jupyter Notebook.*

## 🎓 Key Learning Concepts

This tool enables interactive discovery of:

* **🧩 Feature Selection:** Visualize how adding features one-by-one (incremental selection) changes model behavior.
* **📉 High Bias (Underfitting):** See why models with too few features (e.g., 1–3) are too simple to capture true patterns, resulting in high training and test errors.
* **📈 High Variance (Overfitting):** Observe how "kitchen sink" models (e.g., all 38 features) memorize noise, performing poorly on unseen test data despite low training error.
* **🎯 The Sweet Spot:** Identify the "Goldilocks" zone (around 15 features) where the model balances simplicity and complexity to achieve the lowest total error.

## 💻 How to Run Locally

Follow these steps to get the application running on your machine:

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/ForSverige/solar-power-forecasting.git](https://github.com/ForSverige/solar-power-forecasting.git)
    cd solar-power-forecasting
    ```

2.  **Install dependencies:**
    *(Requires Node.js LTS version)*
    ```bash
    npm install
    ```

3.  **Start the development server:**
    ```bash
    npm run dev
    ```

4.  **View the app:**
    Open your browser and navigate to the provided local URL (usually `http://localhost:5173`).

## 🛠️ Technology & Data Stack

* **Framework:** Vite + React + TypeScript
* **Visualization:** D3.js (for dynamic error curve plotting)
* **Data Source:** [NASA POWER API](https://power.larc.nasa.gov/) (Meteorological data for Västerås)
* **Reference Model:** XGBoost (based on the original Python analysis)

---
<p align="center">
  Developed with ❤️ by <a href="https://github.com/ForSverige">ForSverige</a>
</p>

Visualization: D3.js

Data Source: NASA POWER API (for Västerås weather data)

Forecasting Model: XGBoost (as used in the original Python notebook)
