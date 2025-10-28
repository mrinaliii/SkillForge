export interface QuizQuestion {
  id: number;
  question: string;
  code?: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface SkillQuiz {
  skillName: string;
  questions: QuizQuestion[];
}

export const quizDatabase: Record<string, QuizQuestion[]> = {
  React: [
    {
      id: 1,
      question: "What hook is used to manage side effects in React?",
      options: ["useState", "useEffect", "useContext", "useReducer"],
      correctAnswer: 1,
      explanation:
        "useEffect is used to perform side effects like data fetching, subscriptions, or manually changing the DOM.",
    },
    {
      id: 2,
      question: "Which method is used to update state in a class component?",
      options: [
        "this.state = newState",
        "this.setState()",
        "this.updateState()",
        "this.changeState()",
      ],
      correctAnswer: 1,
      explanation:
        "this.setState() is the correct method to update state in class components.",
    },
    {
      id: 3,
      question: "What does JSX stand for?",
      options: [
        "JavaScript XML",
        "Java Syntax Extension",
        "JavaScript Extension",
        "Java XML",
      ],
      correctAnswer: 0,
      explanation:
        "JSX stands for JavaScript XML. It allows us to write HTML in React.",
    },
    {
      id: 4,
      question: "Which hook would you use to access context?",
      code: "const value = use______(MyContext);",
      options: ["useContext", "useState", "useEffect", "useRef"],
      correctAnswer: 0,
      explanation:
        "useContext is used to consume context values in functional components.",
    },
    {
      id: 5,
      question: "How do you pass data from parent to child component?",
      options: [
        "Through state",
        "Through props",
        "Through context",
        "Through refs",
      ],
      correctAnswer: 1,
      explanation:
        "Props (properties) are used to pass data from parent to child components.",
    },
    {
      id: 6,
      question: "What is the virtual DOM?",
      options: [
        "A copy of the browser DOM",
        "A lightweight representation of the DOM",
        "A database for React",
        "A testing environment",
      ],
      correctAnswer: 1,
      explanation:
        "The virtual DOM is a lightweight copy of the actual DOM that React uses for efficient updates.",
    },
    {
      id: 7,
      question: "Which lifecycle method runs after component mounts?",
      options: [
        "componentWillMount",
        "componentDidMount",
        "componentWillUpdate",
        "render",
      ],
      correctAnswer: 1,
      explanation:
        "componentDidMount runs immediately after a component is mounted (inserted into the tree).",
    },
    {
      id: 8,
      question: "What does the key prop do in React lists?",
      options: [
        "Encrypts the data",
        "Helps React identify which items have changed",
        "Sorts the list",
        "Validates the data",
      ],
      correctAnswer: 1,
      explanation:
        "Keys help React identify which items have changed, are added, or are removed.",
    },
    {
      id: 9,
      question: "How do you prevent default form submission?",
      options: [
        "e.preventDefault()",
        "e.stopPropagation()",
        "return false",
        "e.cancel()",
      ],
      correctAnswer: 0,
      explanation:
        "e.preventDefault() prevents the default action of an event from occurring.",
    },
    {
      id: 10,
      question: "What is a higher-order component?",
      options: [
        "A component with high priority",
        "A function that takes a component and returns a new component",
        "A component at the top of the tree",
        "A component with many props",
      ],
      correctAnswer: 1,
      explanation:
        "A HOC is a function that takes a component and returns a new enhanced component.",
    },
  ],

  JavaScript: [
    {
      id: 1,
      question: "What is the output of: typeof null?",
      options: ["null", "object", "undefined", "number"],
      correctAnswer: 1,
      explanation:
        'typeof null returns "object" - this is a known bug in JavaScript that cannot be fixed for backwards compatibility.',
    },
    {
      id: 2,
      question: "Which method adds an element to the end of an array?",
      options: ["push()", "pop()", "shift()", "unshift()"],
      correctAnswer: 0,
      explanation: "push() adds one or more elements to the end of an array.",
    },
    {
      id: 3,
      question: "What does === check for?",
      options: [
        "Value only",
        "Type only",
        "Both value and type",
        "Reference only",
      ],
      correctAnswer: 2,
      explanation:
        "The === operator checks for both value and type equality (strict equality).",
    },
    {
      id: 4,
      question: "How do you create a promise?",
      options: [
        "new Promise()",
        "Promise.create()",
        "createPromise()",
        "Promise.new()",
      ],
      correctAnswer: 0,
      explanation:
        "new Promise() is the constructor to create a new Promise object.",
    },
    {
      id: 5,
      question: "What is the difference between let and var?",
      options: [
        "No difference",
        "let is block-scoped",
        "var is newer",
        "let is global",
      ],
      correctAnswer: 1,
      explanation: "let is block-scoped while var is function-scoped.",
    },
    {
      id: 6,
      question: "Which method is used to iterate over an array?",
      options: ["forEach()", "for()", "while()", "All of the above"],
      correctAnswer: 3,
      explanation:
        "All of these can be used to iterate over arrays, each with different use cases.",
    },
    {
      id: 7,
      question: "What does JSON.parse() do?",
      options: [
        "Converts object to JSON",
        "Converts JSON to object",
        "Validates JSON",
        "Compresses JSON",
      ],
      correctAnswer: 1,
      explanation:
        "JSON.parse() converts a JSON string into a JavaScript object.",
    },
    {
      id: 8,
      question: "What is a closure?",
      options: [
        "A function inside another function",
        "A function that has access to outer function variables",
        "A closed function",
        "A private function",
      ],
      correctAnswer: 1,
      explanation:
        "A closure is a function that has access to variables in its outer (enclosing) lexical scope.",
    },
    {
      id: 9,
      question: 'What does "use strict" do?',
      options: [
        "Makes code faster",
        "Enables strict mode",
        "Optimizes code",
        "Nothing",
      ],
      correctAnswer: 1,
      explanation:
        '"use strict" enables strict mode, which catches common coding errors and prevents certain actions.',
    },
    {
      id: 10,
      question: "How do you copy an array?",
      options: ["array.copy()", "[...array]", "array.clone()", "copy(array)"],
      correctAnswer: 1,
      explanation:
        "The spread operator [...array] creates a shallow copy of an array.",
    },
  ],

  Python: [
    {
      id: 1,
      question: "What is the output of: print(type([]))?",
      options: [
        '<class "array">',
        '<class "list">',
        '<class "tuple">',
        '<class "dict">',
      ],
      correctAnswer: 1,
      explanation:
        '[] creates a list in Python, so type([]) returns <class "list">.',
    },
    {
      id: 2,
      question: "Which keyword is used to create a function?",
      options: ["function", "def", "func", "define"],
      correctAnswer: 1,
      explanation: "def is the keyword used to define a function in Python.",
    },
    {
      id: 3,
      question: "What does len() do?",
      options: [
        "Returns length",
        "Calculates sum",
        "Counts items",
        "Both A and C",
      ],
      correctAnswer: 3,
      explanation: "len() returns the length (number of items) of an object.",
    },
    {
      id: 4,
      question: "Which is mutable in Python?",
      options: ["String", "Tuple", "List", "Integer"],
      correctAnswer: 2,
      explanation:
        "Lists are mutable in Python, meaning they can be changed after creation.",
    },
    {
      id: 5,
      question: "What is a lambda function?",
      options: [
        "A named function",
        "An anonymous function",
        "A class method",
        "A built-in function",
      ],
      correctAnswer: 1,
      explanation:
        "Lambda functions are small anonymous functions defined with the lambda keyword.",
    },
    {
      id: 6,
      question: "How do you import a module?",
      options: [
        "include module",
        "import module",
        "require module",
        "use module",
      ],
      correctAnswer: 1,
      explanation: "The import keyword is used to import modules in Python.",
    },
    {
      id: 7,
      question: "What does ** operator do?",
      options: ["Multiplication", "Exponentiation", "Division", "Modulo"],
      correctAnswer: 1,
      explanation:
        "** is the exponentiation operator in Python (e.g., 2**3 = 8).",
    },
    {
      id: 8,
      question: "Which method adds an item to a list?",
      options: ["add()", "append()", "insert()", "Both B and C"],
      correctAnswer: 3,
      explanation: "Both append() and insert() can add items to a list.",
    },
    {
      id: 9,
      question: "What is PEP 8?",
      options: ["Python version", "Style guide", "Package manager", "IDE"],
      correctAnswer: 1,
      explanation:
        "PEP 8 is the official Python style guide for writing clean, readable code.",
    },
    {
      id: 10,
      question: "How do you handle exceptions?",
      options: ["if-else", "try-except", "catch-throw", "handle-error"],
      correctAnswer: 1,
      explanation: "try-except blocks are used to handle exceptions in Python.",
    },
  ],

  TypeScript: [
    {
      id: 1,
      question: "What is TypeScript?",
      options: [
        "A JavaScript framework",
        "A superset of JavaScript",
        "A database",
        "A CSS preprocessor",
      ],
      correctAnswer: 1,
      explanation:
        "TypeScript is a superset of JavaScript that adds static typing.",
    },
    {
      id: 2,
      question: "How do you define a type?",
      options: [
        "type Name = string",
        "define Name string",
        "var Name: string",
        "string Name",
      ],
      correctAnswer: 0,
      explanation: "type Name = string creates a type alias in TypeScript.",
    },
    {
      id: 3,
      question: "What is an interface?",
      options: [
        "A class",
        "A contract for object shape",
        "A function",
        "A variable",
      ],
      correctAnswer: 1,
      explanation: "An interface defines a contract that objects must follow.",
    },
    {
      id: 4,
      question: "What does the ? operator mean?",
      options: ["Required", "Optional", "Nullable", "Conditional"],
      correctAnswer: 1,
      explanation: "The ? makes a property optional in TypeScript.",
    },
    {
      id: 5,
      question: "How do you specify return type?",
      options: [
        "function(): type",
        "function() -> type",
        "function(): type {}",
        "Both A and C",
      ],
      correctAnswer: 3,
      explanation:
        "function(): type {} specifies the return type after the colon.",
    },
    {
      id: 6,
      question: "What is a generic?",
      options: [
        "A type that works with any type",
        "A general function",
        "A basic type",
        "A default value",
      ],
      correctAnswer: 0,
      explanation:
        "Generics allow you to write flexible, reusable code that works with any type.",
    },
    {
      id: 7,
      question: "What does enum do?",
      options: [
        "Creates constants",
        "Creates a set of named constants",
        "Creates variables",
        "Creates functions",
      ],
      correctAnswer: 1,
      explanation:
        "enum creates a set of named constants for better code readability.",
    },
    {
      id: 8,
      question: "What is the any type?",
      options: ["No type checking", "Any number", "Any string", "Any object"],
      correctAnswer: 0,
      explanation: "any disables type checking for a variable.",
    },
    {
      id: 9,
      question: "How do you make a readonly property?",
      options: [
        "const property",
        "readonly property",
        "final property",
        "immutable property",
      ],
      correctAnswer: 1,
      explanation:
        "readonly modifier makes a property immutable after initialization.",
    },
    {
      id: 10,
      question: "What is a tuple?",
      options: [
        "An array",
        "An array with fixed length and types",
        "An object",
        "A function",
      ],
      correctAnswer: 1,
      explanation:
        "A tuple is an array with a fixed number of elements with known types.",
    },
  ],

  "Node.js": [
    {
      id: 1,
      question: "What is Node.js?",
      options: [
        "A framework",
        "A runtime environment",
        "A library",
        "A database",
      ],
      correctAnswer: 1,
      explanation:
        "Node.js is a JavaScript runtime built on Chrome's V8 engine.",
    },
    {
      id: 2,
      question: "Which module is used for file operations?",
      options: ["http", "fs", "path", "os"],
      correctAnswer: 1,
      explanation: "The fs (file system) module provides file operation APIs.",
    },
    {
      id: 3,
      question: "What does npm stand for?",
      options: [
        "Node Package Manager",
        "New Package Manager",
        "Node Programming Manager",
        "New Programming Module",
      ],
      correctAnswer: 0,
      explanation: "npm stands for Node Package Manager.",
    },
    {
      id: 4,
      question: "How do you import a module?",
      options: [
        "import module",
        'require("module")',
        "include module",
        "use module",
      ],
      correctAnswer: 1,
      explanation: "require() is used to import modules in Node.js (CommonJS).",
    },
    {
      id: 5,
      question: "What is Express.js?",
      options: ["A database", "A web framework", "A testing tool", "A bundler"],
      correctAnswer: 1,
      explanation:
        "Express.js is a minimal and flexible Node.js web application framework.",
    },
    {
      id: 6,
      question: "How do you handle async operations?",
      options: ["Callbacks", "Promises", "Async/await", "All of the above"],
      correctAnswer: 3,
      explanation:
        "Node.js supports callbacks, promises, and async/await for async operations.",
    },
    {
      id: 7,
      question: "What is middleware in Express?",
      options: [
        "A database",
        "Functions that execute during request-response cycle",
        "A router",
        "A template engine",
      ],
      correctAnswer: 1,
      explanation:
        "Middleware functions have access to request, response objects and next function.",
    },
    {
      id: 8,
      question: "Which command installs dependencies?",
      options: ["npm install", "npm add", "npm get", "npm download"],
      correctAnswer: 0,
      explanation:
        "npm install reads package.json and installs all dependencies.",
    },
    {
      id: 9,
      question: "What is package.json?",
      options: [
        "A JavaScript file",
        "A configuration file",
        "A database file",
        "A template file",
      ],
      correctAnswer: 1,
      explanation:
        "package.json contains metadata about the project and its dependencies.",
    },
    {
      id: 10,
      question: "How do you create a server?",
      options: [
        "http.createServer()",
        "server.create()",
        "new Server()",
        "createServer()",
      ],
      correctAnswer: 0,
      explanation: "http.createServer() creates an HTTP server instance.",
    },
  ],

  Docker: [
    {
      id: 1,
      question: "What is Docker?",
      options: [
        "A VM",
        "A containerization platform",
        "A programming language",
        "An IDE",
      ],
      correctAnswer: 1,
      explanation:
        "Docker is a platform for developing, shipping, and running applications in containers.",
    },
    {
      id: 2,
      question: "What is a Docker image?",
      options: [
        "A running container",
        "A blueprint for containers",
        "A file",
        "A database",
      ],
      correctAnswer: 1,
      explanation:
        "A Docker image is a read-only template used to create containers.",
    },
    {
      id: 3,
      question: "What is a container?",
      options: ["A VM", "A running instance of an image", "A file", "A server"],
      correctAnswer: 1,
      explanation: "A container is a running instance of a Docker image.",
    },
    {
      id: 4,
      question: "Which file defines Docker image?",
      options: ["docker.yml", "Dockerfile", "config.docker", "image.txt"],
      correctAnswer: 1,
      explanation: "Dockerfile contains instructions to build a Docker image.",
    },
    {
      id: 5,
      question: "What command builds an image?",
      options: ["docker create", "docker build", "docker make", "docker image"],
      correctAnswer: 1,
      explanation: "docker build builds an image from a Dockerfile.",
    },
    {
      id: 6,
      question: "How do you run a container?",
      options: [
        "docker start",
        "docker run",
        "docker execute",
        "docker launch",
      ],
      correctAnswer: 1,
      explanation: "docker run creates and starts a container from an image.",
    },
    {
      id: 7,
      question: "What is Docker Compose?",
      options: [
        "A music app",
        "A tool for multi-container apps",
        "An image editor",
        "A database",
      ],
      correctAnswer: 1,
      explanation:
        "Docker Compose is a tool for defining and running multi-container applications.",
    },
    {
      id: 8,
      question: "What does -d flag do?",
      options: ["Debug mode", "Detached mode", "Delete", "Download"],
      correctAnswer: 1,
      explanation: "-d runs a container in detached mode (in the background).",
    },
    {
      id: 9,
      question: "How do you list running containers?",
      options: ["docker list", "docker ps", "docker show", "docker containers"],
      correctAnswer: 1,
      explanation: "docker ps lists all running containers.",
    },
    {
      id: 10,
      question: "What is a Docker registry?",
      options: ["A container", "A storage for images", "A file", "A network"],
      correctAnswer: 1,
      explanation:
        "A Docker registry stores and distributes Docker images (like Docker Hub).",
    },
  ],

  // Add more skills as needed
  Git: [
    {
      id: 1,
      question: "What is Git?",
      options: [
        "A programming language",
        "A version control system",
        "A database",
        "An IDE",
      ],
      correctAnswer: 1,
      explanation:
        "Git is a distributed version control system for tracking changes in code.",
    },
    {
      id: 2,
      question: "How do you initialize a Git repository?",
      options: ["git start", "git init", "git create", "git new"],
      correctAnswer: 1,
      explanation:
        "git init initializes a new Git repository in the current directory.",
    },
    {
      id: 3,
      question: "What does git clone do?",
      options: [
        "Copies files",
        "Creates a copy of a repository",
        "Deletes a repository",
        "Renames a repository",
      ],
      correctAnswer: 1,
      explanation: "git clone creates a local copy of a remote repository.",
    },
    {
      id: 4,
      question: "How do you stage changes?",
      options: ["git stage", "git add", "git commit", "git push"],
      correctAnswer: 1,
      explanation: "git add stages changes for the next commit.",
    },
    {
      id: 5,
      question: "What does git commit do?",
      options: [
        "Uploads changes",
        "Saves staged changes",
        "Deletes files",
        "Creates a branch",
      ],
      correctAnswer: 1,
      explanation: "git commit saves staged changes to the local repository.",
    },
    {
      id: 6,
      question: "How do you push changes?",
      options: ["git upload", "git push", "git send", "git transfer"],
      correctAnswer: 1,
      explanation: "git push uploads local commits to a remote repository.",
    },
    {
      id: 7,
      question: "What is a branch?",
      options: [
        "A copy of code",
        "An independent line of development",
        "A folder",
        "A commit",
      ],
      correctAnswer: 1,
      explanation: "A branch is an independent line of development in Git.",
    },
    {
      id: 8,
      question: "How do you create a new branch?",
      options: [
        "git branch name",
        "git create name",
        "git new name",
        "git add branch name",
      ],
      correctAnswer: 0,
      explanation: "git branch name creates a new branch.",
    },
    {
      id: 9,
      question: "What does git merge do?",
      options: [
        "Deletes branches",
        "Combines branches",
        "Creates branches",
        "Renames branches",
      ],
      correctAnswer: 1,
      explanation: "git merge combines changes from different branches.",
    },
    {
      id: 10,
      question: "How do you view commit history?",
      options: ["git history", "git log", "git show", "git list"],
      correctAnswer: 1,
      explanation: "git log displays the commit history.",
    },
  ],
};

export const getQuizForSkill = (skillName: string): QuizQuestion[] => {
  const normalizedSkillName = skillName.toLowerCase().trim();

  // Exact match
  if (quizDatabase[skillName]) {
    return quizDatabase[skillName];
  }

  for (const [key, questions] of Object.entries(quizDatabase)) {
    if (
      key.toLowerCase().includes(normalizedSkillName) ||
      normalizedSkillName.includes(key.toLowerCase())
    ) {
      return questions;
    }
  }

  return quizDatabase["JavaScript"] || [];
};

export const getRandomQuestions = (
  questions: QuizQuestion[],
  count: number = 10,
): QuizQuestion[] => {
  const shuffled = [...questions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

export const getAvailableSkills = (): string[] => {
  return Object.keys(quizDatabase);
};
