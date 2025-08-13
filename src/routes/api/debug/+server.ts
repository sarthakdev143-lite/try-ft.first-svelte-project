// src/routes/api/debug/+server.ts
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
    try {
        // Check environment variables first (without exposing sensitive data)
        const url = process.env.TURSO_DATABASE_URL;
        const authToken = process.env.TURSO_AUTH_TOKEN;
        
        console.log('Environment check:');
        console.log('TURSO_DATABASE_URL present:', !!url);
        console.log('TURSO_DATABASE_URL length:', url?.length || 0);
        console.log('TURSO_AUTH_TOKEN present:', !!authToken);
        console.log('TURSO_AUTH_TOKEN length:', authToken?.length || 0);
        console.log('TURSO_AUTH_TOKEN starts with:', authToken?.substring(0, 10) + '...');
        
        // Test direct libsql connection
        const { createClient } = await import("@libsql/client");
        
        console.log('Creating libsql client...');
        const client = createClient({
            url: url!,
            authToken: authToken!
        });
        
        console.log('Testing direct libsql query...');
        const result = await client.execute('SELECT 1 as test');
        console.log('Direct query result:', result);
        
        return new Response(JSON.stringify({
            status: 'OK',
            connection: 'Working',
            environment: {
                urlPresent: !!url,
                urlLength: url?.length || 0,
                tokenPresent: !!authToken,
                tokenLength: authToken?.length || 0,
                tokenPrefix: authToken?.substring(0, 10) + '...'
            },
            directQuery: result
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
        
    } catch (error) {
        console.error('Database debug error:', error);
        
        const url = process.env.TURSO_DATABASE_URL;
        const authToken = process.env.TURSO_AUTH_TOKEN;
        
        return new Response(JSON.stringify({
            status: 'ERROR',
            error: error instanceof Error ? error.message : 'Unknown error',
            environment: {
                urlPresent: !!url,
                urlLength: url?.length || 0,
                tokenPresent: !!authToken,
                tokenLength: authToken?.length || 0,
                tokenPrefix: authToken?.substring(0, 10) + '...'
            },
            stack: error instanceof Error ? error.stack : undefined
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};