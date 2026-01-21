# Pure Permission-Based Authorization (No Roles!)

## 🎯 The Architecture You Want

**Core Principle**: Every user has their own unique permission set. No pre-defined roles.

---

## 📊 Database Schema (Pure Permissions)

```prisma
// Permission catalog - all possible permissions in the system
model Permission {
  id          String   @id @default(cuid())
  resource    String   // "plants", "inventory", "clients", "financial"
  action      String   // "create", "read", "update", "delete", "export"
  code        String   @unique // "plants.create", "inventory.read"
  description String   // "Allows creating new plant entries"
  category    String   // "Plants", "Inventory", "Reports" (for UI grouping)
  
  userPermissions UserPermission[]
  
  createdAt   DateTime @default(now())
  
  @@unique([resource, action])
  @@index([category]) // For UI: show all "Plants" permissions together
  @@map("permissions")
}

// User's assigned permissions (the core of the system!)
model UserPermission {
  id           String     @id @default(cuid())
  userId       String
  permissionId String
  
  // Optional: temporal permissions
  expiresAt    DateTime?  // Permission expires automatically
  grantedAt    DateTime   @default(now())
  grantedBy    String     // Admin who granted this
  reason       String?    // Why was this granted? (audit trail)
  
  user         User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  permission   Permission @relation(fields: [permissionId], references: [id], onDelete: Cascade)
  
  @@unique([userId, permissionId]) // User can't have duplicate permissions
  @@index([userId]) // Fast lookup: what permissions does this user have?
  @@map("user_permissions")
}

// Updated User model (NO roleId!)
model User {
  id           String           @id @default(cuid())
  email        String           @unique
  firstName    String?
  lastName     String?
  passwordHash String
  isActive     Boolean          @default(true)
  
  tenantId     String
  tenant       Tenant           @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  
  // Direct permissions (no role!)
  permissions  UserPermission[]
  
  auditLogs    AuditLog[]
  preference   UserPreference?
  
  createdAt    DateTime         @default(now())
  updatedAt    DateTime         @updatedAt
  
  @@index([tenantId])
  @@index([email])
  @@map("users")
}

// OPTIONAL: Permission Templates (for convenience, not required!)
model PermissionTemplate {
  id          String   @id @default(cuid())
  name        String   // "Suggested: Field Worker", "Suggested: Manager"
  description String?  // "Common permissions for field workers"
  tenantId    String
  permissions String[] // ["plants.read", "inventory.read"] - just suggestions!
  
  tenant      Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  
  @@unique([tenantId, name])
  @@map("permission_templates")
}
```

---

## 🎨 How You Manage John Doe's Permissions

### Admin UI Flow:

```
┌──────────────────────────────────────────────────────────┐
│  Manage User: John Doe                                   │
├──────────────────────────────────────────────────────────┤
│  Email: john.doe@company.com                             │
│  Status: Active                                          │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │ Permissions                        [+ Add More]    │ │
│  ├────────────────────────────────────────────────────┤ │
│  │                                                    │ │
│  │ 🌱 Plants                                          │ │
│  │   ☑ plants.create    [Remove] [Expires: Never]   │ │
│  │   ☑ plants.read      [Remove] [Expires: Never]   │ │
│  │   ☑ plants.update    [Remove] [Expires: Never]   │ │
│  │   ☐ plants.delete    [Grant]                      │ │
│  │   ☐ plants.export    [Grant]                      │ │
│  │                                                    │ │
│  │ 📦 Inventory                                       │ │
│  │   ☑ inventory.read   [Remove] [Expires: Never]   │ │
│  │   ☐ inventory.create [Grant]                      │ │
│  │   ☐ inventory.update [Grant]                      │ │
│  │                                                    │ │
│  │ 👥 Clients                                         │ │
│  │   ☐ clients.read     [Grant]                      │ │
│  │   ☐ clients.create   [Grant]                      │ │
│  │                                                    │ │
│  │ 💰 Financial                                       │ │
│  │   ☐ financial.read   [Grant]                      │ │
│  │                                                    │ │
│  │ 📊 Reports                                         │ │
│  │   ☑ reports.create   [Remove] [Expires: 2026-12-31]│ │
│  │   ☐ reports.export   [Grant]                      │ │
│  │                                                    │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  Quick Templates (optional suggestions):                 │
│  [Apply: Common Field Worker]  ← Adds typical perms     │
│  [Apply: Common Manager]        ← Just a starting point │
│                                                          │
│  [Save Changes]                                          │
└──────────────────────────────────────────────────────────┘
```

### What Happens:

```typescript
// When you check "plants.create" for John
await prisma.userPermission.create({
  data: {
    userId: 'john-doe-id',
    permissionId: 'plants-create-permission-id',
    grantedBy: 'admin-id', // You
    reason: 'Needs to add new plants to inventory'
  }
});

// When you check "reports.create" with expiration
await prisma.userPermission.create({
  data: {
    userId: 'john-doe-id',
    permissionId: 'reports-create-permission-id',
    expiresAt: new Date('2026-12-31'),
    grantedBy: 'admin-id',
    reason: 'Temporary for Q4 reporting'
  }
});

// When you uncheck "inventory.update"
await prisma.userPermission.delete({
  where: {
    userId_permissionId: {
      userId: 'john-doe-id',
      permissionId: 'inventory-update-permission-id'
    }
  }
});
```

---

## 🚀 Seed Script (Permissions Catalog)

```typescript
// prisma/seed.ts

async function seedPermissions() {
  console.log('🔐 Creating permission catalog...');

  // Define ALL possible permissions in your system
  const permissions = [
    // Plants
    { resource: 'plants', action: 'create', category: 'Plants', description: 'Create new plant entries' },
    { resource: 'plants', action: 'read', category: 'Plants', description: 'View plant information' },
    { resource: 'plants', action: 'update', category: 'Plants', description: 'Update plant details' },
    { resource: 'plants', action: 'delete', category: 'Plants', description: 'Delete plants (soft delete)' },
    { resource: 'plants', action: 'export', category: 'Plants', description: 'Export plant data' },
    
    // Inventory
    { resource: 'inventory', action: 'create', category: 'Inventory', description: 'Add inventory items' },
    { resource: 'inventory', action: 'read', category: 'Inventory', description: 'View inventory' },
    { resource: 'inventory', action: 'update', category: 'Inventory', description: 'Update inventory levels' },
    { resource: 'inventory', action: 'delete', category: 'Inventory', description: 'Remove inventory items' },
    
    // Clients
    { resource: 'clients', action: 'create', category: 'Clients', description: 'Add new clients' },
    { resource: 'clients', action: 'read', category: 'Clients', description: 'View client information' },
    { resource: 'clients', action: 'update', category: 'Clients', description: 'Update client details' },
    { resource: 'clients', action: 'delete', category: 'Clients', description: 'Archive clients' },
    
    // Orders
    { resource: 'orders', action: 'create', category: 'Orders', description: 'Create new orders' },
    { resource: 'orders', action: 'read', category: 'Orders', description: 'View orders' },
    { resource: 'orders', action: 'update', category: 'Orders', description: 'Modify orders' },
    { resource: 'orders', action: 'cancel', category: 'Orders', description: 'Cancel orders' },
    
    // Financial
    { resource: 'financial', action: 'read', category: 'Financial', description: 'View financial data' },
    { resource: 'financial', action: 'create', category: 'Financial', description: 'Record transactions' },
    { resource: 'financial', action: 'export', category: 'Financial', description: 'Export financial reports' },
    
    // Reports
    { resource: 'reports', action: 'create', category: 'Reports', description: 'Generate reports' },
    { resource: 'reports', action: 'read', category: 'Reports', description: 'View reports' },
    { resource: 'reports', action: 'export', category: 'Reports', description: 'Export reports' },
    
    // Users (admin functions)
    { resource: 'users', action: 'create', category: 'Administration', description: 'Create new users' },
    { resource: 'users', action: 'read', category: 'Administration', description: 'View users' },
    { resource: 'users', action: 'update', category: 'Administration', description: 'Update user details' },
    { resource: 'users', action: 'delete', category: 'Administration', description: 'Deactivate users' },
    { resource: 'users', action: 'manage_permissions', category: 'Administration', description: 'Grant/revoke permissions' },
    
    // Settings
    { resource: 'settings', action: 'read', category: 'Settings', description: 'View system settings' },
    { resource: 'settings', action: 'update', category: 'Settings', description: 'Modify system settings' },
  ];

  for (const perm of permissions) {
    await prisma.permission.upsert({
      where: { code: `${perm.resource}.${perm.action}` },
      update: {},
      create: {
        resource: perm.resource,
        action: perm.action,
        code: `${perm.resource}.${perm.action}`,
        description: perm.description,
        category: perm.category,
      },
    });
  }

  console.log(`✅ Created ${permissions.length} permissions`);
}

async function seedRootUser(tenantId: string) {
  // Get ALL permissions
  const allPermissions = await prisma.permission.findMany();

  // Create root admin
  const passwordHash = await bcrypt.hash('Admin123!', 12);
  const rootUser = await prisma.user.create({
    data: {
      email: 'admin@admin.com',
      firstName: 'Root',
      lastName: 'Admin',
      passwordHash,
      isActive: true,
      tenantId,
    },
  });

  // Grant ALL permissions to root admin
  await prisma.userPermission.createMany({
    data: allPermissions.map(perm => ({
      userId: rootUser.id,
      permissionId: perm.id,
      grantedBy: rootUser.id, // Self-granted
      reason: 'Root admin - full access',
    })),
  });

  console.log(`✅ Root admin created with ${allPermissions.length} permissions`);
  return rootUser;
}

async function main() {
  const tenant = await prisma.tenant.create({
    data: {
      name: 'Default Organization',
    },
  });

  await seedPermissions();
  await seedRootUser(tenant.id);
  
  // Optional: Create templates for convenience
  await prisma.permissionTemplate.create({
    data: {
      name: 'Suggested: Basic Field Worker',
      description: 'Common permissions for field workers',
      tenantId: tenant.id,
      permissions: ['plants.read', 'plants.update', 'inventory.read'],
    },
  });

  await prisma.permissionTemplate.create({
    data: {
      name: 'Suggested: Manager',
      description: 'Common permissions for managers',
      tenantId: tenant.id,
      permissions: [
        'plants.create', 'plants.read', 'plants.update',
        'inventory.create', 'inventory.read', 'inventory.update',
        'clients.read',
        'reports.create', 'reports.read',
      ],
    },
  });
}
```

---

## 🛡️ Permission Checking (Updated)

```typescript
// src/shared/guards/permissions.guard.ts

async canActivate(context: ExecutionContext): Promise<boolean> {
  const requiredPermissions = this.reflector.get<string[]>(
    'permissions',
    context.getHandler(),
  );

  if (!requiredPermissions?.length) return true;

  const request = context.switchToHttp().getRequest();
  const user = request.user;

  // Get user's permissions (with caching in production!)
  const userPermissions = await prisma.userPermission.findMany({
    where: {
      userId: user.id,
      OR: [
        { expiresAt: null },
        { expiresAt: { gte: new Date() } },
      ],
    },
    include: { permission: true },
  });

  const permissionCodes = userPermissions.map(up => up.permission.code);

  // Check if user has required permissions
  const hasAllPermissions = requiredPermissions.every(required =>
    permissionCodes.includes(required)
  );

  if (!hasAllPermissions) {
    throw new ForbiddenException(
      `Missing permissions: ${requiredPermissions.join(', ')}`
    );
  }

  return true;
}
```

---

## ✅ Why This is PERFECT for Your Case

### ✅ Total Flexibility
- John has exactly HIS permissions
- Maria has exactly HER permissions
- No "roles" forcing people into boxes

### ✅ Granular Control
- Grant permission: Click checkbox
- Revoke permission: Uncheck checkbox
- Temporary permission: Set expiration date

### ✅ Full Audit Trail
- Who granted each permission? → `grantedBy`
- When was it granted? → `grantedAt`
- Why was it granted? → `reason`
- When does it expire? → `expiresAt`

### ✅ Performance
- Single query to get all user permissions
- Can cache aggressively (permissions don't change often)
- No complex joins

### ✅ UI is Simple
```
Admin sees:
- List of ALL permissions (grouped by category)
- Checkboxes for each
- John's checkboxes are checked/unchecked
- Click Save → Done!
```

---

## 🎯 Summary: Your Workflow

1. **Add new user John**
2. **Go to "Manage Permissions" for John**
3. **Check boxes** for what John can do:
   - ☑ plants.create
   - ☑ plants.read
   - ☑ inventory.read
   - ☐ financial.read (unchecked = can't do it)
4. **Save**
5. **Done!** John has exactly those permissions, nothing more, nothing less.

**No roles. Just permissions. Pure and simple.** ✨