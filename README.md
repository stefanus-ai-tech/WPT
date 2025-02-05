# WPT-alike Indonesian Edition Project

## Overview
This project aims to create a web-based platform similar to WebPageTest (WPT) but specifically tailored for testing website performance with an Indonesian focus. It will provide insights into page load times, resource usage, and other key performance metrics, helping developers optimize their websites for Indonesian users. The project leverages a custom backend built with Python and a simple, user-friendly frontend. It uses an API to fetch website performance data (using a GROQ API key). 

This project is not a full reproduction of WPT but focuses on delivering a simplified, customizable version for Indonesian web performance analysis.

## Prerequisites
- Python 3.11+
- A GROQ API key

## Setup Instructions

### Development Environment
1. Create and activate virtual environment:
    ```bash
    python3 -m venv env_name
    source env_name/bin/activate
    ```

2. Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
   *Note: You will need to create a `requirements.txt` file containing dependencies, see the "Dependencies" section below*

3. Obtain a GROQ API key and set it as an environment variable or store it securely for use in the `app.py` file.

### Deployment Steps

1.  Run the server:
    ```bash
    GROQ_API_KEY=YOUR_GROQ_API_KEY python3 app.py
    ```
   *Replace YOUR_GROQ_API_KEY with your actual key*

## Usage
To use the application, run the `app.py` with your GROQ API KEY and the application will provide a simple interface in your terminal or will be served via a simple framework if implemented.

**Example Usage:**
```bash
GROQ_API_KEY=YOUR_GROQ_API_KEY python3 app.py
```
# The app will prompt you to enter website URL
# The app will provide insights on the performance of the website using the GROQ API

## Dependencies
*   This application requires the `requests` package for fetching data. Create a `requirements.txt` as follows:
    ```
    requests
    ```

## Contributing
We welcome contributions! If you'd like to contribute, please follow these guidelines:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and ensure your code is well-documented.
4.  Submit a pull request with a detailed description of your changes.
5. Be sure to include your test cases, if applicable.

## License
This project is licensed under the MIT License. See the `LICENSE` file for more details.
