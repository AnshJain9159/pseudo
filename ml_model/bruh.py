import random
import json
import google.generativeai as genai #type: ignore
import time
import os
from typing import Dict, List, Any

# Configure Gemini
genai.configure(api_key='YOUR_API_KEY_HERE')
model = genai.GenerativeModel("gemini-1.5-flash-8b")

def save_conversation_to_file(dataset: List[Dict], filename: str) -> None:
    """Save the conversation dataset to a JSON file."""
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(dataset, f, indent=4)

def generate_student_initial_query(main_topic: str, category: str, sub_topic: str) -> str:
    """Generate a realistic student question about a specific topic."""
    prompts = [
        f"Generate a realistic question a student might ask when struggling with {sub_topic} in {category} (part of {main_topic}). "
        "Make it specific and show partial understanding but also confusion.",
        
        f"Create a statement from a student expressing difficulty with {sub_topic} (a concept in {category} under {main_topic}). "
        "Include their current understanding and what's confusing them.",
        
        f"Write a student's initial message asking for help with {sub_topic} in {category} ({main_topic}). "
        "Show them attempting to explain their understanding but getting stuck."
    ]
    
    prompt = random.choice(prompts)
    
    for attempt in range(5):
        try:
            response = model.generate_content(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    max_output_tokens=150,
                    temperature=0.9,
                ),
            )
            return response._result.candidates[0].content.parts[0].text.strip()
        except Exception as e:
            print(f"Attempt {attempt + 1} failed: {e}")
            time.sleep(2 ** attempt)
    
    return "I'm having trouble understanding this concept. Could you explain it?"

def generate_tutor_response(student_message: str, main_topic: str, category: str, 
                          sub_topic: str, conversation_history: List[Dict]) -> str:
    """Generate a Socratic-style tutor response."""
    history_context = "\n".join([f"{msg['role']}: {msg['content']}" for msg in conversation_history])
    
    prompts = [
        f"Context: Teaching {sub_topic} in {category} ({main_topic}).\n"
        f"Conversation history:\n{history_context}\n"
        f"Student: {student_message}\n\n"
        "Generate a Socratic response that:\n"
        "1. Acknowledges the student's understanding\n"
        "2. Asks guiding questions\n"
        "3. Uses relevant analogies\n"
        "Keep it encouraging and natural.",
        
        f"You're tutoring {sub_topic} ({category} in {main_topic}).\n"
        f"History:\n{history_context}\n"
        f"Latest student message: {student_message}\n\n"
        "Create a response that:\n"
        "1. Builds on their knowledge\n"
        "2. Poses thought-provoking questions\n"
        "3. Makes meaningful connections"
    ]
    
    prompt = random.choice(prompts)
    
    for attempt in range(5):
        try:
            response = model.generate_content(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    max_output_tokens=200,
                    temperature=0.8,
                ),
            )
            return response._result.candidates[0].content.parts[0].text.strip()
        except Exception as e:
            print(f"Attempt {attempt + 1} failed: {e}")
            time.sleep(2 ** attempt)
    
    return "That's an interesting point. Could you elaborate on your thinking?"

def generate_student_response(tutor_message: str, main_topic: str, category: str, 
                            sub_topic: str, conversation_history: List[Dict]) -> str:
    """Generate a realistic student response showing thinking process."""
    history_context = "\n".join([f"{msg['role']}: {msg['content']}" for msg in conversation_history])
    
    prompts = [
        f"Context: Learning {sub_topic} in {category} ({main_topic}).\n"
        f"History:\n{history_context}\n"
        f"Tutor: {tutor_message}\n\n"
        "Generate a student response that:\n"
        "1. Shows their thinking process\n"
        "2. May include partial understanding\n"
        "3. Could ask for clarification",
        
        f"Student learning {sub_topic} ({category} in {main_topic}).\n"
        f"Conversation:\n{history_context}\n"
        f"Latest tutor message: {tutor_message}\n\n"
        "Create a response showing:\n"
        "1. Effort to understand\n"
        "2. Their reasoning process\n"
        "3. Potential breakthrough or confusion"
    ]
    
    prompt = random.choice(prompts)
    
    for attempt in range(5):
        try:
            response = model.generate_content(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    max_output_tokens=150,
                    temperature=0.9,
                ),
            )
            return response._result.candidates[0].content.parts[0].text.strip()
        except Exception as e:
            print(f"Attempt {attempt + 1} failed: {e}")
            time.sleep(2 ** attempt)
    
    return "I think I understand, but could you explain it another way?"

def generate_conversations(curriculum: Dict[str, Any], config: Dict[str, int]) -> List[Dict]:
    """Generate conversations for all topics in the curriculum."""
    dataset = []
    
    for main_topic, categories in curriculum.items():
        print(f"\nGenerating conversations for {main_topic}...")
        
        for category_name, category_content in categories.items():
            print(f"\nProcessing category: {category_name}")
            
            # Handle nested structures
            if isinstance(category_content, dict):
                sub_topics = []
                for sub_category in category_content.values():
                    if isinstance(sub_category, list):
                        sub_topics.extend(sub_category)
            elif isinstance(category_content, list):
                sub_topics = category_content
            else:
                continue
            
            for sub_topic in sub_topics:
                print(f"Generating conversations for {sub_topic}...")
                
                for example_num in range(config['examples_per_topic']):
                    conversation = []
                    
                    # Initial student query
                    student_query = generate_student_initial_query(main_topic, category_name, sub_topic)
                    conversation.append({
                        'role': 'student',
                        'content': student_query,
                        'metadata': {
                            'main_topic': main_topic,
                            'category': category_name,
                            'sub_topic': sub_topic,
                            'turn': 1
                        }
                    })
                    
                    # Generate conversation turns
                    for turn in range(config['turns_per_conversation'] - 1):
                        # Tutor response
                        tutor_response = generate_tutor_response(
                            conversation[-1]['content'],
                            main_topic,
                            category_name,
                            sub_topic,
                            conversation
                        )
                        conversation.append({
                            'role': 'tutor',
                            'content': tutor_response,
                            'metadata': {
                                'main_topic': main_topic,
                                'category': category_name,
                                'sub_topic': sub_topic,
                                'turn': turn * 2 + 2
                            }
                        })
                        
                        # Student response
                        student_response = generate_student_response(
                            tutor_response,
                            main_topic,
                            category_name,
                            sub_topic,
                            conversation
                        )
                        conversation.append({
                            'role': 'student',
                            'content': student_response,
                            'metadata': {
                                'main_topic': main_topic,
                                'category': category_name,
                                'sub_topic': sub_topic,
                                'turn': turn * 2 + 3
                            }
                        })
                    
                    dataset.append(conversation)
                    
                    # Save after each conversation
                    save_conversation_to_file(dataset, config['output_file'])
                    print(f"Saved conversation {example_num + 1} for {sub_topic}")
                    
                    # Rate limiting delay
                    time.sleep(config['delay_between_conversations'])
    
    return dataset

# Configuration
config = {
    'examples_per_topic': 2,  # Number of conversations per sub-topic
    'turns_per_conversation': 4,  # Number of back-and-forth exchanges
    'output_file': 'socratic_teaching_conversations.json',
    'delay_between_conversations': 2  # Seconds between conversations to avoid rate limiting
}
computer_science_curriculum = {
    "Programming_Fundamentals": {
        "Basics": [
            "Variables and Data Types",
            "Operators",
            "Control Flow",
            "Functions",
            "Arrays and Collections",
            "Error Handling",
            "File I/O"
        ],
        "Object_Oriented_Programming": [
            "Classes and Objects",
            "Inheritance",
            "Polymorphism",
            "Encapsulation",
            "Abstraction",
            "Interfaces",
            "Design Patterns"
        ],
        "Functional_Programming": [
            "Pure Functions",
            "Immutability",
            "First-Class Functions",
            "Higher-Order Functions",
            "Recursion",
            "Lambda Functions"
        ],
        "Programming_Paradigms": [
            "Procedural",
            "Object-Oriented",
            "Functional",
            "Logic",
            "Concurrent"
        ]
    },

    "Data_Structures": {
        "Linear_Structures": [
            "Arrays",
            "Linked Lists",
            "Stacks",
            "Queues",
            "Hash Tables"
        ],
        "Non_Linear_Structures": {
            "Trees": [
                "Binary Trees",
                "BST",
                "AVL Trees",
                "Red-Black Trees",
                "B-Trees",
                "Tries"
            ],
            "Graphs": [
                "Directed Graphs",
                "Undirected Graphs",
                "Weighted Graphs",
                "Graph Representations"
            ],
            "Heaps": [
                "Min Heap",
                "Max Heap",
                "Priority Queues"
            ]
        }
    },

    "Algorithms": {
        "Sorting": [
            "Bubble Sort",
            "Selection Sort",
            "Insertion Sort",
            "Merge Sort",
            "Quick Sort",
            "Heap Sort",
            "Radix Sort"
        ],
        "Searching": [
            "Linear Search",
            "Binary Search",
            "Depth First Search",
            "Breadth First Search",
            "A* Search"
        ],
        "Algorithm_Paradigms": [
            "Divide and Conquer",
            "Dynamic Programming",
            "Greedy Algorithms",
            "Backtracking",
            "Branch and Bound"
        ],
        "Graph_Algorithms": [
            "Shortest Path",
            "Minimum Spanning Tree",
            "Topological Sort",
            "Network Flow"
        ]
    },

    "Computer_Architecture": {
        "Digital_Logic": [
            "Boolean Algebra",
            "Logic Gates",
            "Circuit Design",
            "Memory Units",
            "Flip-Flops"
        ],
        "Computer_Organization": [
            "CPU Architecture",
            "Memory Hierarchy",
            "I/O Systems",
            "Pipelining",
            "Cache Design"
        ],
        "Assembly_Language": [
            "Instructions",
            "Addressing Modes",
            "Registers",
            "Memory Management",
            "System Calls"
        ]
    },

    "Operating_Systems": {
        "Process_Management": [
            "Processes",
            "Threads",
            "Scheduling",
            "Synchronization",
            "Deadlocks"
        ],
        "Memory_Management": [
            "Virtual Memory",
            "Paging",
            "Segmentation",
            "Memory Allocation"
        ],
        "File_Systems": [
            "File Organization",
            "Directory Structure",
            "File Allocation",
            "Access Methods"
        ],
        "Security": [
            "Authentication",
            "Authorization",
            "Access Control",
            "Cryptography"
        ]
    },

    "Database_Systems": {
        "Database_Design": [
            "ER Model",
            "Normalization",
            "Schema Design",
            "ACID Properties"
        ],
        "SQL": [
            "DDL",
            "DML",
            "DCL",
            "TCL",
            "Queries",
            "Joins",
            "Indexing"
        ],
        "Database_Architecture": [
            "Storage Structures",
            "Query Processing",
            "Transaction Management",
            "Concurrency Control"
        ]
    },

    "Computer_Networks": {
        "Network_Layers": [
            "Physical Layer",
            "Data Link Layer",
            "Network Layer",
            "Transport Layer",
            "Application Layer"
        ],
        "Protocols": [
            "TCP/IP",
            "UDP",
            "HTTP/HTTPS",
            "DNS",
            "DHCP"
        ],
        "Network_Security": [
            "Encryption",
            "Firewalls",
            "VPN",
            "Security Protocols"
        ]
    },

    "Software_Engineering": {
        "Development_Lifecycle": [
            "Requirements Analysis",
            "Design",
            "Implementation",
            "Testing",
            "Maintenance"
        ],
        "Design_Principles": [
            "SOLID Principles",
            "Design Patterns",
            "Architecture Patterns",
            "UML"
        ],
        "Software_Testing": [
            "Unit Testing",
            "Integration Testing",
            "System Testing",
            "Regression Testing"
        ],
        "Project_Management": [
            "Agile",
            "Scrum",
            "Version Control",
            "CI/CD"
        ]
    },

    "Artificial_Intelligence": {
        "Machine_Learning": [
            "Supervised Learning",
            "Unsupervised Learning",
            "Reinforcement Learning",
            "Neural Networks",
            "Deep Learning"
        ],
        "Natural_Language_Processing": [
            "Text Processing",
            "Language Models",
            "Speech Recognition",
            "Machine Translation"
        ],
        "Computer_Vision": [
            "Image Processing",
            "Object Detection",
            "Face Recognition",
            "Scene Understanding"
        ]
    },

    "Theory_of_Computation": {
        "Automata_Theory": [
            "Finite Automata",
            "Push-Down Automata",
            "Turing Machines"
        ],
        "Computability": [
            "Regular Languages",
            "Context-Free Languages",
            "Recursive Languages"
        ],
        "Complexity_Theory": [
            "P vs NP",
            "Space Complexity",
            "Time Complexity",
            "Complexity Classes"
        ]
    }
}

# Generate conversations
if __name__ == "__main__":
    conversations = generate_conversations(computer_science_curriculum, config)
    print("\nConversation generation completed!")
    print(f"Total conversations generated: {len(conversations)}")