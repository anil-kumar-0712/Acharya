import { DomainQuestionSet, TargetDomain } from '../types';

export const DOMAIN_QUESTIONS: Record<TargetDomain, DomainQuestionSet> = {
  'Artificial Intelligence & Machine Learning': {
    domain: 'Artificial Intelligence & Machine Learning',
    questions: [
      {
        id: 1,
        question: "In Machine Learning, what is the primary goal of regularization techniques (e.g., L1 Lasso, L2 Ridge)?",
        options: [
          "To speed up model training time on GPUs",
          "To prevent overfitting by penalizing complex model weights",
          "To convert continuous features into discrete categories",
          "To increase dataset size through synthetic sampling"
        ],
        correctAnswer: 1,
        explanation: "Regularization penalizes large coefficients to reduce variance and prevent overfitting on training data."
      },
      {
        id: 2,
        question: "Which neural network architecture is primarily designed for sequential data processing such as NLP or Time-Series?",
        options: [
          "Convolutional Neural Networks (CNN)",
          "Recurrent Neural Networks (RNN) / Transformers",
          "Generative Adversarial Networks (GAN)",
          "Support Vector Machines (SVM)"
        ],
        correctAnswer: 1,
        explanation: "RNNs and Self-Attention Transformers maintain temporal/sequence state across text and time-series tokens."
      },
      {
        id: 3,
        question: "In Retrieval-Augmented Generation (RAG) for LLMs, what role does a Vector Database play?",
        options: [
          "Fine-tuning the LLM model weights directly",
          "Storing numerical embeddings for fast semantic similarity retrieval",
          "Compiling Python code into WebAssembly",
          "Encrypting user passwords with salt"
        ],
        correctAnswer: 1,
        explanation: "Vector DBs store high-dimensional embeddings and execute vector search (like cosine similarity) to retrieve relevant context."
      },
      {
        id: 4,
        question: "What does the activation function (e.g., ReLU, Sigmoid) introduce into a neural network layer?",
        options: [
          "Non-linearity, enabling the model to learn complex patterns",
          "Automatic hyperparameter optimization",
          "Gradient descent momentum",
          "Database connection pooling"
        ],
        correctAnswer: 0,
        explanation: "Without non-linear activation functions, a deep neural network behaves like a single linear regression model."
      },
      {
        id: 5,
        question: "What metric is most suitable for evaluating a classification model on an imbalanced dataset (e.g., fraud detection with 99.9% negative cases)?",
        options: [
          "Standard Accuracy",
          "F1-Score / Precision-Recall AUC",
          "Mean Squared Error (MSE)",
          "R-Squared (R²)"
        ],
        correctAnswer: 1,
        explanation: "Standard accuracy is misleading on imbalanced data. F1-Score balances Precision and Recall for true positive detection."
      }
    ]
  },

  'Fullstack Web Development': {
    domain: 'Fullstack Web Development',
    questions: [
      {
        id: 1,
        question: "In modern React, what is the main purpose of the `useEffect` hook?",
        options: [
          "To render HTML elements directly into DOM",
          "To execute side-effects like data fetching, subscriptions, or manual DOM mutations",
          "To define global CSS styles",
          "To encrypt client-side cookies"
        ],
        correctAnswer: 1,
        explanation: "`useEffect` handles asynchronous operations and side effects after component mounting or prop/state updates."
      },
      {
        id: 2,
        question: "Which HTTP status code represents 'Unprocessable Entity' or validation errors in RESTful APIs?",
        options: [
          "200 OK",
          "401 Unauthorized",
          "422 Unprocessable Entity",
          "500 Internal Server Error"
        ],
        correctAnswer: 2,
        explanation: "422 is standard for semantic validation errors in API request payloads."
      },
      {
        id: 3,
        question: "In database design, what does database indexing improve?",
        options: [
          "Write performance for INSERT statements",
          "Read query performance by creating efficient lookups (B-Trees)",
          "Disk storage compression",
          "Automatic CSS styling"
        ],
        correctAnswer: 1,
        explanation: "Indexes significantly accelerate SELECT queries while adding slight overhead to write operations."
      },
      {
        id: 4,
        question: "What is the key difference between `localStorage` and `sessionStorage` in browser storage?",
        options: [
          "localStorage data persists after browser tab closure; sessionStorage clears when tab closes",
          "sessionStorage stores up to 50GB while localStorage stores only 5MB",
          "localStorage can only store binary data",
          "sessionStorage sends data to server automatically with every HTTP header"
        ],
        correctAnswer: 0,
        explanation: "localStorage persists indefinitely until cleared, while sessionStorage is scoped strictly to the active window/tab session."
      },
      {
        id: 5,
        question: "What does the Virtual DOM in React optimize?",
        options: [
          "Server-side database queries",
          "Minimizing real DOM updates via diffing algorithms",
          "Network latency over TCP",
          "CSS grid calculation speed"
        ],
        correctAnswer: 1,
        explanation: "React compares the Virtual DOM tree with previous state and only repaints modified real DOM nodes."
      }
    ]
  },

  'Cloud & DevOps Architecture': {
    domain: 'Cloud & DevOps Architecture',
    questions: [
      {
        id: 1,
        question: "What is the primary advantage of Containerization (e.g. Docker) over traditional Virtual Machines?",
        options: [
          "Containers require a full OS guest kernel per application",
          "Containers share the host OS kernel, making them lightweight and fast to boot",
          "Containers cannot run on Linux servers",
          "Containers eliminate the need for networking protocols"
        ],
        correctAnswer: 1,
        explanation: "Containers package app code and dependencies while sharing host OS kernel resources, making them start in milliseconds."
      },
      {
        id: 2,
        question: "In Kubernetes, what is a 'Pod'?",
        options: [
          "The smallest deployable computing unit containing one or more containers",
          "A hardware server in AWS data center",
          "A Git branch for infrastructure code",
          "A database backup snapshot"
        ],
        correctAnswer: 0,
        explanation: "A Pod represents a single instance of a running process in Kubernetes containing container storage and IP specs."
      },
      {
        id: 3,
        question: "What concept does Infrastructure as Code (IaC) tools like Terraform implement?",
        options: [
          "Manual server configuration via SSH",
          "Declarative definition of cloud infrastructure stored in version control",
          "Automatic frontend React component generation",
          "Real-time video encoding"
        ],
        correctAnswer: 1,
        explanation: "IaC allows engineers to define cloud infrastructure using declarative config files subject to Git reviews."
      },
      {
        id: 4,
        question: "What is the purpose of a CI/CD pipeline?",
        options: [
          "To automate building, testing, and deploying code changes reliably",
          "To monitor employee clock-in hours",
          "To design user interfaces in Figma",
          "To compress JPEG images on web pages"
        ],
        correctAnswer: 0,
        explanation: "Continuous Integration and Continuous Deployment ensure code changes pass automated tests and deploy to production automatically."
      },
      {
        id: 5,
        question: "In cloud high-availability architecture, what does an Auto Scaling Group do?",
        options: [
          "Automatically adjusts server capacity based on CPU/traffic demand",
          "Scales down server memory to save battery life",
          "Increases hard drive RPM automatically",
          "Automatically hires freelance engineers"
        ],
        correctAnswer: 0,
        explanation: "Auto Scaling dynamically adds or terminates VM instances depending on load metric thresholds."
      }
    ]
  },

  'Product Management & Strategy': {
    domain: 'Product Management & Strategy',
    questions: [
      {
        id: 1,
        question: "What does the RICE prioritization framework stand for?",
        options: [
          "Reach, Impact, Confidence, Effort",
          "Revenue, Innovation, Cost, Execution",
          "Research, Insight, Customer, Experience",
          "Risk, Investment, Competition, Expansion"
        ],
        correctAnswer: 0,
        explanation: "RICE calculates prioritization score: (Reach × Impact × Confidence) / Effort."
      },
      {
        id: 2,
        question: "In product analytics, what does 'CAC' stand for and why is it compared with 'LTV'?",
        options: [
          "Customer Acquisition Cost; LTV (Lifetime Value) must exceed CAC for a sustainable business model",
          "Code Alignment Metric; LTV measures server uptime",
          "Customer Retention Rate; LTV measures market share percentage",
          "Channel Allocation Cost; LTV measures team velocity"
        ],
        correctAnswer: 0,
        explanation: "A healthy SaaS unit economic standard is typically LTV : CAC ≥ 3:1."
      },
      {
        id: 3,
        question: "What is an MVP (Minimum Viable Product)?",
        options: [
          "A fully polished final product release after 3 years",
          "The simplest version of a product that delivers core value to test hypotheses with real users",
          "A internal wireframe sketch never shown to customers",
          "A bug-free code repository template"
        ],
        correctAnswer: 1,
        explanation: "MVP allows fast feedback loops and validation with minimal engineering effort."
      },
      {
        id: 4,
        question: "In Agile methodology, what is the main goal of a Sprint Retrospective?",
        options: [
          "To present final sales numbers to executives",
          "To reflect on team process, celebrate wins, and identify process improvements for the next sprint",
          "To assign blame for delayed features",
          "To rewrite application source code in Rust"
        ],
        correctAnswer: 1,
        explanation: "Retrospectives focus on continuous team process optimization after every iteration cycle."
      },
      {
        id: 5,
        question: "What is the difference between product 'Features' and product 'Outcomes'?",
        options: [
          "Features are the outputs built; Outcomes are the measurable changes in user behavior/business value",
          "Features measure revenue; Outcomes measure team size",
          "Features are bug reports; Outcomes are user stories",
          "There is no difference"
        ],
        correctAnswer: 0,
        explanation: "Great product teams focus on driving user outcomes (retention, efficiency) rather than just shipping feature outputs."
      }
    ]
  },

  'UI/UX & Interactive Design': {
    domain: 'UI/UX & Interactive Design',
    questions: [
      {
        id: 1,
        question: "What is the recommended minimum WCAG contrast ratio for normal body text against its background?",
        options: [
          "2.0:1",
          "3.0:1",
          "4.5:1",
          "7.0:1"
        ],
        correctAnswer: 2,
        explanation: "WCAG 2.1 AA level requires a contrast ratio of at least 4.5:1 for standard text."
      },
      {
        id: 2,
        question: "In UX research, what is a 'Usability Test'?",
        options: [
          "A automated unit test checking JavaScript syntax",
          "Observing representative users completing target tasks to identify friction points",
          "A survey asking users what features they want to see in 5 years",
          "A benchmark test of GPU graphics rendering"
        ],
        correctAnswer: 1,
        explanation: "Observing real task execution exposes actual usability barriers rather than stated preferences."
      },
      {
        id: 3,
        question: "What is a 'Design System'?",
        options: [
          "A collection of reusable UI components, tokens, and guidelines for brand consistency",
          "A graphic editing software tool like Photoshop",
          "A list of database table schemas",
          "A company hardware procurement policy"
        ],
        correctAnswer: 0,
        explanation: "Design systems unify product teams around standardized UI primitives, typography tokens, and design patterns."
      },
      {
        id: 4,
        question: "What principle of Visual Hierarchy directs a user's eye to the most important element first?",
        options: [
          "Contrast, scale, typography weight, and strategic whitespace",
          "Using maximum saturated colors on every button",
          "Placing all text in uppercase font",
          "Hiding all call-to-action buttons inside menus"
        ],
        correctAnswer: 0,
        explanation: "Scale, contrast, and whitespace create visual dominance, establishing intuitive reading order."
      },
      {
        id: 5,
        question: "What is Fitts's Law in UI/UX design?",
        options: [
          "Target acquisition time depends on target distance and target size (larger/nearer targets are easier to click)",
          "Users scan web pages in a strict Z-pattern only",
          "Websites must load within 500 milliseconds",
          "Dark mode uses less battery power on OLED screens"
        ],
        correctAnswer: 0,
        explanation: "Fitts's Law dictates making primary interactive targets large and easy to reach."
      }
    ]
  },

  'Cybersecurity & Ethical Hacking': {
    domain: 'Cybersecurity & Ethical Hacking',
    questions: [
      {
        id: 1,
        question: "What vulnerability allows an attacker to execute malicious SQL statements that bypass web app authentication?",
        options: [
          "Cross-Site Scripting (XSS)",
          "SQL Injection (SQLi)",
          "Cross-Site Request Forgery (CSRF)",
          "Buffer Overflow"
        ],
        correctAnswer: 1,
        explanation: "SQLi occurs when un-sanitized user input is concatenated directly into SQL database queries."
      },
      {
        id: 2,
        question: "What principle dictates that users/processes should only be granted minimum access permissions necessary to perform their role?",
        options: [
          "Principle of Least Privilege (PoLP)",
          "Defense in Depth",
          "Zero Knowledge Proof",
          "Open Web Application Security Project (OWASP)"
        ],
        correctAnswer: 0,
        explanation: "Least Privilege reduces exposure and limits blast radius in case of credentials compromise."
      },
      {
        id: 3,
        question: "What is Cross-Site Scripting (XSS)?",
        options: [
          "Injecting malicious client-side scripts into web pages viewed by other users",
          "Cracking WPA2 Wi-Fi passwords using brute force",
          "Intercepting Bluetooth radio signals",
          "DDoS attack targeting DNS servers"
        ],
        correctAnswer: 0,
        explanation: "XSS executes attacker JavaScript inside the victim's browser context, allowing session cookie theft."
      },
      {
        id: 4,
        question: "What type of encryption uses a public key for encryption and a private key for decryption?",
        options: [
          "Symmetric Encryption (e.g. AES-256)",
          "Asymmetric Encryption (e.g. RSA, ECC)",
          "MD5 Hashing",
          "Base64 Encoding"
        ],
        correctAnswer: 1,
        explanation: "Asymmetric cryptography relies on key pairs for secure data exchange and digital signatures."
      },
      {
        id: 5,
        question: "What is a 'Zero-Day' vulnerability?",
        options: [
          "A security flaw that is known to software vendors for zero days and has no official patch available",
          "A server outage lasting exactly 24 hours",
          "A bug reported on day 0 of project inception",
          "A expired SSL certificate"
        ],
        correctAnswer: 0,
        explanation: "Zero-days present extreme risk because attackers exploit them before developers can issue patches."
      }
    ]
  }
};
