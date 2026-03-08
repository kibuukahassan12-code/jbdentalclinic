# Data Persistence Setup for JB Dental Clinic

This guide ensures your database data persists across redeployments and restarts on Koyeb.

## Overview

The application uses **SQLite** for data storage. By default, SQLite stores data in a file on disk. On container platforms like Koyeb, the filesystem is **ephemeral** - data is lost when the container restarts unless you use a **persistent volume**.

## Current Configuration

The app is configured to use a persistent volume at `/app/data`:

- **Database file**: `/app/data/appointments.db`
- **Backups**: `/app/data/backups/` (auto-created daily at 2 AM)
- **Volume name**: `jb-dental-db`

## Koyeb Setup Steps

### 1. Create the Persistent Volume

Before deploying, create a persistent volume on Koyeb:

```bash
# Using Koyeb CLI
koyeb volume create jb-dental-db --size 5 --region fra
```

Or via the Koyeb Console:
1. Go to your Koyeb dashboard
2. Navigate to **Volumes** → **Create Volume**
3. Name: `jb-dental-db`
4. Size: `5 GB` (minimum 1GB, adjust as needed)
5. Region: Choose the same region as your app

### 2. Deploy with Volume Attached

The `koyeb.yaml` file already includes the volume configuration:

```yaml
volumes:
  - id: jb-dental-db
    path: /app/data
```

### 3. Verify Data Persistence

After deployment, verify the volume is mounted:

```bash
# Check the Koyeb deployment logs
curl https://your-app.koyeb.app/api/health

# The app will log the database path on startup:
# "[db] Using database path: /app/data/appointments.db"
```

## Environment Variables

The following environment variables control database behavior:

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_PATH` | Full path to SQLite database file | `/app/data/appointments.db` |
| `BACKUP_CRON` | Cron schedule for automatic backups | `0 2 * * *` (daily at 2 AM) |
| `TZ` | Timezone for backup scheduling | `Africa/Kampala` |

## Backup & Recovery

### Automatic Backups

The app automatically creates daily backups at `/app/data/backups/appointments-YYYY-MM-DD.db`.

### Manual Backup

To manually backup your database:

```bash
# Access your service instance
koyeb service exec jb-dental-clinic /bin/sh

# Create a backup
cp /app/data/appointments.db /app/data/backups/manual-backup-$(date +%Y%m%d).db
```

### Restore from Backup

```bash
# Stop the service first (to prevent corruption)
# Then restore the backup
cp /app/data/backups/appointments-2024-01-15.db /app/data/appointments.db
```

## Troubleshooting

### Data Lost After Redeployment

If data is lost after redeployment:

1. **Check volume is attached**:
   ```bash
   koyeb service get jb-dental-clinic
   ```
   Ensure the `jb-dental-db` volume is listed under volumes.

2. **Verify environment variables**:
   Check that `DATABASE_PATH` is set to `/app/data/appointments.db`

3. **Check logs**:
   Look for the log message: `[db] Using database path: /app/data/appointments.db`
   If you see `[db] Fallback to local database path`, the volume is not mounted correctly.

### Database Locked Errors

If you see "database is locked" errors:

1. Ensure only one instance of the service is running
2. The app uses WAL mode (Write-Ahead Logging) which should prevent most locking issues

### Storage Full

If the volume runs out of space:

1. Check current usage:
   ```bash
   du -sh /app/data/
   ```

2. Clean up old backups:
   ```bash
   find /app/data/backups/ -name "*.db" -mtime +30 -delete
   ```

3. Expand the volume on Koyeb (requires service redeployment)

## Local Development

For local development, the database will use `./data/appointments.db` automatically (fallback path).

To use a custom local path:

```bash
DATABASE_PATH=./mydata/clinic.db npm run dev
```

## Migration from Non-Persistent Storage

If you have existing data in a non-persistent deployment:

1. Export your current data:
   ```bash
   # On your current instance
   sqlite3 /app/data/appointments.db ".dump" > backup.sql
   ```

2. Download the SQL dump:
   ```bash
   koyeb service cp jb-dental-clinic:/app/data/backup.sql ./backup.sql
   ```

3. Create the volume and redeploy

4. Restore data:
   ```bash
   koyeb service exec jb-dental-clinic -- sh -c "sqlite3 /app/data/appointments.db < /app/data/backup.sql"
   ```

## Important Notes

- **Always use the persistent volume** for production data
- **Never store the database file in the container filesystem** (it will be lost on restart)
- **Regular backups are created automatically** but you should also download backups periodically
- **The volume ID must match** between `koyeb.yaml` and your created volume

## Support

If you encounter issues with data persistence:

1. Check Koyeb documentation: https://www.koyeb.com/docs
2. Verify volume status in the Koyeb Console
3. Check application logs for database path messages
