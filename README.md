# Deepfake Guardian (Deepfake Threat Assistance System)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.9+](https://img.shields.io/badge/python-3.9+-blue.svg)](https://www.python.org/downloads/)
[![React](https://img.shields.io/badge/react-19.0+-61DAFB.svg)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109+-009688.svg)](https://fastapi.tiangolo.com/)
[![PyTorch](https://img.shields.io/badge/PyTorch-2.0+-EE4C2C.svg)](https://pytorch.org/)

**Deepfake Guardian** is an ethical AI-powered platform designed to assist individuals targeted by deepfake threats, blackmail, or impersonation. It combines advanced forensic analysis with legal automation and secure evidence preservation, strictly adhering to a "Human-in-the-Loop" philosophy where AI supports but does not replace human judgment.

---

## 🌟 Key Features

### 🛡️ Active Defense & Forensics
*   **Deepfake Detection Engine**: Utilizes state-of-the-art Transfer Learning models (EfficientNet-B0 / ResNet50) trained on FaceForensics++ and Celeb-DF datasets to classify media as Real or Fake with high confidence.
*   **Forensic Probability Scoring**: Provides detailed analysis reports with probability metrics, helping users understand the likelihood of manipulation.
*   **Web Scraper & Monitoring**: Tools to scan designated websites for unauthorized use of user images, cross-referencing findings with the evidence vault.

### ⚖️ Legal Automation
*   **Smart Document Drafting**: Automatically generates legally sound documents based on case specifics:
    *   **Cease & Desist Letters**: Formal demands to stop harassment.
    *   **DMCA Takedown Notices**: Standardized requests for content removal from online platforms.
*   **Risk Assessment**: AI-driven evaluation of threat severity (Low, Medium, Critical) to prioritize response actions.

### 🔒 Privacy & Security
*   **Secure Evidence Vault**: Encrypted local storage for sensitive media evidence, ensuring chain of custody without unnecessary cloud exposure.
*   **Privacy-First Architecture**: Stores minimal data—primarily metadata and embeddings—rather than long-term retention of raw sensitive imagery.
*   **Audit Logging**: Every action taken within the system is logged for accountability.

---

## 🧠 Machine Learning Engine

The core of the detection system is a high-performance computer vision pipeline built with **PyTorch**.

### Model Architecture
*   **Primary Backbone**: `EfficientNet-B0` (Transfer Learning from ImageNet).
*   **Fallback Backbone**: `ResNet50` (if EfficientNet is unavailable).
*   **Classifier Head**: Custom fully connected layers optimized for binary classification (Real vs. Fake).

### Training Pipeline
*   **Data Augmentation**: Robust transforms including RandomResizedCrop, Rotation (15°), ColorJitter (Brightness/Contrast/Saturation), and HorizontalFlip to prevent overfitting.
*   **Class Imbalance Handling**: Implements `WeightedRandomSampler` to balance training batches between Real (70k samples) and Fake (40k samples) datasets.
*   **Optimization**:
    *   **Optimizer**: `AdamW` (Weight Decay: 1e-4) for stable convergence.
    *   **Loss Function**: `CrossEntropyLoss`.
    *   **Scheduler**: `CosineAnnealingLR` for smooth learning rate decay.
*   **Performance**: Supports Mixed Precision Training (AMP) for faster inference on CUDA-enabled GPUs.

---

## 🏗️ How It Works (Architecture)

The system is built on a modern decoupled architecture:

```mermaid
graph TD
    User((User)) -->|Uploads Evidence| FE[Frontend (React/Vite)]
    FE -->|API Request| BE[Backend API (FastAPI)]
    
    subgraph "Backend Services"
        BE -->|Store Metadata| DB[(SQLite Database)]
        BE -->|Save File| FS[File System (Vault)]
        BE -->|Analyze Media| ML[ML Engine (PyTorch)]
        BE -->|Generate Docs| T[Legal Templates]
    end
    
    ML -->|Prediction (Real/Fake)| BE
    BE -->|Risk Score & Tactics| FE
    
    subgraph "External World"
        BE -.->|Scrape & Monitor| WEB[Target Websites]
    end
```

### 💻 Technology Stack

| Component | Technology | libraries/Modules | Description |
| :--- | :--- | :--- | :--- |
| **Frontend** | React 19, Vite | `react-router-dom`, `axios`, `lucide-react`, `jspdf` | Modern, responsive UI with Glassmorphism design, client-side PDF generation, and smooth animations. |
| **Backend** | FastAPI, Python 3.9+ | `pydantic`, `sqlalchemy`, `uvicorn` | High-performance async REST API handling logic, database, and ML orchestration. |
| **Database** | SQLite | `SQLAlchemy` ORM | Lightweight, serverless relational database for storing cases, evidence metadata, and users. |
| **ML Engine** | TensorFlow | `torchvision`, `PIL`, `scikit-learn`, `numpy` | Deep Learning models for image classification and feature extraction with GPU acceleration support. |
| **Design** | CSS3 | Custom Glassmorphism | Utility-first styling with consistent iconography and dark mode aesthetics. |

---

## 🚀 Getting Started

### Prerequisites

*   **Node.js** (v16 or higher)
*   **Python** (v3.9 or higher)
*   **Git**

### Installation

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/yourusername/deepfake-guardian.git
    cd deepfake-guardian
    ```

2.  **Backend Setup**
    Navigate to the backend directory and set up the Python environment:
    ```bash
    cd backend
    python -m venv venv
    
    # Activate Virtual Environment
    # Windows:
    venv\Scripts\activate
    # Mac/Linux:
    # source venv/bin/activate
    
    pip install -r requirements.txt
    ```

3.  **Frontend Setup**
    Navigate to the frontend directory and install dependencies:
    ```bash
    cd ../frontend
    npm install
    ```

### Running the Application

1.  **Launch the Backend Server**
    ```bash
    # From the backend directory
    cd backend/backend
    uvicorn main:app --reload
    ```
    *Server will start at `http://localhost:8000`*

2.  **Launch the Frontend Client**
    ```bash
    # From the frontend directory
    npm run dev
    ```
    *App will open at `http://localhost:5173`*

---

## 📚 Usage Guide

1.  **Evidence Submission**: 
    *   Open the app and click **"Start New Case"**.
    *   Upload the suspicious image or video.
    *   Fill in details about where you found it and any threats received.

2.  **Review Analysis**:
    *   The **Forensic Dashboard** will show the AI's detection confidence (e.g., "98% Probability Fake").
    *   Review the **Risk Assessment** to understand the severity.

3.  **Take Action**:
    *   Navigate to the **Action Center**.
    *   Select **"Generate Cease & Desist"** or **"DMCA Takedown"**.
    *   Download the PDF and send it to the perpetrator or platform.

---

## 🤝 Ethical Framework

This project is built on strict ethical guidelines:

1.  **Defensive Use Only**: Tools are designed solely for protection, detection, and legal response. No offensive cyber capabilities are included.
2.  **Human Oversight**: AI provides insights, but humans make the final decision on all legal and takedown actions.
3.  **No False Evidence**: The system prevents the generation of fake evidence or misleading reports.
4.  **Data Minimization**: We collect only what is necessary to assist the victim and delete raw data when it is no longer needed.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
