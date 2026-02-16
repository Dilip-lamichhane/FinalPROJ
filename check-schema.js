let createClient;
try {
    ({ createClient } = require('@supabase/supabase-js'));
} catch (error) {
    ({ createClient } = require('./backend/node_modules/@supabase/supabase-js'));
}

// Supabase configuration
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://qbimoqxwrcqamnghiear.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFiaW1vcXh3cmNxYW1uZ2hpZWFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4NzQ4ODIsImV4cCI6MjA4NjQ1MDg4Mn0.EV4ZIxOVFZwy4aL1kfUO8imV4S_tZ8Hb5p8SEHtvI1E';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkDatabaseSchema() {
    console.log('🔍 Checking database schema...');
    
    try {
        // Check if shops table exists
        const { data: shopsData, error: shopsError } = await supabase
            .from('shops')
            .select('id')
            .limit(1);
            
        if (shopsError) {
            console.log('❌ Shops table error:', shopsError.message);
            console.log('📋 You need to create the database schema first!');
            console.log('');
            console.log('📝 Please run the following SQL in your Supabase SQL editor:');
            console.log('');
            console.log('1. Enable PostGIS extension:');
            console.log("   CREATE EXTENSION IF NOT EXISTS postgis;");
            console.log('');
            console.log('2. Create shops table:');
            console.log("   CREATE TABLE shops (");
            console.log("     id SERIAL PRIMARY KEY,");
            console.log("     name VARCHAR(255) NOT NULL,");
            console.log("     category VARCHAR(100) NOT NULL,");
            console.log("     address TEXT NOT NULL,");
            console.log("     latitude FLOAT NOT NULL,");
            console.log("     longitude FLOAT NOT NULL,");
            console.log("     location GEOGRAPHY(POINT, 4326)");
            console.log("   );");
            console.log('');
            console.log('3. Create products table:');
            console.log("   CREATE TABLE products (");
            console.log("     id SERIAL PRIMARY KEY,");
            console.log("     name VARCHAR(255) NOT NULL,");
            console.log("     price INTEGER NOT NULL,");
            console.log("     shop_id INTEGER NOT NULL,");
            console.log("     CONSTRAINT fk_shop FOREIGN KEY(shop_id) REFERENCES shops(id) ON DELETE CASCADE");
            console.log("   );");
            console.log('');
            console.log('📁 Or run the complete setup script from: setup-database.sql');
            return false;
        } else {
            console.log('✅ Shops table exists');
        }
        
        // Check if products table exists
        const { data: productsData, error: productsError } = await supabase
            .from('products')
            .select('id')
            .limit(1);
            
        if (productsError) {
            console.log('❌ Products table error:', productsError.message);
            return false;
        } else {
            console.log('✅ Products table exists');
        }
        
        // Check current data count
        const { count: shopsCount } = await supabase
            .from('shops')
            .select('*', { count: 'exact', head: true });
            
        const { count: productsCount } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true });
            
        console.log('');
        console.log('📊 Current database status:');
        console.log(`   Shops: ${shopsCount || 0}`);
        console.log(`   Products: ${productsCount || 0}`);
        
        return true;
        
    } catch (error) {
        console.error('❌ Database connection error:', error);
        return false;
    }
}

// Run the check
checkDatabaseSchema().then(canProceed => {
    if (canProceed) {
        console.log('');
        console.log('🎉 Database schema is ready! You can now run the seeder.');
        console.log('   Run: npm run seed');
    }
    process.exit(0);
}).catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
});
