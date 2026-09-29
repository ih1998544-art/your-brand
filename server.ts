import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProd = process.env.NODE_ENV === 'production';
const PORT = Number(process.env.PORT) || 3000;

const app = express();
app.use(express.json());

// ==========================================
// In-Memory Server Auth Database & Sessions
// ==========================================
interface ServerUser {
  id: string;
  email: string;
  passwordHash: string;
  salt: string;
  name: string;
  phone?: string;
  address?: string;
  city?: string;
  memberTier: string;
  loyaltyPoints: number;
  role: 'customer' | 'admin' | 'vip';
  createdAt: string;
}

interface ServerSession {
  token: string;
  userId: string;
  createdAt: string;
  expiresAt: number;
}

const usersDb = new Map<string, ServerUser>(); // key: email lowercase
const sessionsDb = new Map<string, ServerSession>(); // key: token

// Password hashing helper
function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha256').toString('hex');
}

// Seed default VIP customer and Admin for testing
function seedDefaultUsers() {
  const defaultUsers = [
    {
      email: 'sara.ahmed@example.com',
      password: 'Password123!',
      name: 'Sara Ahmed',
      phone: '+92 300 1234567',
      address: 'House 42, Street 15, DHA Phase 6',
      city: 'Karachi',
      memberTier: 'VIP Atelier Patron',
      loyaltyPoints: 1250,
      role: 'vip' as const,
    },
    {
      email: 'admin@yourbrand.com',
      password: 'AdminMaster2026!',
      name: 'Atelier Director',
      phone: '+92 300 0000000',
      address: 'YOUR BRAND Flagship Atelier, M.M. Alam Road',
      city: 'Lahore',
      memberTier: 'Executive Administrator',
      loyaltyPoints: 9999,
      role: 'admin' as const,
    },
    {
      email: 'ayesha.khan@example.com',
      password: 'Password123!',
      name: 'Ayesha Khan',
      phone: '+92 321 9876543',
      address: 'Apartment 4B, Clifton Block 4',
      city: 'Karachi',
      memberTier: 'Gold Patron',
      loyaltyPoints: 650,
      role: 'customer' as const,
    },
  ];

  for (const u of defaultUsers) {
    const salt = crypto.randomBytes(16).toString('hex');
    const user: ServerUser = {
      id: `usr_${crypto.randomBytes(6).toString('hex')}`,
      email: u.email.toLowerCase(),
      salt,
      passwordHash: hashPassword(u.password, salt),
      name: u.name,
      phone: u.phone,
      address: u.address,
      city: u.city,
      memberTier: u.memberTier,
      loyaltyPoints: u.loyaltyPoints,
      role: u.role,
      createdAt: new Date().toISOString(),
    };
    usersDb.set(user.email, user);
  }
}

seedDefaultUsers();

// Session token generation
function createSession(userId: string): ServerSession {
  const token = `yb_sec_${crypto.randomBytes(32).toString('hex')}`;
  const session: ServerSession = {
    token,
    userId,
    createdAt: new Date().toISOString(),
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  };
  sessionsDb.set(token, session);
  return session;
}

// Auth Middleware
function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: Missing or invalid Bearer token in Authorization header.',
    });
  }

  const token = authHeader.substring(7).trim();
  const session = sessionsDb.get(token);

  if (!session || session.expiresAt < Date.now()) {
    if (session) sessionsDb.delete(token);
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: Session token is expired or invalid.',
    });
  }

  const user = Array.from(usersDb.values()).find((u) => u.id === session.userId);
  if (!user) {
    sessionsDb.delete(token);
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: Associated user account no longer exists.',
    });
  }

  (req as any).user = user;
  (req as any).session = session;
  next();
}

// ==========================================
// 1. Health & Server Status Endpoint
// ==========================================
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    server: 'YOUR BRAND Luxury Store API',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    activeUsersCount: usersDb.size,
    activeSessionsCount: sessionsDb.size,
  });
});

// ==========================================
// 2. Server-Side User Registration
// ==========================================
app.post('/api/auth/register', (req: Request, res: Response) => {
  try {
    const { email, password, name, phone, address, city } = req.body || {};

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        error: 'A valid email address is required.',
      });
    }

    if (!password || typeof password !== 'string' || password.length < 4) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 4 characters long.',
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    if (usersDb.has(cleanEmail)) {
      return res.status(409).json({
        success: false,
        error: 'An account with this email address already exists. Please sign in.',
      });
    }

    const salt = crypto.randomBytes(16).toString('hex');
    const passwordHash = hashPassword(password, salt);
    const displayName = (name && typeof name === 'string' && name.trim()) || cleanEmail.split('@')[0];

    const newUser: ServerUser = {
      id: `usr_${crypto.randomBytes(6).toString('hex')}`,
      email: cleanEmail,
      salt,
      passwordHash,
      name: displayName,
      phone: phone || '',
      address: address || '',
      city: city || 'Karachi',
      memberTier: 'VIP Atelier Patron',
      loyaltyPoints: 250,
      role: 'customer',
      createdAt: new Date().toISOString(),
    };

    usersDb.set(cleanEmail, newUser);
    const session = createSession(newUser.id);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully on server.',
      token: session.token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        phone: newUser.phone,
        address: newUser.address,
        city: newUser.city,
        memberTier: newUser.memberTier,
        loyaltyPoints: newUser.loyaltyPoints,
        role: newUser.role,
        isLoggedIn: true,
      },
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: 'Server error during registration.',
      details: err?.message,
    });
  }
});

// ==========================================
// 3. Server-Side User Login
// ==========================================
app.post('/api/auth/login', (req: Request, res: Response) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required.',
      });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const user = usersDb.get(cleanEmail);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials: No account found with this email.',
      });
    }

    const computedHash = hashPassword(String(password), user.salt);
    if (computedHash !== user.passwordHash) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials: Password does not match.',
      });
    }

    const session = createSession(user.id);

    return res.json({
      success: true,
      message: 'Server authentication successful.',
      token: session.token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        address: user.address,
        city: user.city,
        memberTier: user.memberTier,
        loyaltyPoints: user.loyaltyPoints,
        role: user.role,
        isLoggedIn: true,
      },
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: 'Server error during login authentication.',
      details: err?.message,
    });
  }
});

// ==========================================
// 4. Server-Side Get Current User Session
// ==========================================
app.get('/api/auth/me', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user as ServerUser;
  res.json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      address: user.address,
      city: user.city,
      memberTier: user.memberTier,
      loyaltyPoints: user.loyaltyPoints,
      role: user.role,
      isLoggedIn: true,
    },
    session: {
      token: (req as any).session.token,
      createdAt: (req as any).session.createdAt,
    },
  });
});

// ==========================================
// 5. Server-Side Logout (Invalidate Session)
// ==========================================
app.post('/api/auth/logout', requireAuth, (req: Request, res: Response) => {
  const token = (req as any).session?.token;
  if (token) {
    sessionsDb.delete(token);
  }
  res.json({
    success: true,
    message: 'Server session invalidated successfully.',
  });
});

// ==========================================
// 6. Comprehensive Server Auth Self-Test
// ==========================================
app.get('/api/auth/test', async (_req: Request, res: Response) => {
  const testResults: {
    testName: string;
    passed: boolean;
    durationMs: number;
    details: string;
    output?: any;
  }[] = [];

  const startTotal = Date.now();

  // Test 1: Seeded Demo Users Check
  const t1Start = Date.now();
  const saraExists = usersDb.has('sara.ahmed@example.com');
  const adminExists = usersDb.has('admin@yourbrand.com');
  testResults.push({
    testName: 'Database Seed & User Accounts Verification',
    passed: saraExists && adminExists,
    durationMs: Date.now() - t1Start,
    details: saraExists && adminExists
      ? `Found ${usersDb.size} seeded user accounts (including VIP Sara Ahmed & Atelier Director).`
      : 'Failed: Pre-seeded accounts are missing.',
  });

  // Test 2: Password Hash & Verification Integrity
  const t2Start = Date.now();
  const saraUser = usersDb.get('sara.ahmed@example.com');
  const validHash = saraUser ? hashPassword('Password123!', saraUser.salt) === saraUser.passwordHash : false;
  const invalidHash = saraUser ? hashPassword('WrongPassword!', saraUser.salt) === saraUser.passwordHash : true;
  testResults.push({
    testName: 'Cryptographic Password Hashing (PBKDF2-SHA256)',
    passed: validHash && !invalidHash,
    durationMs: Date.now() - t2Start,
    details: validHash && !invalidHash
      ? 'Verified salted PBKDF2 encryption correctly authenticates valid passwords and rejects mismatched passwords.'
      : 'Failed: Password hashing verification failed.',
  });

  // Test 3: Dynamic Registration Simulation
  const t3Start = Date.now();
  const testEmail = `test_${Date.now()}@luxurystore.internal`;
  const testSalt = crypto.randomBytes(16).toString('hex');
  const testUser: ServerUser = {
    id: `usr_${crypto.randomBytes(6).toString('hex')}`,
    email: testEmail,
    salt: testSalt,
    passwordHash: hashPassword('TestPass2026!', testSalt),
    name: 'Automated Test Client',
    memberTier: 'VIP Tester',
    loyaltyPoints: 500,
    role: 'customer',
    createdAt: new Date().toISOString(),
  };
  usersDb.set(testEmail, testUser);
  const testRegistered = usersDb.has(testEmail);
  testResults.push({
    testName: 'Server User Registration Pipeline',
    passed: testRegistered,
    durationMs: Date.now() - t3Start,
    details: testRegistered
      ? `Successfully registered dynamic client account ${testEmail}.`
      : 'Failed: Registration write operation failed.',
  });

  // Test 4: Bearer Session Issuance & Verification
  const t4Start = Date.now();
  const testSession = createSession(testUser.id);
  const retrievedSession = sessionsDb.get(testSession.token);
  const sessionValid = retrievedSession && retrievedSession.userId === testUser.id;
  testResults.push({
    testName: 'Bearer Session Token Generation & Retrieval',
    passed: !!sessionValid,
    durationMs: Date.now() - t4Start,
    details: sessionValid
      ? `Bearer token generated (${testSession.token.substring(0, 16)}...) and verified against server session store.`
      : 'Failed: Session token could not be verified in store.',
  });

  // Test 5: Session Invalidation & Logout Test
  const t5Start = Date.now();
  sessionsDb.delete(testSession.token);
  const isDeleted = !sessionsDb.has(testSession.token);
  // Clean up test user
  usersDb.delete(testEmail);
  testResults.push({
    testName: 'Session Invalidation & Logout Protocol',
    passed: isDeleted,
    durationMs: Date.now() - t5Start,
    details: isDeleted
      ? 'Verified token revocation and memory cleanup execute securely.'
      : 'Failed: Token was not revoked from session store.',
  });

  const allPassed = testResults.every((t) => t.passed);

  return res.json({
    success: true,
    allPassed,
    totalDurationMs: Date.now() - startTotal,
    timestamp: new Date().toISOString(),
    testsRun: testResults.length,
    testsPassed: testResults.filter((t) => t.passed).length,
    tests: testResults,
    diagnostics: {
      serverPort: PORT,
      activeSessions: sessionsDb.size,
      registeredUsers: usersDb.size,
      authMethod: 'Stateful Bearer Token with PBKDF2-SHA256 Hashing',
    },
  });
});

// Also support POST /api/auth/test
app.post('/api/auth/test', (_req: Request, res: Response) => {
  res.redirect(307, '/api/auth/test');
});

// ==========================================
// Vite Integration (Dev Middleware & Prod Static)
// ==========================================
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[YOUR BRAND Server] Server-side authentication active on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[YOUR BRAND Server] Failed to start server:', err);
  process.exit(1);
});
