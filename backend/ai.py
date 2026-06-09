import os
import json
import logging
from typing import Optional, List, Dict, Any
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger("edumind.ai")

# Configure Gemini API if key is available
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    logger.info("Gemini API configured successfully.")
else:
    logger.warning("GEMINI_API_KEY not found in environment. Running in simulation mode.")

def generate_summary(content: str, length: str = "medium") -> str:
    """Generates a summary using Gemini or falls back to simulation."""
    if GEMINI_API_KEY:
        try:
            model = genai.GenerativeModel('gemini-2.5-flash')
            prompt = f"Summarize the following study notes. Generate a {length} summary (short, medium, or detailed). Format the output cleanly using Markdown headers, bullet points, and key terms highlighted. Here are the notes:\n\n{content}"
            response = model.generate_content(prompt)
            return response.text
        except Exception as e:
            logger.error(f"Gemini API Error in summary generation: {e}. Falling back to simulation.")
    
    # Simulation fallback
    text_lower = (content or "").lower()
    subject_name = "General Study Material"
    key_points = [
        "Read notes carefully and underline main ideas.",
        "Synthesize details and rephrase key definitions.",
        "Review summaries periodically for active recall."
    ]
    details_text = "Detailed analysis of core principles. Topics include theoretical foundations, historical context, and practical applications in industry and academia."

    if "machine learning" in text_lower or "ml" in text_lower or "ai" in text_lower:
        subject_name = "Machine Learning & AI"
        key_points = [
            "Supervised Learning: training with labeled data (e.g. classification, regression).",
            "Unsupervised Learning: clustering and pattern recognition without predefined labels (e.g. K-Means, PCA).",
            "Overfitting vs Underfitting: balancing bias and variance determines model generalizability.",
            "Neural Networks: layers of nodes performing linear transformations followed by non-linear activation functions."
        ]
        details_text = "Machine Learning (ML) is a subset of AI focusing on algorithms that learn from data. It uses statistical models to draw inferences and make predictions. Key components are data preprocessing, model selection, loss function selection, and gradient descent optimization to update weights."
    elif "dbms" in text_lower or "normalization" in text_lower or "database" in text_lower:
        subject_name = "Database Management Systems & Normalization"
        key_points = [
            "1NF (First Normal Form): Eliminates duplicate columns and ensures atomicity of values.",
            "2NF (Second Normal Form): Meets 1NF requirements and eliminates partial dependencies (every non-key attribute must fully depend on primary key).",
            "3NF (Third Normal Form): Meets 2NF requirements and eliminates transitive dependencies (non-key columns do not depend on other non-key columns).",
            "BCNF (Boyce-Codd Normal Form): A stronger version of 3NF where every determinant must be a candidate key."
        ]
        details_text = "Database Normalization is the process of structuring a relational database in accordance with normal forms in order to reduce data redundancy and improve data integrity. It splits large tables into smaller tables and defines relationships between them."
    elif "iot" in text_lower or "internet of things" in text_lower:
        subject_name = "Internet of Things (IoT)"
        key_points = [
            "Sensors and Actuators: Core hardware collecting physical data and executing physical changes.",
            "Connectivity: Gateways and communication protocols (WiFi, Zigbee, LoRaWAN, MQTT) mapping data to the cloud.",
            "Data Processing: Edge computing vs cloud storage where analytics are performed.",
            "Security Challenges: Firmware vulnerabilities, lack of encryption, and weak access controls in IoT node arrays."
        ]
        details_text = "The Internet of Things (IoT) refers to a network of physical objects embedded with sensors, software, and other technologies for the purpose of connecting and exchanging data with other devices and systems over the internet."

    summary_content = f"## AI-Generated Summary: {subject_name}\n\n"
    if length == "short":
        summary_content += f"### Overview\n{details_text[:120]}...\n\n### Core Key Takeaways\n" + "\n".join([f"- **Key concept:** {p}" for p in key_points[:2]])
    elif length == "detailed":
        summary_content += f"### Detailed Executive Summary\n{details_text}\n\n### Deep Dive Points\n" + "\n\n".join([f"#### Concept #{i+1}\n{p}\nThis is fundamental for exam preparation and serves as a core baseline for advanced studies." for i, p in enumerate(key_points)]) + "\n\n### Conclusion\nUnderstanding these foundational rules simplifies complex applications and guarantees top exam performance."
    else: # medium
        summary_content += f"### Overview\n{details_text}\n\n### Key Takeaways\n" + "\n".join([f"- {p}" for p in key_points])
    
    return summary_content

def generate_mcqs(content: str, count: int = 10) -> List[Dict[str, Any]]:
    """Generates multiple choice questions using Gemini or falls back to simulation."""
    if GEMINI_API_KEY:
        try:
            model = genai.GenerativeModel('gemini-2.5-flash')
            prompt = (
                f"Based on the following content, generate {count} multiple-choice questions (MCQs).\n"
                "For each question, provide:\n"
                "1. The question text\n"
                "2. Four options (labeled A, B, C, D)\n"
                "3. The correct option letter (A, B, C, or D)\n"
                "4. A brief explanation of why it is correct.\n"
                "Format the output strictly as a JSON array of objects with the keys: \"question\", \"options\" (an array of strings), \"correctAnswer\" (string, e.g. \"A\"), and \"explanation\" (string). Do not wrap the JSON in markdown code blocks. Just return raw JSON.\n"
                f"Here is the content:\n\n{content}"
            )
            response = model.generate_content(prompt)
            raw_text = response.text.strip()
            
            # Clean response text if wrapped in markdown code blocks
            if raw_text.startswith("```json"):
                raw_text = raw_text[7:]
            if raw_text.endswith("```"):
                raw_text = raw_text[:-3]
            raw_text = raw_text.strip()
            
            return json.loads(raw_text)
        except Exception as e:
            logger.error(f"Gemini API Error in MCQ generation: {e}. Falling back to simulation.")
    
    # Simulation fallback
    text_lower = (content or "").lower()
    ml_questions = [
        {
            "question": "Which of the following is an example of supervised learning?",
            "options": ["K-Means clustering", "Linear Regression for house prices", "Principal Component Analysis", "Apriori association rules"],
            "correctAnswer": "B",
            "explanation": "Linear Regression is supervised because it trains on labeled data (houses with historical pricing information)."
        },
        {
            "question": "What issue does L1 (Lasso) regularization help resolve that L2 (Ridge) does not?",
            "options": ["Speeding up gradient descent", "Creating sparse models by driving coefficients to zero", "Handling missing text data", "Completely preventing underfitting"],
            "correctAnswer": "B",
            "explanation": "L1 regularization uses absolute penalties, which can drive weight coefficients to exactly zero, thus performing feature selection."
        },
        {
            "question": "What does a high bias in a model usually indicate?",
            "options": ["Overfitting", "Underfitting", "Perfect generalization", "Imbalanced datasets"],
            "correctAnswer": "B",
            "explanation": "High bias indicates that the model is too simple to capture the underlying structure of the data, which is underfitting."
        }
    ]

    dbms_questions = [
        {
            "question": "A table is in 2NF if it is in 1NF and has no ____________.",
            "options": ["Transitive dependency", "Partial dependency", "Multivalued dependency", "Functional dependency"],
            "correctAnswer": "B",
            "explanation": "Second Normal Form requires that there are no partial dependencies of any non-prime attribute on any candidate key."
        },
        {
            "question": "Which normal form requires eliminating transitive functional dependencies?",
            "options": ["First Normal Form", "Second Normal Form", "Third Normal Form", "Boyce-Codd Normal Form"],
            "correctAnswer": "C",
            "explanation": "Third Normal Form requires a relation to be in 2NF and have no transitive functional dependencies of non-prime attributes on candidate keys."
        },
        {
            "question": "What is a primary key that consists of more than one column called?",
            "options": ["Composite Key", "Foreign Key", "Candidate Key", "Surrogate Key"],
            "correctAnswer": "A",
            "explanation": "A key made up of multiple fields is called a composite primary key."
        }
    ]

    general_questions = [
        {
            "question": "What is the primary purpose of active recall in studying?",
            "options": ["Highlighting key text", "Rereading summaries repeatedly", "Testing yourself to retrieve information from memory", "Listening to audio lectures while sleeping"],
            "correctAnswer": "C",
            "explanation": "Active recall forces the brain to retrieve stored facts, building stronger neural pathways and enhancing long-term memory."
        },
        {
            "question": "How does the Pomodoro Technique structure study time?",
            "options": ["4 hours of continuous work followed by 1 hour rest", "25 minutes of focused study followed by a 5 minute break", "Studying only during early morning hours", "Alternating subjects every 10 minutes"],
            "correctAnswer": "B",
            "explanation": "The standard Pomodoro interval consists of 25 minutes of deep focus and a 5-minute break to restore cognitive capacity."
        },
        {
            "question": "Which study tool is best optimized for visual spacing and flipping?",
            "options": ["Spreadsheets", "Flashcards", "Mindmaps", "Audiobooks"],
            "correctAnswer": "B",
            "explanation": "Flashcards leverage spacing, visual prompts, and physical/digital flipping to build memory associations."
        }
    ]

    base_set = general_questions
    if "machine learning" in text_lower or "ml" in text_lower or "ai" in text_lower:
        base_set = ml_questions
    elif "dbms" in text_lower or "normalization" in text_lower or "database" in text_lower:
        base_set = dbms_questions

    questions = []
    for i in range(count):
        template = base_set[i % len(base_set)]
        questions.append({
            "question": f"[Q{i+1}] {template['question']}",
            "options": list(template['options']),
            "correctAnswer": template['correctAnswer'],
            "explanation": template['explanation']
        })
    return questions

def generate_tutor_reply(prompt: str, history: List[Dict[str, Any]] = None) -> str:
    """Generates an AI tutor chat response using Gemini or falls back to simulation."""
    if GEMINI_API_KEY:
        try:
            model = genai.GenerativeModel('gemini-2.5-flash')
            history_str = ""
            if history:
                history_str = "\n".join([f"{'Student' if h.get('sender') == 'user' else 'Tutor'}: {h.get('text')}" for h in history])
            
            prompt_text = f"You are a helpful student AI tutor. Here is the conversation history:\n{history_str}\n\nStudent: {prompt}\n\nTutor:"
            response = model.generate_content(prompt_text)
            return response.text
        except Exception as e:
            logger.error(f"Gemini API Error in tutor reply: {e}. Falling back to simulation.")
    
    # Simulation fallback
    text_lower = (prompt or "").lower()
    if "machine learning" in text_lower:
        return (
            "**Machine Learning (ML)** is the field of computer science that gives computers the ability to learn without being explicitly programmed.\n\n"
            "Here is a quick breakdown to help you understand:\n\n"
            "1. **Supervised Learning**: The algorithm is trained on labeled data. Example: Predicting house prices based on size.\n"
            "2. **Unsupervised Learning**: The algorithm learns from unlabeled data. It looks for hidden patterns. Example: Customer segmentation.\n"
            "3. **Reinforcement Learning**: Learning by trial and error using rewards. Example: An AI learning to play chess.\n\n"
            "Do you want me to write a quick Python code example showing a linear regression model, or should we create a set of practice questions on ML?"
        )
    elif "dbms normalization" in text_lower or "normalisation" in text_lower or "normal form" in text_lower:
        return (
            "**Database Normalization** is a systematic approach to decomposing tables to eliminate data redundancy (duplication) and undesirable characteristics like Insertion, Update, and Deletion Anomalies.\n\n"
            "Here's the summary of the main Normal Forms (NF):\n"
            "* **1NF**: Atomic values (no repeating groups).\n"
            "* **2NF**: In 1NF + **No partial dependencies** (every non-key attribute depends on the *entire* primary key).\n"
            "* **3NF**: In 2NF + **No transitive dependencies** (non-key attributes don't depend on other non-key attributes).\n\n"
            "Would you like an example showing a table being decomposed from 1NF to 3NF?"
        )
    elif "iot" in text_lower or "internet of things" in text_lower:
        return (
            "The **Internet of Things (IoT)** refers to the network of physical devices (like smart lights, thermostats, fitness trackers) that collect and exchange data using internet connections.\n\n"
            "**Key Architecture Layers:**\n"
            "1. **Perception Layer**: Sensors and actuators collecting physical data (temperature, motion).\n"
            "2. **Network Layer**: Data transmission via MQTT, HTTP, Bluetooth, or Zigbee.\n"
            "3. **Application Layer**: Cloud dashboards, smart systems, and user controls.\n\n"
            "How can I help you study this? I can explain IoT protocols or make a quick review guide!"
        )
    elif "chapter 3" in text_lower:
        return (
            "I've analyzed Chapter 3 from your uploads! Here is a summary of the core concepts:\n"
            "1. **Core Subject**: Systems Integration and Client-Server architectures.\n"
            "2. **Key Formulas**: Latency calculations and network bandwidth limitations.\n"
            "3. **Critical Terms**: SLA (Service Level Agreement), APIs, and Microservices.\n\n"
            "What part of Chapter 3 would you like to drill down on? I can quiz you on it!"
        )
    
    return (
        "Hello! I am your **EduMind AI Study Companion**.\n\n"
        "I can help you:\n"
        "* Summarize complex textbooks or uploaded notes.\n"
        "* Explain advanced topics in simple terms (e.g. math, physics, coding).\n"
        "* Create customized practice tests and quizzes.\n"
        "* Build smart study schedules.\n\n"
        "What topic are we focusing on today? Feel free to ask a question or upload notes!"
    )

def generate_planner(subjects: str, exam_date: str, hours: str) -> Dict[str, Any]:
    """Generates a study plan using Gemini or falls back to simulation."""
    if GEMINI_API_KEY:
        try:
            model = genai.GenerativeModel('gemini-2.5-flash')
            prompt = (
                f"Create a customized study planner for an exam on {exam_date}. The student is studying these subjects: {subjects} and can dedicate {hours} hours daily. Generate:\n"
                "1. A daily study routine.\n"
                "2. A weekly scheduling plan.\n"
                "3. A revision checklist.\n"
                "Return the result in JSON format with keys: \"dailyPlan\" (array of strings), \"weeklySchedule\" (array of objects with keys \"day\" and \"tasks\" [array of strings]), and \"revisionTasks\" (array of strings). Do not wrap the JSON in markdown code blocks. Just return raw JSON."
            )
            response = model.generate_content(prompt)
            raw_text = response.text.strip()
            
            if raw_text.startswith("```json"):
                raw_text = raw_text[7:]
            if raw_text.endswith("```"):
                raw_text = raw_text[:-3]
            raw_text = raw_text.strip()
            
            return json.loads(raw_text)
        except Exception as e:
            logger.error(f"Gemini API Error in planner generation: {e}. Falling back to simulation.")

    # Simulation fallback
    sub_list = [s.strip() for s in subjects.split(",")] if subjects else ["Core Studies"]
    daily_plan = [
        f"Morning Focus session: 1.5 hours on {sub_list[0]}",
        f"Afternoon Active Recall & Practice Quizzes: 1 hour on {sub_list[1] if len(sub_list) > 1 else sub_list[0]}",
        "Evening Review: 30 minutes writing summary cards and planning tomorrow's tasks"
    ]
    
    weekly_schedule = [
        {"day": "Monday", "tasks": [f"Review core foundations of {sub_list[0]}", "Complete 10 MCQ Practice Quiz"]},
        {"day": "Tuesday", "tasks": [f"Deep dive into {sub_list[1] if len(sub_list) > 1 else 'Core topics'}", "Create flashcards for active recall"]},
        {"day": "Wednesday", "tasks": ["Mid-week self assessment mock exam", "Review wrong questions and update study guides"]},
        {"day": "Thursday", "tasks": [f"Study secondary topics: {sub_list[2] if len(sub_list) > 2 else 'General reading'}", "Practice explaining concepts to AI Tutor"]},
        {"day": "Friday", "tasks": ["Formulate revision notes", "Run through the full flashcard deck"]},
        {"day": "Saturday", "tasks": ["Double review on difficult subjects", "Mock quiz (30 questions)"]},
        {"day": "Sunday", "tasks": [f"Rest and light planning for next week before {exam_date}", "Verify target exam milestone timeline"]}
    ]
    
    revision_tasks = [
        f"Write summary guides for all high-yield notes in {sub_list[0]}",
        f"Complete at least 3 simulated mock exams before {exam_date or 'exam date'}",
        "Re-test on flagged difficult flashcards",
        f"Do a timed study marathon of {hours or 2} hours"
    ]
    
    return {
        "dailyPlan": daily_plan,
        "weeklySchedule": weekly_schedule,
        "revisionTasks": revision_tasks
    }
