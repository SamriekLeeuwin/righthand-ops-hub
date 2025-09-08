# JavaScript/TypeScript Begrippenlijst

## 🔧 **Destructuring (Destructurering)**

**Wat het is:** Het uitpakken van waarden uit arrays of objecten in aparte variabelen. Het is alsof je een doos uitpakt en de inhoud in aparte bakjes legt.

### **Object Destructuring:**
```typescript
// In ons auth.controller.ts - regel 34
const { email, password } = request.body as { email: string; password: string };

// Dit is hetzelfde als:
const email = request.body.email;
const password = request.body.password;

// Maar veel korter en duidelijker!
```

### **Array Destructuring:**
```typescript
// Basis voorbeeld
const [first, second, third] = ['a', 'b', 'c'];
console.log(first);  // 'a'
console.log(second); // 'b'

// In praktijk - error handling
const [error, result] = await someAsyncFunction();
if (error) {
  console.error(error);
} else {
  console.log(result);
}
```

### **Nested Destructuring:**
```typescript
// Complex object uitpakken
const response = {
  user: {
    id: 1,
    email: 'test@test.com',
    profile: {
      name: 'John',
      age: 25
    }
  }
};

// Alleen wat je nodig hebt
const { user: { id, email, profile: { name } } } = response;
console.log(id, email, name); // 1, 'test@test.com', 'John'
```

### **Destructuring met Default Values:**
```typescript
// Als property niet bestaat, gebruik default
const { name = 'Anonymous', age = 0 } = user;

// In ons project - JWT payload
const { userId, email, role = 'viewer' } = decodedToken;
```

### **Destructuring in Function Parameters:**
```typescript
// In plaats van:
function createUser(userData) {
  const name = userData.name;
  const email = userData.email;
}

// Korter met destructuring:
function createUser({ name, email, role = 'viewer' }) {
  console.log(`Creating user: ${name} with email: ${email}`);
}
```

**Waarom gebruiken:**
- **Kortere code**: Minder herhaling
- **Duidelijker**: Je ziet direct wat je gebruikt
- **Veiliger**: Default values voorkomen undefined errors
- **Modern**: Standaard in moderne JavaScript

---

## 🏗️ **Interface**

**Wat het is:** Een contract dat definieert welke properties een object moet hebben. Het is alsof je een blauwdruk maakt van hoe een object eruit moet zien.

### **Basis Interface:**
```typescript
// In ons Custom.Interface.ts
interface AuthenticatedRequest extends FastifyRequest {
  user: {
    id: number;
    email: string;
    role: string;
  };
}

// Dit betekent: "Elk AuthenticatedRequest object MOET een user property hebben
// met id (number), email (string) en role (string)"
```

### **Hoe het werkt in de praktijk:**
```typescript
// Zonder interface - TypeScript weet niet wat request.user is
export async function getCurrentUser(request: FastifyRequest, reply: FastifyReply) {
  const user = request.user; // ❌ Error: Property 'user' does not exist
}

// Met interface - TypeScript weet precies wat er mogelijk is
export async function getCurrentUser(request: AuthenticatedRequest, reply: FastifyReply) {
  const user = request.user; // ✅ TypeScript weet: user heeft id, email, role
  console.log(user.id);    // ✅ Autocomplete werkt!
  console.log(user.email); // ✅ TypeScript controleert types
}
```

### **Interface vs Type:**
```typescript
// Interface (kan uitgebreid worden)
interface User {
  id: number;
  name: string;
}

interface AdminUser extends User {
  permissions: string[];
}

// Type (kan niet uitgebreid worden)
type User = {
  id: number;
  name: string;
};
```

### **Optional Properties:**
```typescript
interface User {
  id: number;
  name: string;
  email?: string; // ? betekent: optioneel
  age?: number;   // Kan undefined zijn
}

// Gebruik:
const user1: User = { id: 1, name: 'John' }; // ✅ email en age zijn optioneel
const user2: User = { id: 2, name: 'Jane', email: 'jane@test.com' }; // ✅
```

### **Readonly Properties:**
```typescript
interface User {
  readonly id: number; // Kan niet gewijzigd worden na creatie
  name: string;
  email: string;
}

const user: User = { id: 1, name: 'John', email: 'john@test.com' };
user.name = 'Jane'; // ✅ Kan wel
user.id = 2;        // ❌ Error: Cannot assign to 'id' because it is a read-only property
```

### **Function Interfaces:**
```typescript
// Interface voor functies
interface AuthFunction {
  (email: string, password: string): Promise<boolean>;
}

// Gebruik:
const login: AuthFunction = async (email, password) => {
  // Implementatie
  return true;
};
```

### **Generic Interfaces:**
```typescript
// Interface die werkt met verschillende types
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

// Gebruik:
const userResponse: ApiResponse<User> = {
  success: true,
  data: { id: 1, name: 'John' },
  message: 'User found'
};

const usersResponse: ApiResponse<User[]> = {
  success: true,
  data: [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }],
  message: 'Users found'
};
```

**Waarom gebruiken:**
- **Type Safety**: TypeScript controleert of je de juiste properties gebruikt
- **Autocomplete**: IDE helpt je met beschikbare properties
- **Documentatie**: Andere developers weten wat ze kunnen verwachten
- **Refactoring**: Veilige wijzigingen in codebase
- **Error Prevention**: Fouten worden gevangen tijdens development, niet in productie

---

## 🎯 **Type Assertion**

**Wat het is:** Vertel TypeScript welk type een waarde heeft, ook al weet TypeScript het niet zeker. Het is alsof je tegen TypeScript zegt: "Vertrouw me, ik weet wat ik doe!"

### **Basis Type Assertion:**
```typescript
// In ons auth.controller.ts - regel 34
const { email, password } = request.body as { email: string; password: string };

// TypeScript weet niet wat request.body bevat, dus we vertellen het
// "request.body is een object met email (string) en password (string)"
```

### **as any - De "nucleaire optie":**
```typescript
// In onze oude code (voordat we interfaces hadden)
const user = (request as any).user;

// Dit betekent: "TypeScript, negeer alle type checking voor dit object"
// ⚠️ Gevaarlijk! Je verliest alle type safety
```

### **as CustomType - Specifiek type:**
```typescript
// In ons auth.service.ts
const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;

// We weten dat jwt.verify een JWTPayload teruggeeft, dus we vertellen TypeScript dat
```

### **Angle Bracket Syntax (alternatief):**
```typescript
// Zelfde als hierboven, maar andere syntax
const decoded = <JWTPayload>jwt.verify(token, JWT_SECRET);

// Beide manieren werken, maar 'as' is populairder
```

### **Type Assertion vs Type Guard:**
```typescript
// Type Assertion (gevaarlijk - geen runtime check)
const user = request.body as User; // TypeScript vertrouwt je

// Type Guard (veilig - runtime check)
function isUser(obj: any): obj is User {
  return obj && typeof obj.id === 'number' && typeof obj.name === 'string';
}

if (isUser(request.body)) {
  // Nu weet TypeScript zeker dat request.body een User is
  console.log(request.body.name); // ✅ Type safe
}
```

### **Wanneer Type Assertion gebruiken:**
```typescript
// ✅ Goed - Wanneer je zeker weet van het type
const element = document.getElementById('myButton') as HTMLButtonElement;

// ✅ Goed - Bij API responses waar je het schema kent
const response = await fetch('/api/users') as User[];

// ❌ Slecht - Wanneer je niet zeker bent
const user = someUnknownData as User; // Kan crashen!

// ❌ Slecht - Als permanente oplossing
const data = (request as any).data; // Gebruik interfaces in plaats daarvan
```

### **Non-null Assertion:**
```typescript
// Vertel TypeScript dat iets niet null/undefined is
const user = getUser()!; // ! betekent "dit is niet null"

// Zelfde als:
const user = getUser() as NonNullable<ReturnType<typeof getUser>>;

// Gebruik alleen als je 100% zeker bent!
```

**Waarom gebruiken:**
- **Legacy Code**: Werken met oude JavaScript libraries
- **DOM Manipulation**: HTML elements hebben complexe types
- **API Responses**: Wanneer je het response schema kent
- **Migration**: Tijdelijke oplossing tijdens TypeScript migratie

**Waarom voorzichtig zijn:**
- **Geen Runtime Check**: TypeScript controleert niet of je gelijk hebt
- **Crashes**: Verkeerde assertion kan runtime errors veroorzaken
- **Maintenance**: Code wordt moeilijker te onderhouden

---

## 🔄 **Async/Await**

**Wat het is:** Moderne manier om met promises te werken.

```typescript
// Oude manier (callbacks)
getUser(id, (user) => {
  console.log(user);
});

// Promise way
getUser(id).then(user => {
  console.log(user);
});

// Async/await (moderne manier)
const user = await getUser(id);
console.log(user);
```

**Waarom gebruiken:**
- Leesbaarder code
- Minder nesting
- Makkelijker error handling

---

## 🛡️ **Try/Catch**

**Wat het is:** Error handling mechanisme.

```typescript
try {
  // Code die kan falen
  const user = await prisma.user.create(data);
} catch (error) {
  // Wat te doen bij fout
  console.error('Error:', error);
  reply.code(500).send({ error: 'Internal server error' });
}
```

**Waarom gebruiken:**
- Voorkomt crashes
- Graceful error handling
- User-friendly error messages

---

## 📦 **Import/Export**

**Wat het is:** Modules importeren en exporteren.

```typescript
// Named exports
export function registerUser() {}
export const SALT_ROUNDS = 10;

// Default export
export default class AuthService {}

// Import
import { registerUser, SALT_ROUNDS } from './auth.controller.js';
import AuthService from './auth.service.js';
```

**Waarom gebruiken:**
- Code organisatie
- Herbruikbaarheid
- Dependency management

---

## 🎨 **Template Literals**

**Wat het is:** Strings met variabelen en expressies.

```typescript
// Oude manier
const message = 'Hello ' + name + ', you are ' + age + ' years old';

// Template literals
const message = `Hello ${name}, you are ${age} years old`;

// Multiline strings
const sql = `
  SELECT * FROM users 
  WHERE email = '${email}'
`;
```

**Waarom gebruiken:**
- Leesbaarder
- Minder concatenatie
- Multiline support

---

## 🔧 **Arrow Functions**

**Wat het is:** Korte syntax voor functies.

```typescript
// Traditionele functie
function add(a, b) {
  return a + b;
}

// Arrow function
const add = (a, b) => a + b;

// Met body
const add = (a, b) => {
  const result = a + b;
  return result;
};
```

**Waarom gebruiken:**
- Kortere syntax
- Lexical this binding
- Functionaal programmeren

---

## 🎯 **Optional Chaining**

**Wat het is:** Veilig toegang tot nested properties.

```typescript
// Gevaarlijk - kan crashen
const email = user.profile.contact.email;

// Veilig met optional chaining
const email = user?.profile?.contact?.email;

// Met default value
const email = user?.profile?.contact?.email ?? 'no-email@example.com';
```

**Waarom gebruiken:**
- Voorkomt crashes
- Veilige property access
- Cleaner code

---

## 🔄 **Spread Operator**

**Wat het is:** Uitpakken van arrays/objecten.

```typescript
// Array spread
const numbers = [1, 2, 3];
const moreNumbers = [...numbers, 4, 5]; // [1, 2, 3, 4, 5]

// Object spread
const user = { id: 1, name: 'John' };
const userWithEmail = { ...user, email: 'john@example.com' };

// Function arguments
const tokens = { accessToken, refreshToken, expiresIn };
return { message: 'Success', ...tokens };
```

**Waarom gebruiken:**
- Immutability
- Object/array copying
- Function arguments

---

## 🎨 **Object Shorthand**

**Wat het is:** Korte syntax voor object properties.

```typescript
const name = 'John';
const age = 25;

// Lange manier
const person = {
  name: name,
  age: age,
  greet: function() {
    return 'Hello';
  }
};

// Shorthand
const person = {
  name,
  age,
  greet() {
    return 'Hello';
  }
};
```

**Waarom gebruiken:**
- Minder herhaling
- Cleaner code
- Modern JavaScript

---

## 🔧 **Const/Let vs Var**

**Wat het is:** Verschillende manieren om variabelen te declareren.

```typescript
// var - function scoped (oud)
var name = 'John';
if (true) {
  var name = 'Jane'; // Overschrijft bovenstaande
}

// let - block scoped
let name = 'John';
if (true) {
  let name = 'Jane'; // Alleen in deze block
}

// const - block scoped, niet hertoewijsbaar
const name = 'John';
name = 'Jane'; // Error!
```

**Waarom gebruiken:**
- Voorkomt bugs
- Duidelijkere scope
- Modern JavaScript

---

## 🎯 **Ternary Operator**

**Wat het is:** Korte if/else syntax.

```typescript
// Lange manier
let message;
if (user.isLoggedIn) {
  message = 'Welcome back!';
} else {
  message = 'Please login';
}

// Ternary operator
const message = user.isLoggedIn ? 'Welcome back!' : 'Please login';

// Nested ternary
const role = user.isAdmin ? 'admin' : user.isModerator ? 'moderator' : 'user';
```

**Waarom gebruiken:**
- Kortere code
- Functionaal programmeren
- Conditional rendering

---

## 🔄 **Array Methods**

**Wat het is:** Ingebouwde array functies.

```typescript
const users = [
  { id: 1, name: 'John', active: true },
  { id: 2, name: 'Jane', active: false }
];

// map - transformeer array
const names = users.map(user => user.name);

// filter - filter array
const activeUsers = users.filter(user => user.active);

// find - vind eerste match
const user = users.find(user => user.id === 1);

// reduce - reduceer tot één waarde
const totalUsers = users.reduce((count, user) => count + 1, 0);
```

**Waarom gebruiken:**
- Functionaal programmeren
- Leesbaarder code
- Minder loops

---

## 🛡️ **Nullish Coalescing**

**Wat het is:** Default waarde alleen voor null/undefined.

```typescript
// || operator - falsy values
const name = user.name || 'Anonymous'; // '' wordt ook 'Anonymous'

// ?? operator - alleen null/undefined
const name = user.name ?? 'Anonymous'; // '' blijft ''

// Praktisch voorbeeld
const port = process.env.PORT ?? 3000;
```

**Waarom gebruiken:**
- Precisere default values
- Voorkomt onverwachte gedrag
- Modern JavaScript

---

## 🎨 **Method Chaining**

**Wat het is:** Meerdere methodes achter elkaar aanroepen.

```typescript
// Zonder chaining
const result = users
  .filter(user => user.active)
  .map(user => user.name)
  .sort()
  .join(', ');

// Met chaining (jQuery style)
$('#myElement')
  .addClass('active')
  .fadeIn()
  .delay(1000)
  .fadeOut();
```

**Waarom gebruiken:**
- Leesbare code
- Functionaal programmeren
- Minder intermediate variables

---

## 🔧 **Callback Functions**

**Wat het is:** Functies die als argument worden doorgegeven.

```typescript
// Array method callbacks
users.forEach(user => {
  console.log(user.name);
});

// Event handlers
button.addEventListener('click', (event) => {
  console.log('Button clicked!');
});

// Async callbacks
setTimeout(() => {
  console.log('Delayed message');
}, 1000);
```

**Waarom gebruiken:**
- Event handling
- Array operations
- Async operations

---

## 🎯 **Closures**

**Wat het is:** Functie die toegang heeft tot outer scope.

```typescript
function createCounter() {
  let count = 0;
  
  return function() {
    count++;
    return count;
  };
}

const counter = createCounter();
console.log(counter()); // 1
console.log(counter()); // 2
```

**Waarom gebruiken:**
- Data privacy
- Function factories
- Module pattern

---

## 🔄 **Promises**

**Wat het is:** Object dat een toekomstige waarde representeert.

```typescript
// Promise creation
const fetchUser = (id) => {
  return new Promise((resolve, reject) => {
    if (id > 0) {
      resolve({ id, name: 'John' });
    } else {
      reject('Invalid ID');
    }
  });
};

// Promise usage
fetchUser(1)
  .then(user => console.log(user))
  .catch(error => console.error(error));
```

**Waarom gebruiken:**
- Async operations
- Error handling
- Chaining operations

---

## 🛡️ **Error Handling Patterns**

**Wat het is:** Verschillende manieren om errors te behandelen.

```typescript
// Try/catch
try {
  const user = await createUser(data);
} catch (error) {
  handleError(error);
}

// Error boundaries (React)
class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    logError(error, errorInfo);
  }
}

// Custom error classes
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}
```

**Waarom gebruiken:**
- Graceful degradation
- User experience
- Debugging

---

## 🎨 **Design Patterns**

**Wat het is:** Bewezen oplossingen voor veelvoorkomende problemen.

```typescript
// Singleton pattern
class DatabaseConnection {
  private static instance: DatabaseConnection;
  
  static getInstance() {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }
}

// Factory pattern
class UserFactory {
  static create(type: string) {
    switch (type) {
      case 'admin': return new AdminUser();
      case 'user': return new RegularUser();
      default: throw new Error('Unknown user type');
    }
  }
}
```

**Waarom gebruiken:**
- Herbruikbare oplossingen
- Code organisatie
- Maintainability

---

## 🔧 **Modern JavaScript Features**

**Wat het is:** Nieuwe features in ES6+.

```typescript
// Classes
class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }
  
  greet() {
    return `Hello, I'm ${this.name}`;
  }
}

// Modules
export class AuthService {}
import { AuthService } from './auth.service.js';

// Generators
function* idGenerator() {
  let id = 1;
  while (true) {
    yield id++;
  }
}
```

**Waarom gebruiken:**
- Modern development
- Better tooling
- Improved performance

---

## 🎯 **Best Practices**

**Wat het is:** Aanbevolen manieren van coderen.

```typescript
// Consistent naming
const userName = 'john'; // camelCase
const USER_ROLES = ['admin', 'user']; // UPPER_SNAKE_CASE voor constants

// Type safety
interface User {
  id: number;
  name: string;
}

// Error handling
const result = await riskyOperation().catch(error => {
  logger.error('Operation failed:', error);
  return defaultValue;
});

// Code organization
// - One responsibility per function
// - Clear naming
// - Proper comments
// - Consistent formatting
```

**Waarom volgen:**
- Maintainable code
- Team collaboration
- Fewer bugs
- Professional development

---

## 📚 **Samenvatting**

Deze begrippenlijst bevat alle belangrijke JavaScript/TypeScript concepten die we hebben gebruikt in ons authentication project. Elk concept heeft zijn eigen use case en voordelen. Door deze te begrijpen en toe te passen, schrijf je moderne, maintainable en professionele code! 🚀
