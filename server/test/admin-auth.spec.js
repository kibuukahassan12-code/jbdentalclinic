import request from 'supertest';
import { afterEach, describe, expect, it } from 'vitest';
import { createTestContext } from './helpers.js';

const contexts = [];

afterEach(() => {
  while (contexts.length > 0) {
    contexts.pop().cleanup();
  }
});

async function setupContext() {
  const context = await createTestContext();
  contexts.push(context);
  return context;
}

describe('admin authentication and RBAC', () => {
  it('allows an admin user to log into the admin endpoint', async () => {
    const context = await setupContext();
    await context.createUserAccount({
      email: 'admin@example.com',
      password: 'StrongAdmin123!',
      role: 'admin',
    });

    const response = await request(context.app).post('/api/admin/login').send({
      email: 'admin@example.com',
      password: 'StrongAdmin123!',
    });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.token).toBeTruthy();
  });

  it('rejects non-admin users from the admin login endpoint', async () => {
    const context = await setupContext();
    await context.createUserAccount({
      email: 'staff@example.com',
      password: 'StaffPassword123!',
      role: 'staff',
    });

    const response = await request(context.app).post('/api/admin/login').send({
      email: 'staff@example.com',
      password: 'StaffPassword123!',
    });

    expect(response.status).toBe(403);
    expect(response.body.error).toMatch(/admin access/i);
  });

  it('protects admin-only routes from non-admin authenticated users', async () => {
    const context = await setupContext();
    const staffUser = await context.createUserAccount({
      email: 'dentist@example.com',
      password: 'DentistPassword123!',
      role: 'staff',
    });

    const token = context.signToken({
      sub: staffUser.email,
      role: staffUser.role,
      userId: staffUser.id,
    });

    const response = await request(context.app)
      .get('/api/users')
      .set('X-Api-Key', token);

    expect(response.status).toBe(403);
  });

  it('allows configured staff roles onto non-admin operational routes', async () => {
    const context = await setupContext();
    const receptionist = await context.createUserAccount({
      email: 'reception@example.com',
      password: 'Reception123!',
      role: 'receptionist',
    });

    const token = context.signToken({
      sub: receptionist.email,
      role: receptionist.role,
      userId: receptionist.id,
    });

    const response = await request(context.app)
      .get('/api/patients')
      .set('X-Api-Key', token);

    expect(response.status).toBe(200);
  });

  it('rejects invalid tokens before route authorization checks', async () => {
    const context = await setupContext();

    const token = context.signToken(
      { sub: 'tampered@example.com', role: 'staff', userId: 1 },
      'wrong-secret-for-negative-test'
    );

    const response = await request(context.app)
      .get('/api/users')
      .set('X-Api-Key', token);

    expect(response.status).toBe(401);
  });

  it('writes an audit log entry for successful admin login', async () => {
    const context = await setupContext();
    const created = await context.createUserAccount({
      email: 'audited-admin@example.com',
      password: 'AuditAdmin123!',
      role: 'admin',
    });

    const response = await request(context.app).post('/api/admin/login').send({
      email: created.email,
      password: 'AuditAdmin123!',
    });

    expect(response.status).toBe(200);

    const logs = context.getAuditLogs({ action: 'LOGIN', entity_type: 'user', limit: 10 });
    expect(logs.length).toBeGreaterThan(0);
    expect(logs[0].entity_id).toBe(created.id);
    expect(logs[0].user_email).toBe(created.email);
  });
});
