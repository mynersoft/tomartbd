import { connectDB } from '@/lib/db';
import Bogo from '@/models/Bogo';
import { authOptions } from '@/lib/auth';

export async function DELETE(req, { params }) {
  try {
    // const session = await getServerSession(authOptions);

    // if (!session) {
    //   return NextResponse.json(
    //     { success: false, message: 'Unauthorized' },
    //     { status: 401 }
    //   );
    // }

	  const id = await getIdFromReq(req);
	console.log(id, '===============================');
	

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Invalid bogo ID' },
        { status: 400 }
      );
    }

    await connectDB();

    const bogo = await Bogo.findById(id);

    if (!bogo) {
      return NextResponse.json(
        { success: false, message: 'Bogo not found' },
        { status: 404 }
      );
    } // ✅ FIXED: missing brace added



    await Bogo.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'Bogo deleted successfully',
    });
  } catch (error) {
    console.error('DELETE ERROR:', error);

    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
