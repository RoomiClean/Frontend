/**
 * 클라이언트의 IP 주소를 가져옵니다.
 * @returns IP 주소 문자열 또는 null
 */
export const getClientIpAddress = async (): Promise<string | null> => {
  try {
    // 외부 API를 사용하여 IP 주소 가져오기
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip || null;
  } catch (error) {
    console.error('IP 주소를 가져오는 중 오류 발생:', error);
    return null;
  }
};

