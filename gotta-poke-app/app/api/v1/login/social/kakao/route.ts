import { NextRequest, NextResponse } from "next/server";
export const GET = async () => {
  try {
    const url = "	https://kauth.kakao.com/oauth/authorize";
    const response = await fetch(url, { method: "GET" });
    if (!response || !response.url)
      throw new Error("인가코드 발급에 실패했습니다.");
    return NextResponse.json(response.url);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error });
  }
};
export const POST = async (req: NextRequest) => {
  try {
    const request = await req.json();
    if (
      !request ||
      !request.grant_type ||
      !request.client_id ||
      !request.redirect_uri ||
      !request.code
    ) {
      throw new Error("잘못된 요청입니다.");
    }
    const url = "https://kauth.kakao.com/oauth/token";
    const bodyData = new URLSearchParams({
      grant_type: "authorization_code",
      client_id: process.env.KAKAO_REST_API_KEY || "",
      redirect_uri: request.redirect_uri,
      code: request.code,
    });
    if (request.client_secret) {
      bodyData.append("client_secret", request.client_secret);
    }
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
      body: bodyData.toString(),
    });

    if (!response.ok) {
      throw new Error(`카카오 API 호출 실패: ${response.statusText}`);
    }

    const responseData = await response.json();
    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: String(error) }, { status: 400 });
  }
};
