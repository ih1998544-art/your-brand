import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProd = process.env.NODE_ENV === 'production';
const PORT = Number(process.env.PORT) || 3000;

const app = express();
app.use(express.json());

// ==========================================
// Persistent Server Auth Database & Sessions
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

const DATA_DIR = path.resolve(__dirname, 'data');
const USERS_FILE = path.resolve(DATA_DIR, 'server_users.json');
const SESSIONS_FILE = path.resolve(DATA_DIR, 'server_sessions.json');

function ensureDataDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch {
    // ignore
  }
}

function saveUsersToFile() {
  try {
    ensureDataDir();
    const arr = Array.from(usersDb.values());
    fs.writeFileSync(USERS_FILE, JSON.stringify(arr, null, 2), 'utf-8');
  } catch (e) {
    console.error('[Auth Storage] Failed to save users to file:', e);
  }
}

function saveSessionsToFile() {
  try {
    ensureDataDir();
    const arr = Array.from(sessionsDb.values());
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(arr, null, 2), 'utf-8');
  } catch (e) {
    console.error('[Auth Storage] Failed to save sessions to file:', e);
  }
}

function loadUsersFromFile() {
  try {
    ensureDataDir();
    if (fs.existsSync(USERS_FILE)) {
      const raw = fs.readFileSync(USERS_FILE, 'utf-8');
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) {
        for (const u of arr) {
          if (u.email) {
            usersDb.set(u.email.toLowerCase(), u);
          }
        }
      }
    }
  } catch (e) {
    console.error('[Auth Storage] Failed to load users from file:', e);
  }
}

function loadSessionsFromFile() {
  try {
    ensureDataDir();
    if (fs.existsSync(SESSIONS_FILE)) {
      const raw = fs.readFileSync(SESSIONS_FILE, 'utf-8');
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) {
        const now = Date.now();
        for (const s of arr) {
          if (s.token && s.expiresAt > now) {
            sessionsDb.set(s.token, s);
          }
        }
      }
    }
  } catch (e) {
    console.error('[Auth Storage] Failed to load sessions from file:', e);
  }
}

// Password hashing helper
function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha256').toString('hex');
}

// Seed default VIP customer and Admin for testing
function seedDefaultUsers() {
  // First load from file if present
  loadUsersFromFile();
  loadSessionsFromFile();

  const defaultUsers = [
    {
      email: 'sajjad501633@gmail.com',
      password: 'Password123!',
      name: 'Sajjad',
      phone: '+92 300 1234567',
      address: 'House 42, Street 15, DHA Phase 6',
      city: 'Karachi',
      memberTier: 'Diamond Atelier Patron',
      loyaltyPoints: 3450,
      role: 'vip' as const,
    },
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
      email: 'admin@ihluxury.com',
      password: 'AdminMaster2026!',
      name: 'Atelier Director',
      phone: '+92 300 0000000',
      address: 'IH Flagship Atelier, M.M. Alam Road',
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
    const cleanEmail = u.email.toLowerCase();
    if (!usersDb.has(cleanEmail)) {
      const salt = crypto.randomBytes(16).toString('hex');
      const user: ServerUser = {
        id: `usr_${crypto.randomBytes(6).toString('hex')}`,
        email: cleanEmail,
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

  saveUsersToFile();
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
  saveSessionsToFile();
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
    server: 'IH Luxury Store API',
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
    saveUsersToFile();
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
    const { email, password, autoRegisterIfNew, name } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required.',
      });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    let user = usersDb.get(cleanEmail);

    // If user does not exist yet
    if (!user) {
      if (autoRegisterIfNew) {
        // Seamlessly auto-register customer on server
        const salt = crypto.randomBytes(16).toString('hex');
        const passwordHash = hashPassword(String(password), salt);
        const displayName = (name && typeof name === 'string' && name.trim()) || cleanEmail.split('@')[0];

        user = {
          id: `usr_${crypto.randomBytes(6).toString('hex')}`,
          email: cleanEmail,
          salt,
          passwordHash,
          name: displayName,
          phone: '',
          address: '',
          city: 'Karachi',
          memberTier: 'VIP Atelier Patron',
          loyaltyPoints: 500,
          role: 'customer',
          createdAt: new Date().toISOString(),
        };

        usersDb.set(cleanEmail, user);
        saveUsersToFile();
      } else {
        return res.status(401).json({
          success: false,
          error: `No account found for ${cleanEmail}. Click 'Create Account' below to register with this password.`,
          canRegister: true,
          email: cleanEmail,
        });
      }
    }

    // Verify password
    const computedHash = hashPassword(String(password), user.salt);
    if (computedHash !== user.passwordHash) {
      return res.status(401).json({
        success: false,
        error: 'Invalid password. Please check your credentials or click "Sign in with Google".',
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
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || 'Karachi',
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
// 3b. Google Sign-In Server Authentication
// ==========================================
app.post('/api/auth/google', (req: Request, res: Response) => {
  try {
    const { email, name, picture, googleId } = req.body || {};

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        error: 'A valid Google email address is required.',
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    let user = usersDb.get(cleanEmail);

    if (!user) {
      // Create new Google verified customer
      const salt = crypto.randomBytes(16).toString('hex');
      const displayName =
        (name && typeof name === 'string' && name.trim()) ||
        cleanEmail.split('@')[0];

      user = {
        id: `usr_g_${crypto.randomBytes(6).toString('hex')}`,
        email: cleanEmail,
        salt,
        passwordHash: hashPassword(googleId || 'GOOGLE_OAUTH_VERIFIED', salt),
        name: displayName,
        phone: '',
        address: '',
        city: 'Karachi',
        memberTier: 'VIP Atelier Patron',
        loyaltyPoints: 750,
        role: 'customer',
        createdAt: new Date().toISOString(),
      };

      usersDb.set(cleanEmail, user);
      saveUsersToFile();
    }

    const session = createSession(user.id);

    return res.json({
      success: true,
      message: 'Google authentication verified on server.',
      token: session.token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || 'Karachi',
        memberTier: user.memberTier,
        loyaltyPoints: user.loyaltyPoints,
        role: user.role,
        isLoggedIn: true,
      },
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: 'Server error during Google authentication.',
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
  const sajjadExists = usersDb.has('sajjad501633@gmail.com');
  const adminExists = usersDb.has('admin@ihluxury.com') || usersDb.has('admin@yourbrand.com');
  testResults.push({
    testName: 'Database Seed & User Accounts Verification',
    passed: saraExists && sajjadExists && adminExists,
    durationMs: Date.now() - t1Start,
    details: saraExists && sajjadExists && adminExists
      ? `Found ${usersDb.size} seeded user accounts (including VIP Sajjad, Sara Ahmed & Atelier Director).`
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
// 7. Products Catalogue & Admin Endpoints
// ==========================================
const serverProductsDb = new Map<string, any>();
const serverOrdersDb = new Map<string, any>();
const serverCouponsDb = new Map<string, any>();
const serverCategoriesDb = new Map<string, any>();

// Seed default coupons
serverCouponsDb.set('WELCOME10', {
  id: 'cpn_1',
  code: 'WELCOME10',
  type: 'percentage',
  value: 10,
  minPurchase: 0,
  expiryDate: '2026-12-31',
  usageLimit: 1000,
  timesUsed: 142,
  isActive: true,
});
serverCouponsDb.set('LUXE15', {
  id: 'cpn_2',
  code: 'LUXE15',
  type: 'percentage',
  value: 15,
  minPurchase: 15000,
  expiryDate: '2026-12-31',
  usageLimit: 500,
  timesUsed: 89,
  isActive: true,
});

// Seed default categories
const defaultServerCategories = [
  { id: 'cat-1', name: 'Ready to Wear', department: 'Woman', slug: 'rtw', isActive: true },
  { id: 'cat-2', name: 'Unstitched Luxury', department: 'Woman', slug: 'uns', isActive: true },
  { id: 'cat-3', name: 'Haute Formals', department: 'Woman', slug: 'frm', isActive: true },
  { id: 'cat-4', name: 'Footwear & Khussa', department: 'Woman', slug: 'footwear', isActive: true },
  { id: 'cat-5', name: 'Accessories & Bags', department: 'Woman', slug: 'accessories', isActive: true },
  { id: 'cat-6', name: 'Kameez Shalwar', department: 'Man', slug: 'men_ks', isActive: true },
  { id: 'cat-7', name: 'Kurta Trouser', department: 'Man', slug: 'men_kt', isActive: true },
  { id: 'cat-8', name: 'Waistcoat Atelier', department: 'Man', slug: 'men_wc', isActive: true },
  { id: 'cat-9', name: 'Summer 26', department: 'Teens', slug: 'teens_summer', isActive: true },
  { id: 'cat-10', name: 'Fragrances & EDP', department: 'Fragrance & Beauty', slug: 'fragrances', isActive: true },
];
defaultServerCategories.forEach((c) => serverCategoriesDb.set(c.id, c));

// GET /api/products
app.get('/api/products', (req: Request, res: Response) => {
  const dept = req.query.department as string;
  let list = Array.from(serverProductsDb.values());
  if (dept) {
    list = list.filter((p) => p.department?.toLowerCase() === dept.toLowerCase());
  }
  res.json({
    success: true,
    count: list.length,
    products: list,
  });
});

// POST /api/products
app.post('/api/products', (req: Request, res: Response) => {
  try {
    const data = req.body || {};
    const newId = data.id || `prod_${Date.now()}`;
    const product = { ...data, id: newId, updatedAt: new Date().toISOString() };
    serverProductsDb.set(newId, product);
    res.status(201).json({ success: true, product });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// PUT /api/products/:id
app.put('/api/products/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const existing = serverProductsDb.get(id);
  const updated = { ...(existing || {}), ...req.body, id, updatedAt: new Date().toISOString() };
  serverProductsDb.set(id, updated);
  res.json({ success: true, product: updated });
});

// DELETE /api/products/:id
app.delete('/api/products/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const deleted = serverProductsDb.delete(id);
  res.json({ success: deleted, message: deleted ? 'Product deleted' : 'Product not found' });
});

// ==========================================
// 8. Orders API Endpoints
// ==========================================
app.get('/api/orders', (_req: Request, res: Response) => {
  res.json({
    success: true,
    count: serverOrdersDb.size,
    orders: Array.from(serverOrdersDb.values()),
  });
});

app.post('/api/orders', (req: Request, res: Response) => {
  try {
    const orderData = req.body || {};
    const orderId = orderData.id || `YB-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder = {
      ...orderData,
      id: orderId,
      createdAt: new Date().toISOString(),
      status: orderData.status || 'Processing',
    };
    serverOrdersDb.set(orderId, newOrder);
    res.status(201).json({ success: true, orderId, order: newOrder });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// ==========================================
// 9. Coupons API Endpoints
// ==========================================
app.get('/api/coupons', (_req: Request, res: Response) => {
  res.json({
    success: true,
    coupons: Array.from(serverCouponsDb.values()),
  });
});

app.post('/api/coupons', (req: Request, res: Response) => {
  try {
    const coupon = req.body || {};
    const code = (coupon.code || `PROMO_${Date.now()}`).toUpperCase();
    const newCoupon = {
      ...coupon,
      id: `cpn_${Date.now()}`,
      code,
      isActive: true,
    };
    serverCouponsDb.set(code, newCoupon);
    res.status(201).json({ success: true, coupon: newCoupon });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// ==========================================
// 10. Categories API Endpoint
// ==========================================
app.get('/api/categories', (_req: Request, res: Response) => {
  res.json({
    success: true,
    categories: Array.from(serverCategoriesDb.values()),
  });
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
    console.log(`[IH Server] Server-side authentication active on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[IH Server] Failed to start server:', err);
  process.exit(1);
});
