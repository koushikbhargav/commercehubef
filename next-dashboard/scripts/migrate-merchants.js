import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Load env vars
// Manually parse .env.local because dotenv might not find it if cwd is different or just to be safe
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    for (const k in envConfig) {
        process.env[k] = envConfig[k];
    }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const DATA_FILE = path.join(process.cwd(), 'merchants_db.json');

async function migrate() {
    if (!fs.existsSync(DATA_FILE)) {
        console.log('No local merchants_db.json found. Skipping migration.');
        return;
    }

    const rawData = fs.readFileSync(DATA_FILE, 'utf-8');
    const merchants = JSON.parse(rawData);

    console.log(`Found ${merchants.length} merchants to migrate.`);

    // Refresh schema cache just in case
    // await supabase.rpc('reload_schema'); // This might not be available or needed, but let's just retry the insert

    for (const m of merchants) {
        const dbProfile = {
            email: m.email,
            name: m.name,
            role: m.role,
            auth_method: m.authMethod,
            created_at: m.createdAt,
            branding: m.branding,
            org: m.org,
            verification_status: m.verificationStatus,
            is_onboarded: m.isOnboarded
        };

        const { data, error } = await supabase
            .from('merchants')
            .upsert(dbProfile, { onConflict: 'email' })
            .select();

        if (error) {
            console.error(`Failed to migrate ${m.email}:`, error);
        } else {
            if (data && data.length > 0) {
                console.log(`Migrated ${m.email} (New ID: ${data[0].id})`);
            } else {
                console.log(`Migrated ${m.email} (No data returned, but no error)`);
            }
        }
    }
}

migrate();
