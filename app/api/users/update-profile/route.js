import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';

export async function PUT(req) {
  await connectDB();
  try {
    const body = await req.json();

    const session = await getServerSession(authOptions);

    if (!session)
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
      });

    const user = await User.findById(session.user.id);
    if (!user)
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
      });

    await User.findByIdAndUpdate(user._id, body, {
      new: true,
    });

    // Return user without sensitive data
    const userResponse = {
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      avatar: user.avatar,
      address: user.address,
    };

    return new Response(
      JSON.stringify({
        success: true,
        user: userResponse,
      }),
      { status: 200 }
    );
  } catch (err) {
    console.log('Update error:', err);

    return new Response(
      JSON.stringify({
        error: err.message || 'Update failed',
        details: err.errors,
      }),
      { status: 500 }
    );
  }
}
