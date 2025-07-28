import { NextRequest, NextResponse } from 'next/server';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export const POST = async (request: NextRequest): Promise<NextResponse> => {
  try {
    // OPTIONS 요청 처리
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, { status: 200, headers: corsHeaders });
    }

    const body = await request.json();
    
    // 필수 파라미터 확인
    if (!body.apiUrl || !body.apiKey) {
      return NextResponse.json({
        error: 'API URL과 API 키가 필요합니다.'
      }, { status: 400, headers: corsHeaders });
    }

    // apiKey와 apiUrl을 제외한 실제 API 요청 데이터 추출
    const { apiKey, apiUrl, ...apiRequestData } = body;

    // API 호출
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(apiRequestData),
    });

    const data = await response.json();
    return NextResponse.json(data, { headers: corsHeaders });

  } catch (error) {
    return NextResponse.json({
      error: '서버 오류가 발생했습니다.'
    }, { status: 500, headers: corsHeaders });
  }
};

export const OPTIONS = async (): Promise<NextResponse> => {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}; 