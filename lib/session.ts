import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

export async function withAuth(
  handler: (
    request: NextRequest,
    session: { user: { id: string; email: string; name: string } }
  ) => Promise<NextResponse>
) {
  return async (request: NextRequest) => {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "인증이 필요합니다" },
        { status: 401 }
      );
    }

    return handler(request, session as any);
  };
}
