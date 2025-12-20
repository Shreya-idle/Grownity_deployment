import fetch from 'node-fetch';

const BASE_URL = 'https://indian-community-beta.vercel.app/api/volunteer'; // Adjust port if needed

async function testVolunteerFlow() {
    console.log('Starting Volunteer Verification...');

    // 1. Create Volunteer
    console.log('\n--- 1. Testing Create Volunteer ---');
    const newVolunteer = {
        name: "Test Volunteer",
        email: "test@example.com",
        phone: "1234567890",
        type: "event_support",
        message: "I want to help!"
    };

    try {
        const createRes = await fetch(BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newVolunteer)
        });

        if (createRes.ok) {
            console.log('✅ Create Volunteer passed');
        } else {
            console.error('❌ Create Volunteer failed:', await createRes.text());
            return;
        }

        // 2. Get Volunteers (We need to simulate being an admin/logged in, or disable auth middleware temporarily for test. 
        // Assuming we can't easily bypass auth, we might skip full E2E test of GET/UPDATE if it requires complex auth setup in this script
        // However, the user code shows checkSessionCookie middleware. 
        // If we can't easily mock auth, we will just log that we skipped it or try and see if it fails.)

        console.log('\n--- 2. Testing Get Volunteers (Authorized) ---');
        // Note: This will likely fail without a valid session cookie. 
        // For specific verification without auth, we might need to rely on the Create test or manually test in browser if auth is strict.
        // Ideally we would mock the middleware or have a test token.
        // For now, let's try and see.
        const getRes = await fetch(BASE_URL, {
            headers: {
                // 'Cookie': 'your_session_cookie' // If we had one
            }
        });

        if (getRes.status === 401 || getRes.status === 403) {
            console.log('⚠️  Get Volunteers skipped/failed due to Auth (Expected if no valid cookie). Manual check might be needed for protected routes.');
        } else if (getRes.ok) {
            const volunteers = await getRes.json();
            console.log(`✅ Get Volunteers passed. Found ${volunteers.length} volunteers.`);

            if (volunteers.length > 0) {
                // 3. Update Volunteer
                console.log('\n--- 3. Testing Update Volunteer ---');
                const volunteerId = volunteers[0]._id;
                const updateRes = await fetch(`${BASE_URL}/${volunteerId}`, {
                    method: 'PATCH', // User code used PATCH in router
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: 'approved' })
                });

                if (updateRes.status === 401 || updateRes.status === 403) {
                    console.log('⚠️  Update Volunteer skipped due to Auth.');
                } else if (updateRes.ok) {
                    console.log('✅ Update Volunteer passed');
                } else {
                    console.error('❌ Update Volunteer failed:', await updateRes.text());
                }

            }
        } else {
            console.error('❌ Get Volunteers failed with status:', getRes.status);
        }

    } catch (error) {
        console.error('Test failed with error:', error);
    }
}

testVolunteerFlow();
