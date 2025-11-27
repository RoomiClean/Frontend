import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const uploadUrl = formData.get('uploadUrl');
    const contentType = formData.get('contentType');

    if (!(file instanceof Blob) || typeof uploadUrl !== 'string' || typeof contentType !== 'string') {
      return NextResponse.json(
        {
          success: false,
          message: '잘못된 업로드 요청입니다.',
        },
        { status: 400 },
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const response = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': contentType,
        'Content-Length': buffer.byteLength.toString(),
      },
      body: buffer,
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        {
          success: false,
          message: 'S3 업로드에 실패했습니다.',
          status: response.status,
          statusText: response.statusText,
          error: errorText,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: '업로드가 완료되었습니다.',
    });
  } catch (error) {
    console.error('S3 업로드 프록시 오류:', error);
    return NextResponse.json(
      {
        success: false,
        message: '업로드 중 문제가 발생했습니다.',
      },
      { status: 500 },
    );
  }
}
